import React from "react";
import { Label, ModalVariant, Spinner } from "@patternfly/react-core";
import { IconButton, Icon, TagGroup, Tag } from "rsuite";
import { sortable, classNames, Visibility  } from "@patternfly/react-table";
import { capitalize } from "../../../utils/general/capitalize";
import Table from "../../../components/Tables/GenericTable";
import Fuse from "fuse.js";
import { HeaderToolbar } from "../../../components/Tables/HeaderToolbar";
import { FooterToolbar } from "../../../components/Tables/FooterToolbar";

import ModalForm from "../../../components/Froms/ModalForms";
import DeleteModal from "../../../components/DeleteModal";

import _ from "lodash";
import {
  createQueryToGetItems,
  createMutationToCreateItem,
  createMutationToUpdateItem,
  createMutationToDeleteItem,
  EntityProp,
  gqlHoC
} from "../../../graphql";
import {
  validateAtLeastOneOptionRequired,
  validateBoolean,
  validateEmail,
  validatePassword,
  validateString,
  validateUsername,
} from "../../../components/Froms/Utils";
import { Subtract } from "utility-types";
import { hashCode } from "../../../utils/general/stringHash";
import { useQuery } from "@apollo/client";

const TAGS_COLORS = ["red","orange","yellow","green","cyan","blue","violet"]

//=============================================================================
//#region Entity definition

export const ENTITY_NAME = "User";

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
  { name: "id", type: "String", required: false },
  { name: "username", type: "String", required: true },
  { name: "password", type: "String", required: true },
  { name: "email", type: "String", required: true },
  { name: "firstName", type: "String", required: true },
  { name: "lastName", type: "String", required: true },
  { name: "enabled", type: "Boolean", required: true },
  { name: "realmRoles", type: "[String!]", required: true }
];

export const COLUMNS = [
  ...ENTITY_PROPS.map((e) => ({
    key: e.name,
    title: capitalize(e.name),
    transforms: [sortable],
    ...(e.name === "id" && {columnTransforms: [classNames(Visibility.hidden || "")]})
  })).filter(e => ((e.key !== "realmRoles") && (e.key !== 'password'))),
  { key: "realmRoles", title: "Roles", transforms: [sortable] },
];

const FUSE_OPTIONS = {
  keys: ENTITY_PROPS.map((e) => e.name),
};

function transformRows(items: any[]) {
  if (items === undefined) return [];
  return items.map((item) => ({
    cells: COLUMNS.map((column) => {
      if (column.key === "realmRoles") {
        return {
          title: item?.realmRoles ? (
            <TagGroup>
              {item.realmRoles.map((r: any) => (
                <Tag key={r} color={TAGS_COLORS[hashCode(r) % TAGS_COLORS.length]}>{r}</Tag>
              ))}
            </TagGroup>
          ) : (
            ""
          ),
        };
      } else if (column.key === "enabled") {
        let label = _.get(item, column.key, false);
        const className = label ? "greenLabel" : "normalLabel";
        return {
          title: <Label className={className}>{label ? "YES" : "NO"}</Label>,
        }; 
      }
      else return _.get(item, column.key);
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
  update: ({ variables }: { variables: EntityType }) => void;
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

const EntityPage: React.FC<EntityPageProps> = (props) => {
  const {
    create,
    update,
    remove,
    loading,
    items,
    count,
  } = props;

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

  
  const { data } = useQuery(createQueryToGetItems("Role", [{ name: "name", type: "String", required: true }]))
  const { roles } = data || { roles: []}
  

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
              title={state.entity ? "Update Author" : "Create Author"}
              modalVariant={ModalVariant.small}
              fields={[
                {
                  keyName: "username",
                  label: "Username",
                  helperText: "Insert username",
                  helperTextInvalid: 'Text must be at least 8 characters long and must not begin or end with "." or "_" and does not contain spaces or special characters other than "-" or "_"',
                  required: true,
                  type: "TextInput",
                  validateFunction: validateUsername,
                  textInputType: "text",
                },
                {
                  keyName: "password",
                  label: "Password",
                  helperText: "Insert passwrd",
                  helperTextInvalid: 'Password must be at least 8 characters long and include uppercase lowercase and numbers',
                  required: true,
                  type: "Password",
                  validateFunction: validatePassword,
                  textInputType: "password",
                },
                {
                  keyName: "firstName",
                  label: "First Name",
                  helperText: "Please enter User's first name",
                  helperTextInvalid:
                    "It has to be at least one word",
                  required: true,
                  type: "TextInput",
                  validateFunction: validateString,
                  textInputType: "text",
                },
                {
                  keyName: "lastName",
                  label: "Last Name",
                  helperText: "Please enter User's last name",
                  helperTextInvalid:
                    "It has to be at least one word",
                  required: true,
                  type: "TextInput",
                  validateFunction: validateString,
                  textInputType: "text",
                },
                {
                  keyName: "email",
                  label: "Email",
                  helperText: "Please enter User's email",
                  helperTextInvalid:
                    "The email must be in the format: xxx@xxx.xxx",
                  required: true,
                  type: "TextInput",
                  validateFunction: validateEmail,
                  textInputType: "email",
                },
                {
                  keyName: "enabled",
                  label: "Is Enable?",
                  helperText: "Select if user is currently enabled",
                  helperTextInvalid: "Active means that the user is enabled",
                  required: false,
                  type: "ToggleSwitch",
                  validateFunction: validateBoolean,
                },
                {
                  keyName: "realmRoles",
                  label: "Select user's roles",
                  helperText: "Please select the User's Role",
                  helperTextInvalid: "At least one role must be selected",
                  required: true,
                  type: "MultiSelectWithFilter",
                  validateFunction: validateAtLeastOneOptionRequired,
                  options: (roles || []).map((a: any) => ({
                    id: a.id,
                    value: a.name,
                  })),
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
          <Table
            columns={COLUMNS}
            items={tableItems}
            onDelete={onDelete}
            onEdit={onEdit}
            transformRows={transformRows}
          />
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
  readGql: createQueryToGetItems(
    ENTITY_NAME,
    ENTITY_PROPS
  ),
  createGql: createMutationToCreateItem(ENTITY_NAME, ENTITY_PROPS),
  updateGql: createMutationToUpdateItem(ENTITY_NAME, ENTITY_PROPS),
  removeGql: createMutationToDeleteItem(ENTITY_NAME, ENTITY_PROPS),
})(EntityPage);
