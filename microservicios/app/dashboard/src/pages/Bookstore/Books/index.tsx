import React from "react";
import { Label, ModalVariant, Spinner } from "@patternfly/react-core";
import { IconButton, Icon } from "rsuite";
import { sortable } from "@patternfly/react-table";

import Table from "../../../components/Tables/GenericTable";
import Fuse from "fuse.js";
import { HeaderToolbar } from "../../../components/Tables/HeaderToolbar";
import { FooterToolbar } from "../../../components/Tables/FooterToolbar";

import ModalForm from "../../../components/Froms/ModalForms";
import DeleteModal from "../../../components/DeleteModal";

import _ from "lodash";
import {
  EntityProp,
  getCachedItems,
} from "../../../graphql";

import {
  validateString,
  validateBoolean,
} from "../../../components/Froms/Utils";


import { Book } from "../../../graphql/queries/autogenerate/schemas";
import {
  CreateBookMutationVariables,
  UpdateBookMutationVariables,
} from "../../../graphql/queries/autogenerate/operations";
import { useCreateBookMutation, useDeleteBookMutation, useGetBooksQuery, useUpdateBookMutation } from "../../../graphql/queries/autogenerate/hooks";

//=============================================================================
//#region Entity definition

export const ENTITY_NAME = "Book";


export const ENTITY_PROPS: EntityProp[] = [
  { name: "title", type: "String", required: true },
  { name: "authorId", type: "Int", required: true },
  { name: "isPublished", type: "Boolean", required: false },
];

export const COLUMNS = [
  { key: "id", title: "Id", transforms: [sortable] },
  { key: "title", title: "Title", transforms: [sortable] },
  { key: "author", title: "Author", transforms: [sortable] },
  { key: "isPublished", title: "Published", transforms: [sortable] },
];

const FUSE_OPTIONS = {
  keys: ENTITY_PROPS.map((e) => e.name),
};

function transformRows(items: any[]) {
  if (items === undefined) return [];
  const authors = getCachedItems(
    "Author",
    ["name"]
  );
  return items.map((item) => ({
    cells: COLUMNS.map((column) => {
      if (column.key === "author") {
        return {
          title: _.find(authors, { id: item.authorId })?.name,
        };
      }
      if (column.key === "isPublished") {
        let label = _.get(item, column.key, false);
        const className = label ? "greenLabel" : "normalLabel";
        return {
          title: <Label className={className}>{label ? "YES" : "NO"}</Label>,
        };
      } else return _.get(item, column.key);
    }),
  }));
}

//#endregion
//=============================================================================

const POSIBLE_LIMITS_PER_PAGE = [10, 25, 50, 100];


interface EntityPageState {
  currentPage: number;
  pageLimit: number;
  searchText: string;
  isCreateUpdateModalOpen: boolean;
  isDeleteModalOpen: boolean;
  entity?: Book;
  items: Book[];
}

