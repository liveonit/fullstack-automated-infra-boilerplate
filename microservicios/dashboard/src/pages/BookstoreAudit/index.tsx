import React from "react";

import Table from "../../components/Tables/GenericTable";
import { HeaderToolbar } from "../../components/Tables/HeaderToolbar";
import { FooterToolbar } from "../../components/Tables/FooterToolbar";

import Fuse from "fuse.js";
import { Spinner } from "@patternfly/react-core";
import gqlHoC from "../../utils/General/gqlHoC";
import {
  createQueryToGetItems,
  createQueryToSubscribe,
  EntityProp,
} from "../../utils/General/GqlHelpers";
import { sortable } from "@patternfly/react-table";
import _ from "lodash";

const ENTITY_NAME = "Log";

export type Log = {
  id: number;
  operation: string;
  operationType: string;
  payload: string;
  unixStartTime: number;
  executionTime: number;
  resultPayload: string;
};

const ENTITY_PROPS: EntityProp[] = [
  { name: "operation", type: "String", required: true },
  { name: "operationType", type: "String", required: true },
  { name: "payload", type: "String", required: true },
  { name: "unixStartTime", type: "Int", required: true },
  { name: "executionTime", type: "Int", required: true },
  { name: "resultPayload", type: "String", required: false },
];

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

interface BookstoreAuditoryProps {
  get: ({
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

const BookstoreAuditory: React.FC<BookstoreAuditoryProps> = (props) => {
  const {
    get,
    loading,
    items,
    count,
    subscribe,
    unsubscribe,
  }= props;
  
  const [state, setState] = React.useState({
    currentPage: 1,
    pageLimit: POSIBLE_LIMITS_PER_PAGE[POSIBLE_LIMITS_PER_PAGE.length - 1],
    startDate: Date.now() - 604800000,
    endDate: Date.now(),
    searchText: "",
  });
  const { currentPage, pageLimit, startDate, endDate } = state;

  React.useEffect(() => {
    subscribe();
    return () => unsubscribe();
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
      get({
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
          <Table
            columns={COLUMNS}
            items={tableItems}
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

export default gqlHoC({
  entityName: ENTITY_NAME,
  readGql: createQueryToGetItems(ENTITY_NAME, ENTITY_PROPS),
  subscriptionGql: createQueryToSubscribe(
    ENTITY_NAME,
    ENTITY_PROPS.map((e) => e.name)
  ),
})(BookstoreAuditory);
