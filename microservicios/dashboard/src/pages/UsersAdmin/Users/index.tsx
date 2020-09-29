import React from "react";
import { ModalVariant, Spinner } from "@patternfly/react-core";
import { IconButton, Icon } from "rsuite";
import { sortable,
} from "@patternfly/react-table";
import { capitalize } from '../../../utils/General/capitalize'
import Table from "../../../components/Tables/GenericTable";
import Fuse from "fuse.js";
import { HeaderToolbar } from "../../../components/Tables/HeaderToolbar";
import { FooterToolbar } from "../../../components/Tables/FooterToolbar";

import ModalForm from "../../../components/Froms/ModalForms";
import DeleteModal from "../../../components/DeleteModal";

import { gqlHoC } from "../../../utils/General/GqlHoC";
import _ from "lodash";
import {
  createQueryToGetItems,
  createMutationToCreateItem,
  createMutationToUpdateItem,
  createMutationToDeleteItem,
  EntityProp,
} from "../../../utils/General/GqlHelpers";
import { validateAge, validateCountry, validateFullName } from "../../../components/Froms/Utils";
import { Subtract } from "utility-types";


//=============================================================================
//#region Entity definition

export const ENTITY_NAME = "Author"

export type EntityType = {
  id: string;
  username: string;
  enabled: boolean;
  firstName: string;
  lastName: string;
  email: string;
  realmRoles: string[];
};

export const ENTITY_PROPS: EntityProp[] = [
  { name: "username", type: "String", required: true },
  { name: "enabled", type: "Boolean", required: false },
  { name: "firstname", type: "String", required: true },
  { name: "lastname", type: "String", required: true },
  { name: "email", type: "String", required: true },
]

export const COLUMNS = [
  { key: "id", title: "Id", transforms: [sortable] },
  ...(ENTITY_PROPS.map(e => ({ key: e.name, title: capitalize(e.name), transforms: [sortable] })))
];

const FUSE_OPTIONS = {
  keys: ENTITY_PROPS.map(e => e.name),
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


interface EntityPageProps {
  get: () => void;
  create: ({
    variables,
  }: {
    variables: Subtract<EntityType, { id: string }>;
  }) => void;
  update: ({
    variables,
  }: {
    variables: EntityType;
  }) => void;
  remove: ({ variables: { id } }: { variables: { id: string } }) => void;
  loading: boolean;
  items: EntityType[];
  count: number;
}

interface EntityPageState {
  currentPage: number;
  pageLimit: number;
  searchText: string;
  isCreateUpdateModalOpen: boolean;
  isDeleteModalOpen: boolean;
  entity?: EntityType;
}

const EntityPage: React.FC<EntityPageProps> = ({
  get,
  create,
  update,
  remove,
  loading,
  items,
  count,
}) => {
  const [state, setState] = React.useState<EntityPageState>({
    currentPage: 1,
    pageLimit: POSIBLE_LIMITS_PER_PAGE[POSIBLE_LIMITS_PER_PAGE.length - 1],
    searchText: "",
    isCreateUpdateModalOpen: false,
    isDeleteModalOpen: false,
    entity: undefined,
  });
  const { currentPage, pageLimit } = state;
  const offset = (currentPage - 1) * pageLimit;

  React.useEffect(() => {
    get();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  const onEdit = (id: string) => {
    const entity = _.find(items, (i) => i.id === id);
    setState({ ...state, entity, isCreateUpdateModalOpen: true });
  };

  const onDelete = (id: string) => {
    const entity = _.find(items, (i) => i.id === id);
    setState({ ...state, entity, isDeleteModalOpen: true });
  };

  //#endregion
  //===========================================================================

  //===========================================================================
  //#region Table elements filter by search and pagination

  const fuse = new Fuse(items, FUSE_OPTIONS);
  const tableItems = state.searchText
    ? fuse
        .search(state.searchText)
        .map((m) => m.item)
        .slice(offset, offset + pageLimit)
    : items.slice(offset, offset + pageLimit);
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
              title={state.entity ? "Update Author": "Create Author"}
              modalVariant={ModalVariant.small}
              fields={[ 
                { 
                  keyName: "name", label: "Full Name", 
                  helperText: "Please enter Author's full name", helperTextInvalid: "Full name has to be at least two words",
                  required: true,
                  type: "TextInput",
                  validateFunction: validateFullName,
                  testInputType: "text"
                },
                { 
                  keyName: "age", label: "Age", 
                  helperText: "Please enter Author's age", helperTextInvalid: "Age has to be a number",
                  required: true,
                  type: "TextInput",
                  validateFunction: validateAge,
                  testInputType: "number"
                },
                { 
                  keyName: "country", label: "Country", 
                  helperText: "Please enter Author's country", helperTextInvalid: "If country is set, it has to be at least one word",
                  required: false,
                  type: "TextInput",
                  validateFunction: validateCountry,
                  testInputType: "text"
                },
              ]}
              onClose={onCloseAnyModal}
              entity={state.entity}
              create={create}
              update={update}
            />
          )}
          {state.isDeleteModalOpen && (
            <DeleteModal
              entityName={ENTITY_NAME}
              onClose={onCloseAnyModal}
              entity={state.entity}
              rm={remove}
            />
          )}
          <Table columns={COLUMNS} items={tableItems} onDelete={onDelete} onEdit={onEdit} transformRows={transformRows} />
          <div className="pagination-footer">
            <FooterToolbar
              totalRecords={count}
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

export default gqlHoC<EntityType>({
  entityName: ENTITY_NAME,
  readGql: createQueryToGetItems(ENTITY_NAME, ENTITY_PROPS.map(p => p.name)),
  createGql: createMutationToCreateItem(ENTITY_NAME, ENTITY_PROPS),
  updateGql: createMutationToUpdateItem(ENTITY_NAME, ENTITY_PROPS),
  removeGql: createMutationToDeleteItem(ENTITY_NAME),
})(EntityPage);
