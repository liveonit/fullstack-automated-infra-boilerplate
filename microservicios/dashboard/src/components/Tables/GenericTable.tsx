import React from "react";

import get from "lodash/get";
import {
  Table as PatternflyTable,
  TableVariant,
  TableHeader,
  TableBody, ICell
} from "@patternfly/react-table";

import { onSort } from "./onSort";

import _ from "lodash";

interface TableProps {
  columns: (string | ICell)[];
  items: any[];
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  transformRows: (items: any[]) => { cells: any }[];
}

const Table: React.FC<TableProps> = ({ columns, items, onEdit, onDelete, transformRows }) => {
  let [state, setState] = React.useState<{ rows: any[]; sortBy: any }>({
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
      actions={[
        {
          title: "Edit",
          onClick: (a, b, rowData) => onEdit && onEdit(parseInt(_.get(rowData, "cells.0"))),
        },
        {
          title: "Delete",
          onClick: (a, b, rowData) => onDelete && onDelete(parseInt(_.get(rowData, "cells.0"))),
        },
      ]}
      onSort={(_, index, direction) =>
        setState(
          onSort({
            index,
            direction,
            key: get(columns, `${index}.key`),
            rows: state.rows,
          })
        )
      }
      cells={columns}
      rows={transformRows(state.rows)}
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
};

export default Table;
