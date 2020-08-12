import "./style.css";

import React from "react";
import "@patternfly/react-styles";

import {
  Toolbar as PatternflyToolbar,
  ToolbarItem,
  ToolbarContent,
} from "@patternfly/react-core";

import { Input } from "rsuite";

import { DateTimeFilter } from "../DatetimePickerRange";

interface ToolbarProps {
  hasFilter?: Boolean;
  hasDateTimeFilter?: Boolean;
  startDate?: number;
  endDate?: number;
  handleUpdateFilterInput?: (searchText?: string) => void;
  handleChangeDateFilter?: ({
    startDate,
    endDate,
  }: {
    startDate?: number;
    endDate?: number;
  }) => void;
  hasCreateEntity?: Boolean;
  CreateEntityChild?: React.ReactChild
}

export const HeaderToolbar: React.FC<ToolbarProps> = (props) => {
  const { handleUpdateFilterInput, hasFilter, hasDateTimeFilter, hasCreateEntity, CreateEntityChild } = props;
  return (
    <PatternflyToolbar>
      <ToolbarContent style={{ paddingRight: 0 }}>
        {
        hasFilter &&
        <ToolbarItem  className="--toolbar-header-filter">
          <Input
            onChange={(e) => handleUpdateFilterInput && handleUpdateFilterInput(e)}
            style={{ width: 200 }}
            placeholder="Search in Table"
          />
        </ToolbarItem>
        }
        {
        hasDateTimeFilter &&
        <ToolbarItem className="--toolbar-header-date-filter">
          <DateTimeFilter {...props} />
        </ToolbarItem>
        }
        {
        hasCreateEntity &&
        <ToolbarItem className="--toolbar-create-entity" alignment={{ default: 'alignRight' }}>
          {CreateEntityChild}
        </ToolbarItem>
        }
      </ToolbarContent>
    </PatternflyToolbar>
  );
};
