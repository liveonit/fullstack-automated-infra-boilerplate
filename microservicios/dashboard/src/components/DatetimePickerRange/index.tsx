import "./style.css";

import React from "react";
import DatePicker from "react-datepicker";
import { ToolbarItem, Button, ButtonVariant } from "@patternfly/react-core";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarCheckIcon } from "@patternfly/react-icons";
import "@patternfly/react-icons";

interface DateTimeFilterProps {
  className?: string,
  style?: React.CSSProperties,
  startDate: number;
  endDate: number;
  handleChangeDateFilter: ({
    startDate,
    endDate,
  }: {
    startDate?: number;
    endDate?: number;
  }) => void;
  handleApplyDateFilter: () => void;
}

export const DateTimeFilter: React.FC<DateTimeFilterProps> = ({
  handleChangeDateFilter,
  handleApplyDateFilter,
  startDate,
  endDate,
  style,
  className
}) => {
  return (
    <ToolbarItem style={{...style, maxWidth: "13.25rem"}} className={className}>
        <DatePicker
          className="pf-c-form-control datepicker-one"
          selected={new Date(startDate)}
          onChange={(startDate) =>
            handleChangeDateFilter({ startDate: startDate?.getTime() })
          }
          selectsStart
          startDate={new Date(startDate)}
          endDate={new Date(endDate)}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={5}
          timeCaption="time"
          dateFormat="MMMM d, yyyy h:mm aa"
        />
        <div className="--date-and-button">
          <div className="datepicker-two">
            <DatePicker
              className="pf-c-form-control"
              selected={new Date(endDate)}
              onChange={(endDate) =>
                handleChangeDateFilter({ endDate: endDate?.getTime() })
              }
              selectsStart
              startDate={new Date(startDate)}
              endDate={new Date(endDate)}
              minDate={new Date(startDate)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={5}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
            />
          </div>
          <Button
            style={{ display: "inline-block"}}
            variant={ButtonVariant.primary}
            aria-label="search button for filter input"
            onClick={() => handleApplyDateFilter()}
            title="Aplicar filtro de tiempo"
          >
            <CalendarCheckIcon />
          </Button>
        </div>
      </ToolbarItem>
  );
};
