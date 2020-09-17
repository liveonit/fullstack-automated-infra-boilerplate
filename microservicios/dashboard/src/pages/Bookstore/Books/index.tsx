import React from "react";
import { ModalVariant, Spinner } from "@patternfly/react-core";
import { IconButton, Icon } from "rsuite";
import { sortable,
} from "@patternfly/react-table";

import Table from "./Table";
import Fuse from "fuse.js";
import { HeaderToolbar } from "../../../components/Tables/HeaderToolbar";
import { FooterToolbar } from "../../../components/Tables/FooterToolbar";

import ModalForm from "../../../components/Froms/ModalForms";
import DeleteModal from "./DeleteModal";

import { gqlHoC } from "../../../utils/General/GqlHoC";
import _ from "lodash";
import {
  createQueryToGetItems,
  createMutationToCreateItem,
  createMutationToUpdateItem,
  createMutationToDeleteItem,
  EntityProp, getCachedItems
} from "../../../utils/General/GqlHelpers";

import { validateString, validateBoolean } from "../../../components/Froms/Utils";


//=============================================================================
//#region Entity definition

export const ENTITY_NAME = "Book"

export type EntityType = {
  id: number;
  title: string;
  authorId: number;
  isPublished?: boolean;
};

export const ENTITY_PROPS: EntityProp[] = [
  { name: "title", type: "String", required: true },
  { name: "authorId", type: "Int", required: true },
  { name: "isPublished", type: "Boolean", required: false },
]

export const COLUMNS = [
  { key: "id", title: "Id", transforms: [sortable] },
  { key: "title", title: "Title", transforms: [sortable] },
  { key: "author", title: "Author", transforms: [sortable] },
  { key: "isPublished", title: "Published", transforms: [sortable] },

];

const FUSE_OPTIONS = {
  keys: ENTITY_PROPS.map(e => e.name),
};

//#endregion
//=============================================================================

const POSIBLE_LIMITS_PER_PAGE = [10, 25, 50, 100];


interface EntityPageProps {
  get: () => void;
  create: ({
    variables: { name, age, country },
  }: {
    variables: { name: String; age?: number; country?: String };
  }) => void;
  update: ({
    variables: { id, name, age, country },
  }: {
    variables: { id: number; name?: String; age?: number; country?: String };
  }) => void;
  remove: ({ variables: { id } }: { variables: { id: number } }) => void;
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
  const onEdit = (id: number) => {
    const entity = _.find(items, (i) => i.id === id);
    setState({ ...state, entity, isCreateUpdateModalOpen: true });
  };

  const onDelete = (id: number) => {
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
              title={state.entity ? "Update Book": "Create Book"}
              modalVariant={ModalVariant.small}
              fields={[ 
                { 
                  keyName: "title", label: "Book Title", 
                  helperText: "Please enter the Book title", helperTextInvalid: "Book title is at least one word",
                  required: true,
                  type: "TextInput",
                  validateFunction: validateString,
                  testInputType: "text"
                },
                { 
                  keyName: "isPublished", label: "Is Published?", 
                  helperText: "select if the book is currently published", helperTextInvalid: "Active means the book is published",
                  required: false,
                  type: "ToggleSwitch",
                  validateFunction: validateBoolean,
                },
                { 
                  keyName: "authorId", label: "Book's author", 
                  helperText: "Please select the Book's Author", helperTextInvalid: "Author must be selected",
                  required: false,
                  type: "SelectWithFilter",
                  validateFunction: validateString,
                  options: getCachedItems("Author").map(a => ({ id: a.id, value: a.name }))
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
              onClose={onCloseAnyModal}
              entity={state.entity}
              rm={remove}
            />
          )}
          <Table items={tableItems} onDelete={onDelete} onEdit={onEdit} />
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
