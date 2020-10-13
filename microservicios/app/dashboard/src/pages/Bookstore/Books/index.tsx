import React from "react";
import { Label, ModalVariant, Bullseye } from "@patternfly/react-core";
import { IconButton, Icon, Loader } from "rsuite";
import { classNames, sortable, Visibility } from "@patternfly/react-table";

import Table from "../../../components/Tables/GenericTable";
import Fuse from "fuse.js";
import { HeaderToolbar } from "../../../components/Tables/HeaderToolbar";
import { FooterToolbar } from "../../../components/Tables/FooterToolbar";

import ModalForm from "../../../components/Froms/ModalForms";
import DeleteModal from "../../../components/DeleteModal";

import _ from "lodash";
import { useEntity } from "../../../graphql";

import {
  validateString,
  validateBoolean,
} from "../../../components/Froms/Utils";

import { Author, Book } from "../../../graphql/queries/autogenerate/schemas";
import {
  CreateBookMutationVariables,
  UpdateBookMutationVariables,
} from "../../../graphql/queries/autogenerate/operations";
import {
  CreateBookDocument,
  DeleteBookDocument,
  GetBooksAndAuthorsDocument,
  UpdateBookDocument,
} from "../../../graphql/queries/autogenerate/hooks";

//=============================================================================
//#region Entity definition

export const ENTITY_NAME = "Book";

export const COLUMNS = [
  {
    key: "id",
    title: "Id",
    transforms: [sortable],
    columnTransforms: [classNames(Visibility.hidden || "")],
  },
  { key: "title", title: "Title", transforms: [sortable] },
  { key: "authorName", title: "Author", transforms: [sortable] },
  { key: "isPublished", title: "Published", transforms: [sortable] },
];

const FUSE_OPTIONS = {
  keys: COLUMNS.map((c) => c.key),
};

function transformRows(items: any[]) {
  if (!items) return [];
  return items.map((item) => ({
    cells: COLUMNS.map((column) => {
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
  authors: Author[];
}

const Books: React.FC = () => {
  const [state, setState] = React.useState<EntityPageState>({
    currentPage: 1,
    pageLimit: POSIBLE_LIMITS_PER_PAGE[POSIBLE_LIMITS_PER_PAGE.length - 1],
    searchText: "",
    isCreateUpdateModalOpen: false,
    isDeleteModalOpen: false,
    entity: undefined,
    items: [],
    authors: [],
  });
  const { currentPage, pageLimit } = state;
  const offset = (currentPage - 1) * pageLimit;

  const { loading, createItem, updateItem, removeItem } = useEntity<Book>({
    entityName: ENTITY_NAME,
    get: GetBooksAndAuthorsDocument,
    create: CreateBookDocument,
    update: UpdateBookDocument,
    remove: DeleteBookDocument,
    onChange: ({ items, data }) => {
      const newItems = items
        .filter((i) => _.find(data?.authors, { id: i.author?.id }))
        .map((i) => ({ ...i, authorName: i?.author?.name || "" }));
      setState({ ...state, items: newItems, authors: data?.authors || [] });
    },
  });

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
        <Bullseye>
          <Loader
            size="lg"
            speed="slow"
            content="loading..."
            className="spinner"
          />
        </Bullseye>
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
            <ModalForm<
              Book,
              CreateBookMutationVariables,
              UpdateBookMutationVariables
            >
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
                  options: (state.authors || []).map((a: any) => ({
                    id: a.id,
                    value: a.name,
                  })),
                  direction: "up",
                },
              ]}
              onClose={onCloseAnyModal}
              entity={state.entity}
              create={createItem}
              update={updateItem}
            />
          )}
          {state.isDeleteModalOpen && removeItem && (
            <DeleteModal
              entityName={ENTITY_NAME}
              onClose={onCloseAnyModal}
              entity={state.entity}
              rm={removeItem}
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

export default Books;
