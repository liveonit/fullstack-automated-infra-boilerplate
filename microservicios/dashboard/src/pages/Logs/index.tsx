import React from "react";

import Table from "./Table";
import { HeaderToolbar } from "../../components/Tables/HeaderToolbar";
import { FooterToolbar } from "../../components/Tables/FooterToolbar";
import { withLogs } from "./withLogs";

import Fuse from "fuse.js";
import { Spinner } from "@patternfly/react-core";

const FUSE_OPTIONS = {
  keys: ["operation", "operationType", "payload", "resultPayload"],
};

const POSIBLE_LIMITS_PER_PAGE = [10, 25, 50, 100, 250, 500, 1000];

interface LogsPageProps {
  getLogs: ({
    variables: { timeStart, timeEnd },
  }: {
    variables: { timeStart: number; timeEnd: number };
  }) => void;
  loading: boolean;
  items: any[];
  count: number;
  subscribe: () => void;
  unsubscribe: () => void;
}

const LogsPage: React.FC<LogsPageProps> = ({
  getLogs,
  loading,
  items,
  count,
  subscribe,
  unsubscribe,
}) => {
  const [state, setState] = React.useState({
    currentPage: 1,
    pageLimit: POSIBLE_LIMITS_PER_PAGE[POSIBLE_LIMITS_PER_PAGE.length - 1],
    startDate: Date.now() - 604800000,
    endDate: Date.now(),
    searchText: "",
  });
  const { currentPage, pageLimit, startDate, endDate } = state;
  

  React.useEffect(() => {
    getLogs({ variables: { timeStart: startDate, timeEnd: endDate } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

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

  const handleChangeDateFilter = ({
    startDate,
    endDate,
  }: {
    startDate?: number;
    endDate?: number;
  }) => {
    if (startDate && endDate) {
      console.log("startDate", startDate + "--- ", new Date(startDate || 0));
      console.log("endDate", endDate + "---- ", new Date(endDate || 0));
      setState({
        ...state,
        startDate: startDate || state.startDate,
        endDate: endDate || state.endDate,
      });
      unsubscribe();
    } else {
      setState({
        ...state,
        startDate: Date.now() - 604800000,
        endDate: Date.now(),
      });
      subscribe();
    }
  };

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
        hasDateTimeFilter={true}
        startDate={startDate}
        endDate={endDate}
        handleUpdateFilterInput={handleUpdateFilterInput}
        handleChangeDateFilter={handleChangeDateFilter}
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

export default withLogs(LogsPage);
