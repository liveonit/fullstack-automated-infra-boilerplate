import "./style.css";

import React from "react";

import "rsuite/dist/styles/rsuite-default.min.css";
import "@patternfly/react-icons";

import { DateRangePicker } from "rsuite";
const { afterToday } = DateRangePicker;
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
      disabledDate={afterToday()}
      value={[new Date(startDate), new Date(endDate)]}
      ranges={[
        {
          label: "Today",
          closeOverlay: true,
          value: v => {
            const ms = new Date().getTime();
            return [new Date(ms - (ms % 86400000) + (new Date().getTimezoneOffset() * 60 * 1000)), new Date(ms - 86400000)];
          },
        },
        {
          label: "Last Day",
          closeOverlay: true,
          value: v => {
            const ms = new Date().getTime() - 86400000;
            return [new Date(ms), new Date(ms)];
          },
        },
        {
          label: "Last Week",
          closeOverlay: true,
          value: v => {
            const ms = new Date().getTime() - 86400000;
            return [new Date(ms - 86400000 * 6), new Date(ms)];
          },
        },
      ]}
      onChange={(value) => {
        const [startDate, endDate] = value;
        handleChangeDateFilter({
          startDate: startDate?.getTime(),
          endDate: endDate ? endDate.getTime() + 86399999 : undefined,
        });
      }}
    />
  );
};
