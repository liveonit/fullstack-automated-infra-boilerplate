import "./style.css"
import "./demo-style.css"

import React from 'react'
import _ from 'lodash'
import { Responsive, WidthProvider, Layout } from "react-grid-layout";
const ResponsiveReactGridLayout = WidthProvider(Responsive);

export interface Panel extends Layout {
  child?: React.ReactChild;
}

interface Props {
  rowHeight: number;
  cols: any;
  panels: Panel[];
  compactType?: "vertical" | "horizontal" | null | undefined;
  onLayoutChange: (layout: Layout[], layouts: ReactGridLayout.Layouts) => void;
  onBreakpointChange: (newBreakpoint: string, newCols: number)  => void;
}

interface State {
  mounted: boolean;
}


const ResponsiveGridLayout: React.FC<Props> = (props) => {
  const [state, setState] = React.useState<State>({
    mounted: false
  });

  const {panels, compactType, onBreakpointChange, onLayoutChange} = props;

  React.useEffect(() => {
    setState({ ...state, mounted: true });
  }, []);

  const generateDOM = () => {
    return _.map(panels, function (l, i) {
      return (
        <div key={i} className={l.static ? "static" : ""} style={{ overflow: "hidden" }}>
          {l.child}
        </div>
      );
    });
  };

  return (
      <ResponsiveReactGridLayout
        {...props}
        layouts={{ lg: panels}}
        onBreakpointChange={onBreakpointChange}
        onLayoutChange={onLayoutChange}
        // WidthProvider option
        measureBeforeMount={false}
        // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
        // and set `measureBeforeMount={true}`.
        useCSSTransforms={state.mounted}
        compactType={compactType}
        preventCollision={!compactType}
      >
        {generateDOM()}
      </ResponsiveReactGridLayout>
  );
};

ResponsiveGridLayout.defaultProps = {
  rowHeight: 30,
  onLayoutChange: function () {},
  cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }
};



export default ResponsiveGridLayout;