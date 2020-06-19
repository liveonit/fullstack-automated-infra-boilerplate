import "./style.css";
import "./demo-style.css";

import React from "react";
import _ from "lodash";
import { Responsive, WidthProvider, Layout } from "react-grid-layout";
import EditableCard from "./Cards/EditableCard";
const ResponsiveReactGridLayout = WidthProvider(Responsive);

export interface Panel extends Layout {
  child?: React.ReactChild;
}

interface Props {
  panels?: Panel[];
  rowHeight: number;
  cols: any;
  compactType?: "vertical" | "horizontal" | null | undefined;
  onLayoutChange: (layout: Layout[], layouts: ReactGridLayout.Layouts) => void;
  onBreakpointChange: (newBreakpoint: string, newCols: number) => void;
}

interface State {
  mounted: boolean;
}

const ResponsiveGridLayout: React.FC<Props> = (props) => {
  const [state, setState] = React.useState<State>({
    mounted: false,
  });

  const { panels, compactType, onBreakpointChange, onLayoutChange } = props;

  React.useEffect(() => {
    setState({ ...state, mounted: true });
  }, []);

  const generateDom = () => {
    console.log("before generate dom")
    return _.map(panels, (l: Panel, i: number) => {
      return (
        <div key={i} style={{ overflow: "hidden", position: "relative" }}>
          <EditableCard id={i.toString()} title="unTitulo">
            {l.child || <div/>}
          </EditableCard>
        </div>
      );
    });
  };


  return (
    <div
      id="responsiveGridContainer"
    >
      <ResponsiveReactGridLayout
        {...props}
        layouts={{ lg: panels || [] }}
        onBreakpointChange={onBreakpointChange}
        onLayoutChange={onLayoutChange}
        measureBeforeMount={false}
        useCSSTransforms={state.mounted}
        compactType={compactType}
        preventCollision={!compactType}
      >
        {generateDom()}
      </ResponsiveReactGridLayout>
    </div>
  );
};

ResponsiveGridLayout.defaultProps = {
  rowHeight: 30,
  onLayoutChange: function () {},
  cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
};

export default ResponsiveGridLayout;
