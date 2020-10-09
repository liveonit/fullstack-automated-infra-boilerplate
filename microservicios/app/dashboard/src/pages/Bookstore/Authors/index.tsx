import React from "react";
import { ModalVariant, Spinner } from "@patternfly/react-core";
import { IconButton, Icon } from "rsuite";
import { sortable } from "@patternfly/react-table";
import { capitalize } from "../../../utils/general/capitalize";
import Table from "../../../components/Tables/GenericTable";
import Fuse from "fuse.js";
import { HeaderToolbar } from "../../../components/Tables/HeaderToolbar";
import { FooterToolbar } from "../../../components/Tables/FooterToolbar";

import ModalForm from "../../../components/Froms/ModalForms";
import DeleteModal from "../../../components/DeleteModalUpd";

import _ from "lodash";

import {
  validateAge,
  validateCountry,
  validateFullName,
} from "../../../components/Froms/Utils";

import {
  useCreateAuthorMutation,
  useUpdateAuthorMutation,
  useDeleteAuthorMutation,
  useGetAuthorsQuery,
} from "../../../graphql/queries/autogenerate/hooks";
import { Author } from "../../../graphql/queries/autogenerate/schemas";
import {
  CreateAuthorMutationVariables,
  UpdateAuthorMutationVariables,
} from "../../../graphql/queries/autogenerate/operations";
import { EntityProp } from "../../../graphql/helpers";

//=============================================================================
//#region Entity definition

export const ENTITY_NAME = "Author";

export const ENTITY_PROPS: EntityProp[] = [
  { name: "name", type: "String", required: true },
  { name: "age", type: "Int", required: true },
  { name: "country", type: "String", required: false },
];

export const COLUMNS = [
  { key: "id", title: "Id", transforms: [sortable] },
  ...ENTITY_PROPS.map((e) => ({
    key: e.name,
    title: capitalize(e.name),
    transforms: [sortable],
  })),
];

const FUSE_OPTIONS = {
  keys: ENTITY_PROPS.map((e) => e.name),
};

function transformRows(items: any[]) {
  if (items === undefined) return [];
  return items.map((item) => ({
    cells: COLUMNS.map((column) => {
      if (column.key === "xxx") {
        return {
          title: "modify value of column",
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
  entity?: Author;
  items: Author[];
}

const EntityPage: React.FC = () => {
  const [state, setState] = React.useState<EntityPageState>({
    currentPage: 1,
    pageLimit: POSIBLE_LIMITS_PER_PAGE[POSIBLE_LIMITS_PER_PAGE.length - 1],
    searchText: "",
    isCreateUpdateModalOpen: false,
    isDeleteModalOpen: false,
    entity: undefined,
    items: [],
  });
  const { currentPage, pageLimit } = state;
  const offset = (currentPage - 1) * pageLimit;

  const { data, loading } = useGetAuthorsQuery();
  React.useEffect(() => {
    if (data && data.authors) {
      setState({ ...state, items: data.authors });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, loading]);

  const [createAuthor, createAuthorResult] = useCreateAuthorMutation();
  if (createAuthorResult.data?.createAuthor) {
    const newItems: Author[] = [
      ...state.items,
      createAuthorResult.data.createAuthor,
    ];
    setState({ ...state, items: newItems });
  }

  const [updateAuthor, updateAuthorResult] = useUpdateAuthorMutation();
  if (updateAuthorResult.data?.updateAuthor) {
    const updAuthor = updateAuthorResult.data.updateAuthor;
    const newItems: Author[] = state.items.map((i) =>
      i.id !== updAuthor.id ? i : updAuthor
    );
    setState({ ...state, items: newItems });
  }

  const [deleteAuthor, deleteAuthorResult] = useDeleteAuthorMutation();
  if (deleteAuthorResult.data?.deleteAuthor) {
    const delAuthor = deleteAuthorResult.data.deleteAuthor;
    const newItems: Author[] = state.items.filter((i) => i.id !== delAuthor);
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

  type k = keyof Author;

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
            <ModalForm<
              Author,
              CreateAuthorMutationVariables,
              UpdateAuthorMutationVariables
            >
              title={state.entity ? "Update Author" : "Create Author"}
              modalVariant={ModalVariant.small}
              fields={[
                {
                  keyName: "name",
                  label: "Full Name",
                  helperText: "Please enter Author's full name",
                  helperTextInvalid: "Full name has to be at least two words",
                  inputControl: {
                    required: true,
                    validate: validateFullName,
                  },
                  type: "TextInput",
                  textInputType: "text",
                },
                {
                  keyName: "age",
                  label: "Age",
                  helperText: "Please enter Author's age",
                  helperTextInvalid: "Age has to be a number",
                  inputControl: {
                    required: true,
                    validate: validateAge,
                  },
                  type: "TextInput",
                  textInputType: "number",
                },
                {
                  keyName: "country",
                  label: "Country",
                  helperText: "Please enter Author's country",
                  helperTextInvalid:
                    "If country is set, it has to be at least one word",
                  inputControl: {
                    required: false,
                    validate: validateCountry,
                  },
                  type: "TextInput",
                  textInputType: "text",
                },
              ]}
              onClose={onCloseAnyModal}
              entity={state.entity}
              create={createAuthor}
              update={updateAuthor}
            />
          )}
          {state.isDeleteModalOpen && (
            <DeleteModal
              entityName={ENTITY_NAME}
              onClose={onCloseAnyModal}
              entity={state.entity}
              rm={deleteAuthor}
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
