/* eslint-disable jsx-a11y/anchor-is-valid */
import "bootstrap/dist/css/bootstrap.min.css";
import './style.css'

import React from "react";
import _ from "lodash";
import { ToolbarItem } from "@patternfly/react-core";

const LEFT_PAGE = "LEFT";
const RIGHT_PAGE = "RIGHT";

interface PaginationNavProps {
  totalRecords: number;
  pageNeighbours: number;
  pageLimit: number;
  posibleLimitsPerPage: number[];
  currentPage: number;
  style?: React.CSSProperties;
  className?: string;
  onPageChanged: (newPage: number) => void;
  onPageLimitChanged: (newLimit: number) => void;
}

const PaginationNav: React.FC<PaginationNavProps> = (props) => {
  let {
    totalRecords,
    pageNeighbours,
    pageLimit,
    posibleLimitsPerPage,
    style,
    className,
    currentPage,
    onPageChanged,
    onPageLimitChanged,
  } = props;

  pageNeighbours =
    typeof pageNeighbours === "number"
      ? Math.max(0, Math.min(pageNeighbours, 2))
      : 0;

  const totalPages = Math.ceil(totalRecords / pageLimit);

  const handleClick = (page: number) => (evt: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    evt.preventDefault();
    onPageChanged(page);
  };

  const handleMoveLeft = (evt: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    evt.preventDefault();
    onPageChanged(currentPage - pageNeighbours * 2 - 1);
  };

  const handleMoveRight = (evt: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    evt.preventDefault();
    console.log("current-page", currentPage, "page-neighbours", pageNeighbours);
    onPageChanged(currentPage + pageNeighbours * 2 + 1);
  };

  const fetchPageNumbers = () => {
    const totalNumbers = pageNeighbours * 2 + 3;
    const totalBlocks = totalNumbers + 2;

    if (totalPages > totalBlocks) {
      const startPage = Math.max(2, currentPage - pageNeighbours);
      const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours);

      let pagesRange = _.range(startPage, endPage + 1);
      let pages: any[] = [];
      const hasLeftSpill = startPage > 2;
      const hasRightSpill = totalPages - endPage > 1;
      const spillOffset = totalNumbers - (pagesRange.length + 1);

      switch (true) {
        case hasLeftSpill && !hasRightSpill: {
          const extraPages = _.range(startPage - spillOffset, startPage);
          pages = [LEFT_PAGE, ...extraPages, ...pagesRange];
          break;
        }

        case !hasLeftSpill && hasRightSpill: {
          const extraPages = _.range(endPage + 1, endPage + spillOffset + 1);
          pages = [...pagesRange, ...extraPages, RIGHT_PAGE];
          break;
        }

        case hasLeftSpill && hasRightSpill:
        default: {
          pages = [LEFT_PAGE, ...pagesRange, RIGHT_PAGE];
          break;
        }
      }

      return [1, ...pages, totalPages];
    }

    return _.range(1, totalPages + 1);
  };

  const pages = fetchPageNumbers();
  return (
    <ToolbarItem style={style} className={className}>
      <div className="pf-c-input-group" style={{ display: "inline-block", width: "4.5rem" }}>
        <select
          title="Cantidad por pagina"
          className="pf-c-form-control"
          style={{ width: "4.5rem" }}
          onChange={(e) => onPageLimitChanged(parseInt(e.target.value))}
          value={pageLimit}
        >
          {posibleLimitsPerPage.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>
      <nav aria-label="Pagination" style={{ display: "inline-block" }}>
        <ul className="pagination" style={{ marginBottom: "0px" }}>
          {pages.map((page, index) => {
            if (page === LEFT_PAGE)
              return (
                <li key={index} className="page-item">
                  <a
                    className="page-link"
                    href="#"
                    aria-label="Previous"
                    onClick={handleMoveLeft}
                  >
                    <span aria-hidden="true">&laquo;</span>
                    <span className="sr-only">Previous</span>
                  </a>
                </li>
              );

            if (page === RIGHT_PAGE)
              return (
                <li key={index} className="page-item">
                  <a
                    className="page-link"
                    href="#"
                    aria-label="Next"
                    onClick={handleMoveRight}
                  >
                    <span aria-hidden="true">&raquo;</span>
                    <span className="sr-only">Next</span>
                  </a>
                </li>
              );

            return (
              <li
                key={index}
                className={`page-item${currentPage === page ? " active" : ""}`}
              >
                <a className="page-link" href="#" onClick={handleClick(page)}>
                  {page}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </ToolbarItem>
  );
};

export default PaginationNav;
