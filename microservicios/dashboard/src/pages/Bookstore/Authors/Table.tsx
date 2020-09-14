import React from "react";

import get from "lodash/get";
import {
  Table as PatternflyTable,
  TableVariant,
  TableHeader,
  TableBody
} from "@patternfly/react-table";

import { onSort } from "../../../utils/Tables";
import { EntityType, COLUMNS } from ".";
import _ from "lodash";

interface TableProps {
  items: EntityType[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const Table: React.FC<TableProps> = ({ items, onEdit, onDelete }) => {
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
          onClick: (a, b, rowData) => onEdit(parseInt(_.get(rowData, "cells.0"))),
        },
        {
          title: "Delete",
          onClick: (a, b, rowData) => onDelete(parseInt(_.get(rowData, "cells.0"))),
        },
      ]}
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
};

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
