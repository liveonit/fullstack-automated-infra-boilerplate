import "./style.css";

import React from "react";
import "@patternfly/react-styles";

import {
  Toolbar as PatternflyToolbar,
  TextInput,
  ToolbarGroup,
  ToolbarItem,
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
      <ToolbarGroup className="--toolbar-header-filter">
        <ToolbarItem >
          <Input
            onChange={(e) => handleUpdateFilterInput(e)}
            style={{ width: 200 }}
            placeholder="Search in Table"
          />
        </ToolbarItem>
        <ToolbarItem className="--toolbar-header-date-filter">
          <DateTimeFilter {...props} />
        </ToolbarItem>
      </ToolbarGroup>
    </PatternflyToolbar>
  );
};
