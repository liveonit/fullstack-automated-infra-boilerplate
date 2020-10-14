import React from "react";
import {
  Select,
  SelectOption,
  SelectOptionObject,
  SelectVariant,
} from "@patternfly/react-core";
import _ from "lodash";

export interface SelectionOption {
  id: number | string;
  value: string;
  description?: string;
  disabled?: boolean;
}

interface Props {
  keyName: string;
  label: string;
  selected: (string | number)[];
  options: SelectionOption[];
  handleChangeSelected: (selected?: (string | number)[]) => void;
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
  const {
    keyName,
    label,
    selected,
    options,
    handleChangeSelected,
    direction,
  } = props;
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
    selection: string | SelectOptionObject
  ) => {
      const itemId: string | number | undefined = _.find(options, {
        value: selection.toString(),
      })?.id;
      if (itemId && _.find(selected, (s) => s === itemId)) {
        const result = selected.filter((i) => i !== itemId);
        handleChangeSelected(result);
        setState({
          ...state,
          customBadgeText: setBadgeText(result.length),
        });
      } else {
        if (itemId) {
          handleChangeSelected([...(selected || []), itemId]);
          setState({
            ...state,
            customBadgeText: setBadgeText(selected.length + 1),
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
        selections={selected.map(s => _.find(options, { id: s })?.value)}
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
