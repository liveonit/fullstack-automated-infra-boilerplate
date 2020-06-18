import React from "react";
import { PageSection, PageSectionVariants } from "@patternfly/react-core";

import _ from "lodash";
import MultiColorChart from "../../components/Trend";
import Toolbar from "./Toolbar";
import { Layout, Layouts } from "react-grid-layout";
import EditableCard from "../../components/Cards/EditableCard";

import ResponsiveGridLayout, {
  Panel,
} from "../../components/ReactResponsiveGridLayout";
interface State {
  cols: any;
  panels: Panel[];
  compactType?: "vertical" | "horizontal" | null | undefined;
  currentBreakpoint: string;
  rowsHeight: number;
}


const DemoGrid = () => {
  const [state, setState] = React.useState<State>({
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    panels: generateLayout(),
    compactType: "vertical",
    currentBreakpoint: "",
    rowsHeight: 30,
  });

  const onCompactTypeChange = () => {
    const compactType =
      state.compactType === "horizontal"
        ? "vertical"
        : state.compactType === "vertical"
        ? null
        : "horizontal";
    setState({ ...state, compactType });
  };

  
  const onNewLayout = () => {
    setState({
      ...state,
      panels: generateLayout(),
    });
  };
  
  const onLayoutChange = (layout: Layout[], layouts: Layouts) => {
    let panels = state.panels.map<Panel>((l: Layout, i: number) => ({
      ...l,
      ...layouts.lg[i],
    }));
    setState({ ...state, panels });
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
          panels={state.panels}
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
const editCardContainerRef: React.RefObject<HTMLDivElement> = React.createRef();
const generateLayout: () => Panel[] = () => {
  return _.map(_.range(0, 25), function (item, i) {
    var y = Math.ceil(Math.random() * 4) + 1;
    return {
      x: (_.random(0, 5) * 2) % 12,
      y: Math.floor(i / 6) * y,
      w: 2,
      h: y,
      i: i.toString(),
      static: false,
      child: (
        <EditableCard id={i.toString()} title="unTitulo">
          <MultiColorChart></MultiColorChart>
        </EditableCard>
      ),
    };
  });
};

export default DemoGrid;
