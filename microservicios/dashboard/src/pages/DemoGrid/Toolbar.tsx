import React from "react";
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
    <PatternflyToolbar className="project__custom-toolbar">
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
      <ToolbarGroup>
      </ToolbarGroup>
    </PatternflyToolbar>
  );
};

export default Toolbar;
