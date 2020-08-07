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
} from "@patternfly/react-core";

import { FilterIcon } from "@patternfly/react-icons";

import { DateTimeFilter } from '../../components/DatetimePickerRange'
import PaginationNav from "../../components/PaginationNav";

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
  handleUpdateFilterInput: (searchText?: string) => void;
  handleChangeDateFilter: ({
    startDate,
    endDate,
  }: {
    startDate?: number;
    endDate?: number;
  }) => void;
}

export const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { handleUpdateFilterInput } = props;
  return (
    <PatternflyToolbar>
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
        <ToolbarItem className="--toolbar-date-filter">
          <DateTimeFilter {...props} />
        </ToolbarItem>
        <ToolbarItem className="--toolbar-pagination">
          <PaginationNav {...props} />
        </ToolbarItem>
      </ToolbarGroup>
    </PatternflyToolbar>
  );
};
