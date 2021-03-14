import { SortByDirection } from "@patternfly/react-table";

/**
 * 
 * @param {*} _event Evento de tipo onSort de una tabla de Patternfly 
 * @param {*} index Index otorgado por el evento onSort de una tabla Patternfly
 * @param {*} direction Direccion otorgada por el evento onSort de una tabla Patternfly
 * @param {*} rows Las filas de la tabla
 */
export const onSort = ({index, key, direction, rows}: {index: number, key: string, direction: SortByDirection, rows: any[]} ) => {
  const sortedRows = rows.sort((a, b) =>
    a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0
  );
  return {
    sortBy: {
      index,
      direction,
    },
    rows: direction === SortByDirection.asc ? sortedRows : sortedRows.reverse(),
  };
};
