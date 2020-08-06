import "./style.css";

import React from "react";

import { DateRangePicker } from "rsuite";
import 'rsuite/dist/styles/rsuite-default.min.css';
import "@patternfly/react-icons";

interface DateTimeFilterProps {
  startDate: number;
  endDate: number;
  handleChangeDateFilter: ({
    startDate,
    endDate,
  }: {
    startDate?: number;
    endDate?: number;
  }) => void;
}

export const DateTimeFilter: React.FC<DateTimeFilterProps> = ({
  handleChangeDateFilter,
  startDate,
  endDate,
}) => {

  return (
      <DateRangePicker
        value={[new Date(startDate), new Date(endDate)]}
        onChange={(value) =>
          handleChangeDateFilter({
            startDate: value[0]?.getMilliseconds(),
            endDate: value[1]?.getMilliseconds(),
          })
        }
      />
  );
};
