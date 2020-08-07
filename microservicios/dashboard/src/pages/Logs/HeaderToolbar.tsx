import "./style.css";

import React from "react";
import "@patternfly/react-styles";

import {
  Toolbar as PatternflyToolbar,
  TextInput,
  ToolbarGroup,
  ToolbarItem,
  ToolbarContent,
} from "@patternfly/react-core";

import { Input } from "rsuite";

import { DateTimeFilter } from "../../components/DatetimePickerRange";

interface ToolbarProps {
  startDate: number;
  endDate: number;
  handleUpdateFilterInput: (searchText?: string) => void;
  handleChangeDateFilter: ({
    startDate,
    endDate,
  }: {
    startDate?: number;
    endDate?: number;
  }) => void;
}

export const HeaderToolbar: React.FC<ToolbarProps> = (props) => {
  const { handleUpdateFilterInput } = props;
  return (
    <PatternflyToolbar>
      <ToolbarContent style={{ paddingRight: 0 }}>
        <ToolbarItem  className="--toolbar-header-filter">
          <Input
            onChange={(e) => handleUpdateFilterInput(e)}
            style={{ width: 200 }}
            placeholder="Search in Table"
          />
        </ToolbarItem>
        <ToolbarItem className="--toolbar-header-date-filter">
          <DateTimeFilter {...props} />
        </ToolbarItem>
      </ToolbarContent>
    </PatternflyToolbar>
  );
};
