import React from "react";
import {
  Select,
  SelectOption,
  SelectOptionObject,
  SelectVariant,
} from "@patternfly/react-core";

export interface SelectionOption {
  value: string;
  description?: string;
  disabled?: boolean;
}

interface Props {
  selected: SelectOptionObject;
  options: SelectionOption[];
  handleChangeSelected: (selected: SelectOptionObject | null) => void;
}

interface State {
  isOpen: boolean;
  isDisabled: boolean;
  isCreatable: boolean;
  hasOnCreateOption: boolean;
}

const TypeaheadSelectInput: React.FC<Props> = (props) => {
  const { selected, options, handleChangeSelected } = props;
  const [state, setState] = React.useState<State>({
    isOpen: false,
    isDisabled: false,
    isCreatable: false,
    hasOnCreateOption: false,
  });

  const onToggle = (isOpen: boolean) => {
    setState({
      ...state,
      isOpen,
    });
  };

  const onSelect = (
    event: React.MouseEvent<Element, MouseEvent> | React.ChangeEvent<Element>,
    selection: string | SelectOptionObject,
    isPlaceholder?: boolean | undefined
  ) => {
    if (isPlaceholder) clearSelection();
    else {
      handleChangeSelected(selection);
      setState({
        ...state,
        isOpen: false,
      });
      console.log("selected:", selection);
    }
  };

  const clearSelection = () => {
    handleChangeSelected(null);
    setState({
      ...state,
      isOpen: false,
    });
  };


  const { isDisabled, isCreatable } = state;
  const titleId = "typeahead-select-id-1";
  return (
    <div>
      <Select
        variant={SelectVariant.typeahead}
        typeAheadAriaLabel="Select a state"
        onToggle={onToggle}
        onSelect={onSelect}
        onClear={clearSelection}
        selections={selected}
        isOpen={state.isOpen}
        aria-labelledby={titleId}
        placeholderText="Select a state"
        isDisabled={isDisabled}
        isCreatable={isCreatable}
      >
        {options.map((option, index) => (
          <SelectOption
            isDisabled={option.disabled}
            key={index}
            value={option.value}
            {...(option.description && { description: option.description })}
          />
        ))}
      </Select>
    </div>
  );
};

export default TypeaheadSelectInput