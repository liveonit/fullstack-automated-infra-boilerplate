import React from "react";
import "@patternfly/react-styles";

import {
  Button,
  ButtonVariant,
  Toolbar as PatternflyToolbar,
  ToolbarItem,
  ToolbarGroup,
} from "@patternfly/react-core";

interface ToolbarProps {
  onNewLayout: () => void;
  onCompactTypeChange: () => void;
  compactType?: "vertical" | "horizontal" | null | undefined;
}

const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onNewLayout, onCompactTypeChange } = props;
  return (
    <PatternflyToolbar>
      <ToolbarGroup>
        <ToolbarItem>
          <Button
            style={{ display: "inline-block" }}
            variant={ButtonVariant.primary}
            aria-label="Generar nueva distribucion del grid"
            onClick={onNewLayout}
          >
            Nuevos paneles
          </Button>
        </ToolbarItem>
      </ToolbarGroup>
      <ToolbarGroup>
        <ToolbarItem>
          <Button
            style={{ display: "inline-block" }}
            variant={ButtonVariant.primary}
            aria-label="Cambiar tipo de orden"
            onClick={onCompactTypeChange}
          >
            Cambiar distribucion
          </Button>
        </ToolbarItem>
      </ToolbarGroup>
    </PatternflyToolbar>
  );
};

export default Toolbar;
