import "./style.css";

import React from "react";
import "@patternfly/react-styles";

import {
  Button,
  ButtonVariant,
  Toolbar as PatternflyToolbar,
  TextInput,
  ToolbarGroup,
  ToolbarItem,
  Text
} from "@patternfly/react-core";

import { FilterIcon } from "@patternfly/react-icons";

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
        <ToolbarItem style={{ maxWidth: "13.25rem" }}>
          <TextInput
              onChange={(e) => handleUpdateFilterInput(e)}
              name="filterInput"
              type="search"
              aria-label="filter input"
            />
        </ToolbarItem>
        <ToolbarItem className="--toolbar-header-date-filter">
          <DateTimeFilter {...props} />
        </ToolbarItem>
      </ToolbarGroup>
    </PatternflyToolbar>
  );
};
