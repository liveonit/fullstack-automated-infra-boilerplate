import "./style.css";

import React from "react";
import {
  Card,
  CardHeader,
  CardActions,
  CardBody,
  Dropdown,
  DropdownItem,
  DropdownSeparator,
  KebabToggle,
  Title,
} from "@patternfly/react-core";

interface Properties {
  id: string;
  title: string;
  children: React.ReactChild;
}

interface State {
  isOpen: boolean;
}

const dropdownItems = [
  <DropdownItem key="link">Link</DropdownItem>,
  <DropdownItem key="action" component="button">
    Action
  </DropdownItem>,
  <DropdownItem key="disabled link" isDisabled>
    Disabled Link
  </DropdownItem>,
  <DropdownItem key="disabled action" isDisabled component="button">
    Disabled Action
  </DropdownItem>,
  <DropdownSeparator key="separator" />,
  <DropdownItem key="separated link">Separated Link</DropdownItem>,
  <DropdownItem key="separated action" component="button">
    Separated Action
  </DropdownItem>,
];

const EditableCard: React.FC<Properties> = (props) => {
  const [state, setState] = React.useState<State>({ isOpen: false });
  const onToggle: ((isOpen: boolean) => void) | undefined = (isOpen) => {
    setState({
      ...state,
      isOpen,
    });
  };
  const onSelect: (
    event?: React.SyntheticEvent<HTMLDivElement, Event> | undefined
  ) => void = (event) => {
    event?.stopPropagation();
    setState({
      isOpen: !state.isOpen,
    });
  };

  const { id, title, children } = props;
  return (
    <div id="card-container">
      <Card id={id} isSelectable={false}>
        <CardHeader>
          <Title size="sm" className="--card-title">
            {title}
          </Title>
          <CardActions className="--card-actions">
            <Dropdown
              onSelect={onSelect}
              toggle={<KebabToggle onToggle={onToggle} />}
              isOpen={state.isOpen}
              isPlain
              dropdownItems={dropdownItems}
              position={"right"}
            />
          </CardActions>
        </CardHeader>
        <CardBody>{children}</CardBody>
      </Card>
    </div>
  );
};

export default EditableCard;
