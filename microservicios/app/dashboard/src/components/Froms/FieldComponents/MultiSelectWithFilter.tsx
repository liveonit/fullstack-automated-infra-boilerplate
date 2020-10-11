import React from "react";
import {
  Select,
  SelectOption,
  SelectOptionObject,
  SelectVariant,
} from "@patternfly/react-core";

export interface SelectionOption {
  id: number | string;
  value: string;
  description?: string;
  disabled?: boolean;
}

interface Props {
  keyName: string;
  label: string;
  selected?: string[];
  options: SelectionOption[];
  handleChangeSelected: (selected?: string[]) => void;
  direction?: "up" | "down";
}

interface State {
  isOpen: boolean;
  isDisabled: boolean;
  isCreatable: boolean;
  hasOnCreateOption: boolean;
  customBadgeText?: string | number;
}

const MultiSelectWithFilter: React.FC<Props> = (props) => {
  const { keyName, label, selected, options, handleChangeSelected, direction } = props;
  const [state, setState] = React.useState<State>({
    isOpen: false,
    isDisabled: false,
    isCreatable: false,
    hasOnCreateOption: false,
    customBadgeText: 0,
  });

  const onToggle = (isOpen: boolean) => {
    setState({
      ...state,
      isOpen,
    });
  };

  const clearSelection = () => {
    handleChangeSelected([]);
  };

  const setBadgeText = (selected: number) => {
    if (selected === options.length) {
      return "All";
    }
    if (selected === 0) {
      return 0;
    }
    return undefined;
  };

  const onSelect = (
    event: React.MouseEvent<Element, MouseEvent> | React.ChangeEvent<Element>,
    selection: string | SelectOptionObject,
    isPlaceholder?: boolean | undefined
  ) => {
    if (isPlaceholder) clearSelection();
    else {
      if (selected?.includes(selection.toString())) {
        handleChangeSelected(
          (selected || []).filter((item) => item !== selection)
        );
      } else {
        handleChangeSelected([...(selected || []), selection.toString()]);
        setState({
          ...state,
          customBadgeText: setBadgeText((selected?.length || -2) + 1),
        });
      }
    }
  };

  const { isDisabled, isCreatable } = state;
  return (
    <div>
      <Select
        variant={SelectVariant.checkbox}
        typeAheadAriaLabel={label}
        onToggle={onToggle}
        onSelect={onSelect}
        onClear={clearSelection}
        selections={selected}
        isOpen={state.isOpen}
        aria-labelledby={keyName}
        placeholderText={label}
        isDisabled={isDisabled}
        isCreatable={isCreatable}
        customBadgeText={state.customBadgeText}
        menuAppendTo={() => document.body}
        direction={direction}
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

export default MultiSelectWithFilter;
