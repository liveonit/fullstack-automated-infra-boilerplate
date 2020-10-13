import React from "react";
import { ModalVariant, Spinner } from "@patternfly/react-core";
import { IconButton, Icon } from "rsuite";
import { sortable, classNames, Visibility } from "@patternfly/react-table";

import Table from "../../../components/Tables/GenericTable";
import Fuse from "fuse.js";
import { HeaderToolbar } from "../../../components/Tables/HeaderToolbar";
import { FooterToolbar } from "../../../components/Tables/FooterToolbar";

import ModalForm from "../../../components/Froms/ModalForms";
import DeleteModal from "../../../components/DeleteModal";

import _ from "lodash";
import { 
  useEntity
} from "../../../graphql";

import { validateString, validateUsername } from "../../../components/Froms/Utils";

import { Role } from '../../../graphql/queries/autogenerate/schemas'
import { GetRolesDocument, CreateRoleDocument, UpdateRoleDocument, DeleteRoleDocument } from '../../../graphql/queries/autogenerate/hooks'

//=============================================================================
//#region Table configuration

export const ENTITY_NAME = "Role";

export type EntityType = {
  id: number;
  name: string;
  description?: number;
};


export const COLUMNS = [
  { key: "id", title: "Id", transforms: [sortable], columnTransforms: [classNames(Visibility.hidden || "")] },
  { key: "name", title: "Name", transforms: [sortable] },
  { key: "description", title: "Description", transforms: [sortable] },
];

const FUSE_OPTIONS = {
  keys: COLUMNS.map((c) => c.key),
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

const POSIBLE_LIMITS_PER_PAGE = [10, 25, 50, 100];
//#endregion
//=============================================================================

interface EntityPageState {
  currentPage: number;
  pageLimit: number;
  searchText: string;
  isCreateUpdateModalOpen: boolean;
  isDeleteModalOpen: boolean;
  entity?: Role;
  items: Role[];
}

const RolesPage: React.FC = () => {
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



  const { loading, createItem, updateItem, removeItem } = useEntity<Role>({
    entityName: ENTITY_NAME,
    get: GetRolesDocument,
    create: CreateRoleDocument,
    update: UpdateRoleDocument,
    remove: DeleteRoleDocument,
    onChange: ({ items }) => {
      setState({ ...state, items })
    }
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
  const onEdit = (id: any) => {
    const entity = _.find(state.items, (i) => i.id === id);
    setState({ ...state, entity, isCreateUpdateModalOpen: true });
  };

  const onDelete = (id: any) => {
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
            <ModalForm
              title={state.entity ? "Update Book" : "Create Book"}
              modalVariant={ModalVariant.small}
              fields={[
                {
                  keyName: "name",
                  label: "Role name",
                  helperText: "Insert a representarive name to the role",
                  helperTextInvalid: 'Text must be at least 8 characters long and must not begin or end with "." or "_" and does not contain spaces or special characters other than "-" or "_"',
                  inputControl: {
                    required: true,
                    validate: validateUsername,
                  },
                  type: "TextInput",
                  textInputType: "text",
                },
                {
                  keyName: "description",
                  label: "Role description",
                  helperText: "Insert a description to the role",
                  helperTextInvalid: "",
                  inputControl: {
                    required: true,
                    validate: validateString,
                  },
                  type: "TextInput",
                  textInputType: "text",
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

export default RolesPage;
