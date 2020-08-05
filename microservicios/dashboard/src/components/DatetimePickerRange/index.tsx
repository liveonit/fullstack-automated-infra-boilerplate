import "./style.css";

import React from "react";

import { DateRangePicker } from "rsuite";

import { Button, ButtonVariant } from "@patternfly/react-core";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarCheckIcon,  CalendarTimesIcon } from "@patternfly/react-icons";
import "@patternfly/react-icons";

interface DateTimeFilterProps {
  className?: string;
  style?: React.CSSProperties;
  startDate: number;
  endDate: number;
  handleChangeDateFilter: ({
    startDate,
    endDate,
  }: {
    startDate?: number;
    endDate?: number;
  }) => void;
  handleApplyDateFilter: (isApply: boolean) => void;
}

export const DateTimeFilter: React.FC<DateTimeFilterProps> = ({
  handleChangeDateFilter,
  handleApplyDateFilter,
  startDate,
  endDate,
}) => {
  const [isApply, setIsApply] = React.useState(false);

  React.useEffect(() => {
    handleApplyDateFilter(isApply);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApply])
  return (
    <div>
      <DateRangePicker
        className="pf-c-form-control datepicker-one"
        value={[new Date(startDate), new Date(endDate)]}
        onChange={(value) =>
          handleChangeDateFilter({
            startDate: value[0]?.getMilliseconds(),
            endDate: value[1]?.getMilliseconds(),
          })
        }
      />

      <Button
        style={{ display: "inline-block" }}
        variant={ButtonVariant.primary}
        aria-label="search button for filter input"
        onClick={() => setIsApply(!isApply)}
        title= {(isApply ? "Aplicar" : "Quitar") + "filtro de tiempo"}
      >
        {
          isApply 
            ? <CalendarTimesIcon />
            : <CalendarCheckIcon />
        }
      </Button>
    </div>
  );
};
