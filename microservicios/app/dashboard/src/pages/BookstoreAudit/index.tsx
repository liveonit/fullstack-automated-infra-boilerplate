import React from "react";

import Table from "../../components/Tables/GenericTable";
import { HeaderToolbar } from "../../components/Tables/HeaderToolbar";
import { FooterToolbar } from "../../components/Tables/FooterToolbar";

import Fuse from "fuse.js";
import { Spinner } from "@patternfly/react-core";

import { sortable } from "@patternfly/react-table";
import _ from "lodash";
import {
  useGetLogsLazyQuery,
  useSubLogsSubscription,
} from "../../graphql/queries/autogenerate/hooks";
import { Log } from "../../graphql/queries/autogenerate/schemas";

//=============================================================================
//#region Table configuration

const COLUMNS = [
  { key: "id", title: "Id", transforms: [sortable] },
  { key: "unixStartTime", title: "Timestamp", transforms: [sortable] },
  { key: "operation", title: "Operation", transforms: [sortable] },
  { key: "operationType", title: "Operation Type", transforms: [sortable] },
  { key: "payload", title: "Payload", transforms: [sortable] },
  { key: "executionTime", title: "Execution Time", transforms: [sortable] },
  { key: "resultPayload", title: "Payload Result", transforms: [sortable] },
];

const FUSE_OPTIONS = {
  keys: ["operation", "operationType", "payload", "resultPayload"],
};

function transformRows(items: any[]) {
  if (items === undefined) return [];
  return items.map((item) => ({
    cells: COLUMNS.map((column) => {
      if (column.key === "unixStartTime") {
        return {
          title: new Date(item.unixStartTime).toLocaleString(),
        };
      } else return _.get(item, column.key);
    }),
  }));
}

const POSIBLE_LIMITS_PER_PAGE = [10, 25, 50, 100, 250, 500, 1000];

//#endregion
//=============================================================================

interface State {
  currentPage: number;
  pageLimit: number;
  startDate: number;
  endDate: number;
  searchText: string;
  items: Log[];
  isSubscribe: boolean;
}

const BookstoreAuditory: React.FC = () => {
  const [state, setState] = React.useState<State>({
    currentPage: 1,
    pageLimit: POSIBLE_LIMITS_PER_PAGE[POSIBLE_LIMITS_PER_PAGE.length - 1],
    startDate: Date.now() - 604800000,
    endDate: Date.now(),
    searchText: "",
    items: [],
    isSubscribe: true,
  });
  const { currentPage, pageLimit, startDate, endDate } = state;

  const [getLogs, { data, loading }] = useGetLogsLazyQuery({
    onCompleted: () => {
      if (data && data.logs) {
        setState({ ...state, items: data.logs });
      }
    },
  });

  useSubLogsSubscription({
    skip: !state.isSubscribe,
    onSubscriptionData: ({ subscriptionData }) => {
      if (subscriptionData?.data?.logsSubscription) {
        setState({ ...state, items: [ ...state.items, subscriptionData.data.logsSubscription] });
      }
    },
  });

  React.useEffect(() => {
    getLogs();
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

  const handleChangeDateFilter = ({
    startDate,
    endDate,
  }: {
    startDate?: number;
    endDate?: number;
  }) => {
    if (startDate !== state.startDate || endDate !== state.endDate) {
      getLogs({
        variables: {
          timeStart: startDate || Date.now() - 604800000,
          timeEnd: endDate || Date.now(),
        },
      });
      if (startDate && endDate) {
        setState({
          ...state,
          startDate: startDate,
          endDate: endDate,
          isSubscribe: false,
        });
      } else {
        setState({
          ...state,
          startDate: Date.now() - 604800000,
          endDate: Date.now(),
          isSubscribe: true,
        });
      }
    }
  };

  const offset = (currentPage - 1) * pageLimit;

  const fuse = new Fuse(state.items, FUSE_OPTIONS);
  const tableItems = state.searchText
    ? fuse
        .search(state.searchText)
        .map((m) => m.item)
        .slice(offset, offset + pageLimit)
    : state.items.slice(offset, offset + pageLimit);

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
          <Table
            columns={COLUMNS}
            items={tableItems}
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

export default BookstoreAuditory;
