import React from "react";
import { Spinner } from "@patternfly/react-core";
import { IconButton, Icon } from "rsuite";

import Table from "./Table";
import Fuse from "fuse.js";
import { HeaderToolbar } from "../../../components/Tables/HeaderToolbar";
import { FooterToolbar } from "../../../components/Tables/FooterToolbar";

import CreateUpdateModal from "./CreateUpdateModal";
import DeleteModal from "./DeleteModal";

import { gqlHoC } from "../../../utils/General/GqlHoC";
import _ from "lodash";
import {
  createQueryToGetItems,
  createMutationToCreateItem,
  createMutationToUpdateItem,
  createMutationToDeleteItem,
  EntityProp,
} from "../../../utils/General/GqlHelpers";

const POSIBLE_LIMITS_PER_PAGE = [10, 25, 50, 100];
const FUSE_OPTIONS = {
  keys: ["name", "age", "country"],
};

//=============================================================================
//#region Entity definition

const ENTITY_NAME = "Author"
export type Author = {
  id: number;
  name: string;
  age: number;
  country?: string;
};

const ENTITY_PROPS: EntityProp[] = [
  { name: "name", type: "String", required: true },
  { name: "age", type: "Int", required: true },
  { name: "country", type: "String", required: false },
]

//#endregion
//=============================================================================

interface AuthorsPageProps {
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
  items: Author[];
  count: number;
}

interface AuthorPageState {
  currentPage: number;
  pageLimit: number;
  searchText: string;
  isCreateUpdateModalOpen: boolean;
  isDeleteModalOpen: boolean;
  author?: Author;
}

const AuthorsPage: React.FC<AuthorsPageProps> = ({
  get,
  create,
  update,
  remove,
  loading,
  items,
  count,
}) => {
  const [state, setState] = React.useState<AuthorPageState>({
    currentPage: 1,
    pageLimit: POSIBLE_LIMITS_PER_PAGE[POSIBLE_LIMITS_PER_PAGE.length - 1],
    searchText: "",
    isCreateUpdateModalOpen: false,
    isDeleteModalOpen: false,
    author: undefined,
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
    setState({ ...state, author: undefined, isCreateUpdateModalOpen: true });
  };
  const onEdit = (id: number) => {
    const author = _.find(items, (i) => i.id === id);
    setState({ ...state, author, isCreateUpdateModalOpen: true });
  };

  const onDelete = (id: number) => {
    const author = _.find(items, (i) => i.id === id);
    setState({ ...state, author, isDeleteModalOpen: true });
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
                Create Author
              </IconButton>
            }
          />
          {state.isCreateUpdateModalOpen && (
            <CreateUpdateModal
              onClose={onCloseAnyModal}
              author={state.author}
              create={create}
              update={update}
            />
          )}
          {state.isDeleteModalOpen && (
            <DeleteModal
              onClose={onCloseAnyModal}
              author={state.author}
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

export default gqlHoC<Author>({
  entityName: ENTITY_NAME,
  readGql: createQueryToGetItems(ENTITY_NAME, ENTITY_PROPS.map(p => p.name)),
  createGql: createMutationToCreateItem(ENTITY_NAME, ENTITY_PROPS),
  updateGql: createMutationToUpdateItem(ENTITY_NAME, ENTITY_PROPS),
  removeGql: createMutationToDeleteItem(ENTITY_NAME),
})(AuthorsPage);
