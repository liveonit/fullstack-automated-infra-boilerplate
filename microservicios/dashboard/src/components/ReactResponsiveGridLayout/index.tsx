import "./style.css"
import "./demo-style.css"

import React from 'react'
import _ from 'lodash'
import { Responsive, WidthProvider, Layout } from "react-grid-layout";
const ResponsiveReactGridLayout = WidthProvider(Responsive);


interface Props {
  rowHeight: number;
  cols: any;
  layouts: Layout[];
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

  const {layouts, compactType, onBreakpointChange, onLayoutChange} = props;

  React.useEffect(() => {
    setState({ ...state, mounted: true });
  }, []);

  const generateDOM = () => {
    return _.map(layouts, function (l, i) {
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

  return (
      <ResponsiveReactGridLayout
        {...props}
        layouts={{ lg: layouts}}
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