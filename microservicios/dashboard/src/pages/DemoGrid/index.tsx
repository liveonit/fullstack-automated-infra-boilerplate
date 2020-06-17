import React from "react";
import { PageSection, PageSectionVariants } from "@patternfly/react-core";

import _ from 'lodash'

import Toolbar from "./Toolbar";
import { Layout } from "react-grid-layout";

import ResponsiveGridLayout from '../../components/ReactResponsiveGridLayout'
interface State {
  cols: any;
  layouts: Layout[];
  compactType?: "vertical" | "horizontal" | null | undefined;
  currentBreakpoint: string;
  rowsHeight: number;
}

const DemoGrid = () => {
  const [ state, setState ] = React.useState<State>({
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    layouts: generateLayout(),
    compactType: "vertical",
    currentBreakpoint: "",
    rowsHeight: 30,
  })

  const onCompactTypeChange = () => {
    const compactType =
      state.compactType === "horizontal"
        ? "vertical"
        : state.compactType === "vertical"
        ? null
        : "horizontal";
    setState({ ...state, compactType });
  };
  
  const onLayoutChange = (layouts: Layout[]) => {
    setState({ ...state, layouts });
  }
  
  const onNewLayout = () => {
    setState({
      ...state,
      layouts: generateLayout(),
    });
  };
  
  const onBreakpointChange = (newBreakpoint: string, newCols: number) => {
    setState({
      ...state,
      currentBreakpoint: newBreakpoint,
    });
  };

  return (
    <>
      <PageSection>
        <Toolbar
          onNewLayout={onNewLayout}
          onCompactTypeChange={onCompactTypeChange}
        />
      </PageSection>
      <PageSection variant={PageSectionVariants.light}>
        <ResponsiveGridLayout
          layouts={state.layouts}
          rowHeight={state.rowsHeight}
          cols={state.cols}
          onLayoutChange={onLayoutChange}
          onBreakpointChange={onBreakpointChange}
          compactType={state.compactType}
        />
      </PageSection>
    </>
  );
};

const generateLayout: () => Layout[] = () => {
  return _.map(_.range(0, 25), function (item, i) {
    var y = Math.ceil(Math.random() * 4) + 1;
    return {
      x: (_.random(0, 5) * 2) % 12,
      y: Math.floor(i / 6) * y,
      w: 2,
      h: y,
      i: i.toString(),
      static: Math.random() < 0.05,
    };
  });
};

export default DemoGrid;
