import React from "react";

import get from "lodash/get";
import {
  Table as PatternflyTable,
  TableVariant,
  TableHeader,
  TableBody,
  sortable,
} from "@patternfly/react-table";
import { onSort } from "../../../utils/Tables";

const COLUMNS = [
  { key: "id", title: "Id", transforms: [sortable] },
  { key: "name", title: "Name", transforms: [sortable] },
  { key: "country", title: "Country", transforms: [sortable] },
  { key: "age", title: "Age", transforms: [sortable] }
];

function Table({ items }: { items: any[] }) {
  let [state, setState] = React.useState<{ rows: any[], sortBy: any}>({
    rows: [],
    sortBy: {},
  });

  React.useEffect(() => {
    setState({ rows: items, sortBy: {} });
  }, [items]);

  return (
    <PatternflyTable
      aria-label="Logs Table"
      sortBy={state.sortBy}
      onSort={(_, index, direction) =>
        setState(
          onSort({
            index,
            direction,
            key: get(COLUMNS, `${index}.key`),
            rows: state.rows,
          })
        )
      }
      cells={COLUMNS}
      rows={calculateRows(state.rows)}
      variant={TableVariant.compact}
    >
      <TableHeader />

      <TableBody
        rowKey={({ rowData }: { rowData: any }) => {
          return rowData.cells[0];
        }}
      />
    </PatternflyTable>
  );
}

function calculateRows(items: any[]) {
  if (items === undefined) return [];
  return items.map((item) => ({
    cells: COLUMNS.map((column) => {
      if (column.key === "xxx") {
        return {
          title: "modify value of column",
        };
      } else return get(item, column.key);
    }),
  }));
}

export default Table;
