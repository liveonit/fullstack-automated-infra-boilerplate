import React from "react";

// import { Spinner } from "@patternfly/react-core/dist/esm/experimental";
import Table from "./Table";
import { Toolbar } from "./Toolbar";
import { withLogs } from "./withLogs";

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
    isApplyDateTimeFilter: false,
  });

  const { currentPage, pageLimit, startDate, endDate } = state;

  const offset = (currentPage - 1) * pageLimit;
  const tableItems = items.slice(offset, offset + pageLimit);

  React.useEffect(() => {
    getLogs({ variables: { timeStart: startDate, timeEnd: endDate } });
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

  const handleUpdateFilterInput = () => undefined; //TODO: colocar fuse y agregar filter input

  const handleChangeDateFilter = ({
    startDate,
    endDate,
  }: {
    startDate?: number;
    endDate?: number;
  }) => {
    setState({
      ...state,
      startDate: startDate || state.startDate,
      endDate: endDate || state.endDate,
    });
  };

  const handleApplyDateFilter = (isApply: boolean) => {
    if (isApply) {
      getLogs({ variables: { timeStart: startDate, timeEnd: endDate } });
    } else {
      getLogs({
        variables: {
          timeStart: Date.now() - 604800000,
          timeEnd: Date.now(),
        },
      });
      subscribe();
    }
  };

  return (
    <>
      <Toolbar
        pageNeighbours={0}
        startDate={startDate}
        endDate={endDate}
        totalRecords={count}
        pageLimit={pageLimit}
        currentPage={currentPage}
        posibleLimitsPerPage={POSIBLE_LIMITS_PER_PAGE}
        onPageLimitChanged={onPageLimitChanged}
        onPageChanged={onPageChanged}
        handleUpdateFilterInput={handleUpdateFilterInput}
        handleChangeDateFilter={handleChangeDateFilter}
        handleApplyDateFilter={handleApplyDateFilter}
      />
      {loading ? (
        <span
          className="pf-c-spinner"
          role="progressbar"
          aria-valuetext="Loading..."
        >
          <span className="pf-c-spinner__clipper"></span>
          <span className="pf-c-spinner__lead-ball"></span>
          <span className="pf-c-spinner__tail-ball"></span>
        </span>
      ) : (
        <Table items={tableItems} />
      )}
    </>
  );
};

export default withLogs(LogsPage);
