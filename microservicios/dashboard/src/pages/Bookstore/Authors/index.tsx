import React from "react";
import {
  Spinner,
} from "@patternfly/react-core";
import { withAuthors } from "./withAuthors";

import Table from "./Table";
import Fuse from "fuse.js";
import { HeaderToolbar } from "../../../components/Tables/HeaderToolbar";
import { FooterToolbar } from "../../../components/Tables/FooterToolbar";

const POSIBLE_LIMITS_PER_PAGE = [10, 25, 50, 100];
const FUSE_OPTIONS = {
  keys: ["name", "age", "country"],
};
interface AuthorsPageProps {
  getAuthors: () => void;
  createAuthor: ({
    variables: { name, age, country },
  }: {
    variables: { name: String; age?: number; country?: String };
  }) => void;
  loading: boolean;
  items: any[];
  count: number;
}

const AuthorsPage: React.FC<AuthorsPageProps> = ({
  getAuthors,
  createAuthor,
  loading,
  items,
  count,
}) => {
  const [state, setState] = React.useState({
    currentPage: 1,
    pageLimit: POSIBLE_LIMITS_PER_PAGE[POSIBLE_LIMITS_PER_PAGE.length - 1],
    searchText: "",
  });
  const { currentPage, pageLimit } = state;

  React.useEffect(() => {
    getAuthors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const offset = (currentPage - 1) * pageLimit;

  const fuse = new Fuse(items, FUSE_OPTIONS);
  const tableItems = state.searchText
    ? fuse
        .search(state.searchText)
        .map((m) => m.item)
        .slice(offset, offset + pageLimit)
    : items.slice(offset, offset + pageLimit);

  return (
    <>
      <HeaderToolbar
        hasFilter={true}
        hasDateTimeFilter={false}
        handleUpdateFilterInput={handleUpdateFilterInput}
      />
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Table items={tableItems} />
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

export default withAuthors(AuthorsPage);