const EntityPage: React.FC = () => {
  const [state, setState] = React.useState<EntityPageState>({
    currentPage: 1,
    pageLimit: POSIBLE_LIMITS_PER_PAGE[POSIBLE_LIMITS_PER_PAGE.length - 1],
    searchText: "",
    isCreateUpdateModalOpen: false,
    isDeleteModalOpen: false,
    entity: undefined,
    items: []
  });
  const { currentPage, pageLimit } = state;
  const offset = (currentPage - 1) * pageLimit;

  const { data, loading } = useGetBooksQuery();
  React.useEffect(() => {
    if (data && data.books) {
      setState({ ...state, items: data.books });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, loading]);

  const [createBook, createBookResult] = useCreateBookMutation();
  if (createBookResult.data?.createBook) {
    const newItems: Book[] = [
      ...state.items,
      createBookResult.data.createBook,
    ];
    setState({ ...state, items: newItems });
  }

  const [updateBook, updateBookResult] = useUpdateBookMutation();
  if (updateBookResult.data?.updateBook) {
    const updBook = updateBookResult.data.updateBook;
    const newItems: Book[] = state.items.map((i) =>
      i.id !== updBook.id ? i : updBook
    );
    setState({ ...state, items: newItems });
  }

  const [deleteBook, deleteBookResult] = useDeleteBookMutation();
  if (deleteBookResult.data?.deleteBook) {
    const delBook = deleteBookResult.data.deleteBook;
    const newItems: Book[] = state.items.filter((i) => i.id !== delBook);
    setState({ ...state, items: newItems });
  }



  //===========================================================================
  //#region events

  const onPageLimitChanged = (n: number) => {
    setState({
      ...state,
      pageLimit: n,
      currentPage: 1,
    });
  };

  const onPageChanged = (page: number) => {
    setState({ ...state, currentPage: page });
  };

  const handleUpdateFilterInput = (searchText?: string) =>
    setState({ ...state, searchText: searchText || "" });

  const onCloseAnyModal = () =>
    setState({
      ...state,
      isCreateUpdateModalOpen: false,
      isDeleteModalOpen: false,
    });

  const onCreate = () => {
    setState({ ...state, entity: undefined, isCreateUpdateModalOpen: true });
  };
  const onEdit = (id: number) => {
    const entity = _.find(state.items, (i) => i.id === id);
    setState({ ...state, entity, isCreateUpdateModalOpen: true });
  };

  const onDelete = (id: number) => {
    const entity = _.find(state.items, (i) => i.id === id);
    setState({ ...state, entity, isDeleteModalOpen: true });
  };

  //#endregion
  //===========================================================================

  //===========================================================================
  //#region Table elements filter by search and pagination

  const fuse = new Fuse(state.items, FUSE_OPTIONS);
  const tableItems = state.searchText
    ? fuse
        .search(state.searchText)
        .map((m) => m.item)
        .slice(offset, offset + pageLimit)
    : state.items.slice(offset, offset + pageLimit);
  //#endregion
  //===========================================================================

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <HeaderToolbar
            hasFilter={true}
            hasDateTimeFilter={false}
            handleUpdateFilterInput={handleUpdateFilterInput}
            hasCreateEntity={true}
            CreateEntityChild={
              <IconButton icon={<Icon icon="plus" />} onClick={onCreate}>
                {`Create ${ENTITY_NAME}`}
              </IconButton>
            }
          />
          {state.isCreateUpdateModalOpen && (
            <ModalForm<Book,CreateBookMutationVariables, UpdateBookMutationVariables>
              title={state.entity ? "Update Book" : "Create Book"}
              modalVariant={ModalVariant.small}
              fields={[
                {
                  keyName: "title",
                  label: "Book Title",
                  helperText: "Please enter the Book title",
                  helperTextInvalid: "Book title is at least one word",
                  inputControl: {
                    required: true,
                    validate: validateString,
                  },
                  type: "TextInput",
                  textInputType: "text",
                },
                {
                  keyName: "isPublished",
                  label: "Is Published?",
                  helperText: "Select if book is currently published",
                  helperTextInvalid: "Active means that the book is published",
                  inputControl: {
                    required: false,
                    validate: validateBoolean,
                  },
                  type: "ToggleSwitch",
                },
                {
                  keyName: "authorId",
                  label: "Book's author",
                  helperText: "Please select the Book's Author",
                  helperTextInvalid: "Author must be selected",
                  inputControl: {
                    required: false,
                    validate: validateString,
                  },
                  type: "SelectWithFilter",
                  options: getCachedItems(
                    "Author",
                    ["name"]
                  ).map((a: any) => ({
                    id: a.id,
                    value: a.name,
                  })),
                },
              ]}
              onClose={onCloseAnyModal}
              entity={state.entity}
              create={createBook}
              update={updateBook}
            />
          )}
          {state.isDeleteModalOpen && (
            <DeleteModal
              entityName={ENTITY_NAME}
              onClose={onCloseAnyModal}
              entity={state.entity}
              rm={deleteBook}
            />
          )}
          <Table
            columns={COLUMNS}
            items={tableItems}
            onDelete={onDelete}
            onEdit={onEdit}
            transformRows={transformRows}
          />
          <div className="pagination-footer">
            <FooterToolbar
              totalRecords={state.items.length}
              pageLimit={pageLimit}
              currentPage={currentPage}
              posibleLimitsPerPage={POSIBLE_LIMITS_PER_PAGE}
              onPageLimitChanged={onPageLimitChanged}
              onPageChanged={onPageChanged}
            />
          </div>
        </>
      )}
    </>
  );
};

export default EntityPage;
