import "./style.css"
import "./demo-style.css"

import React, { Dispatch, SetStateAction } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { Responsive, WidthProvider, Layout } from "react-grid-layout";
const ResponsiveReactGridLayout = WidthProvider(Responsive);

interface Props {
  onLayoutChange: (layout: Layout[], layouts: ReactGridLayout.Layouts) => void;
  className: string;
  rowHeight: number;
  cols: any;
  initialLayout: Layout[];
}

interface State {
  currentBreakpoint: string;
  compactType?: "vertical" | "horizontal" | null | undefined;
  mounted: boolean;
  layouts: { lg: Layout[] };
}

const DemoGrid: React.FC<Props> = (props) => {
  const [state, setState] = React.useState<State>({
    currentBreakpoint: "lg",
    compactType: "vertical",
    mounted: false,
    layouts: { lg: props.initialLayout },
  });

  React.useEffect(() => {
    setState({ ...state, mounted: true });
  }, []);

  const generateDOM = () => {
    return _.map(state.layouts.lg, function (l, i) {
      return (
        <div key={i} className={l.static ? "static" : ""}>
          {l.static ? (
            <span
              className="text"
              title="This item is static and cannot be removed or resized."
            >
              Static - {i}
            </span>
          ) : (
            <span className="text">{i}</span>
          )}
        </div>
      );
    });
  };

  const onBreakpointChange = (newBreakpoint: string, newCols: number) => {
    setState({
      ...state,
      currentBreakpoint: newBreakpoint,
    });
  };

  const onCompactTypeChange = () => {
    const { compactType: oldCompactType } = state;
    const compactType =
      oldCompactType === "horizontal"
        ? "vertical"
        : oldCompactType === "vertical"
        ? null
        : "horizontal";
    setState({ ...state, compactType });
  };

  const onLayoutChange = (
    currentLayout: Layout[],
    allLayouts: ReactGridLayout.Layouts
  ) => {
    props.onLayoutChange(currentLayout, allLayouts);
  };

  const onNewLayout = () => {
    setState({
      ...state,
      layouts: { lg: generateLayout() },
    });
  };

  return (
    <div>
      <div>
        Current Breakpoint: {state.currentBreakpoint} (
        {props.cols[state.currentBreakpoint]} columns)
      </div>
      <div>
        Compaction type: {_.capitalize(state.compactType || undefined) || "No Compaction"}
      </div>
      <button onClick={onNewLayout}>Generate New Layout</button>
      <button onClick={onCompactTypeChange}>Change Compaction Type</button>
      <ResponsiveReactGridLayout
        {...props}
        layouts={state.layouts}
        onBreakpointChange={onBreakpointChange}
        onLayoutChange={onLayoutChange}
        // WidthProvider option
        measureBeforeMount={false}
        // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
        // and set `measureBeforeMount={true}`.
        useCSSTransforms={state.mounted}
        compactType={state.compactType}
        preventCollision={!state.compactType}
      >
        {generateDOM()}
      </ResponsiveReactGridLayout>
    </div>
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

DemoGrid.defaultProps = {
  className: "layout",
  rowHeight: 30,
  onLayoutChange: function () {},
  cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
  initialLayout: generateLayout(),
};

export default DemoGrid;