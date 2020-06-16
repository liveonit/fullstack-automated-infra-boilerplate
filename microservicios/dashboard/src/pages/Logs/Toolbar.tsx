import "./style.css";

import React from "react";
import "@patternfly/react-styles";

import {
  Button,
  ButtonVariant,
  Toolbar as PatternflyToolbar,
  ToolbarItem,
  TextInput,
  ToolbarGroup,
} from "@patternfly/react-core";
import { FilterIcon } from "@patternfly/react-icons";

import PaginationNav from "../../components/PaginationNav";
import { DateTimeFilter } from "../../components/DatetimePickerRange";

interface ToolbarProps {
  pageNeighbours: number;
  startDate: number;
  endDate: number;
  totalRecords: number;
  pageLimit: number;
  currentPage: number;
  posibleLimitsPerPage: number[];
  onPageLimitChanged: (newLimit: number) => void;
  onPageChanged: (newPage: number) => void;
  handleUpdateFilterInput: (filterText?: string) => void;
  handleChangeDateFilter: ({
    startDate,
    endDate,
  }: {
    startDate?: number;
    endDate?: number;
  }) => void;
  handleApplyDateFilter: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { handleUpdateFilterInput } = props;
  return (
    <PatternflyToolbar >
      <ToolbarGroup className="--toolbar-filter">
        <ToolbarItem style={{ maxWidth: "13.25rem" }}>
          <div className="--filter-with-button">
              <TextInput
                onChange={(e) => handleUpdateFilterInput(e)}
                name="filterInput"
                type="search"
                aria-label="filter input"
              />
          </div>
            <Button
              style={{ display: "inline-block" }}
              variant={ButtonVariant.primary}
              aria-label="search button for filter input"
            >
              <FilterIcon />
            </Button>
        </ToolbarItem>
      </ToolbarGroup>
      <ToolbarGroup className="--toolbar-date-filter">
        <DateTimeFilter {...props}/>
      </ToolbarGroup>
      <ToolbarGroup className="--toolbar-pagination" >
        <PaginationNav {...props} />
      </ToolbarGroup>
    </PatternflyToolbar>
  );
};
