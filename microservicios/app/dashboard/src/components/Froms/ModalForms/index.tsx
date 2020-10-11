import React from "react";
import {
  Button,
  Modal,
  Form,
  FormGroup,
  TextInput,
  FormHelperText,
  ModalVariant,
} from "@patternfly/react-core";

import { Toggle } from "rsuite";

import { ExclamationCircleIcon } from "@patternfly/react-icons";

import { Field } from "../Utils";
import SelectWithFilter from "../FieldComponents/SelectWithFilter";
import MultiSelectWithFilter from "../FieldComponents/MultiSelectWithFilter";
import PasswordWithConfirm from "../FieldComponents/PasswordWithConfirm";
import _ from "lodash";

interface GenericModalProps<Entity, EntityCreateVars, EntityUpdateVars> {
  title: string;
  modalVariant: ModalVariant;
  entity?: { id: any } & Entity;
  onClose: () => void;
  fields: Field<Entity>[];
  create?: ({ variables }: { variables: EntityCreateVars }) => void;
  update?: ({ variables }: { variables: EntityUpdateVars }) => void;
}

const CreateUpdateModal = <Entity, EntityCreateVars, EntityUpdateVars>(
  props: GenericModalProps<Entity, EntityCreateVars, EntityUpdateVars>
) => {
  const {
    title,
    entity,
    modalVariant,
    onClose,
    fields,
    update,
    create,
  } = props;
  const [state, setState] = React.useState<Entity>({} as Entity);
  React.useEffect(() => {
    const state: any = {};
    fields.forEach((f) => (state[f.keyName] = entity && entity[f.keyName]));
    setState(state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // To validate, the function starts at True and does an "and" that verifies that all fields remain "success"
  const validateForm: () => boolean = () => {
    const result = fields.reduce((prev, { keyName, inputControl }) => (
        prev &&
        inputControl.validate(state[keyName], inputControl.required) ===
          "success"
      )
    , true);
    return result;
  };

  return (
    <Modal
      variant={modalVariant}
      title={title}
      isOpen={true}
      onClose={onClose}
      actions={[
        <Button
          key="create"
          variant="primary"
          onClick={() => {
            const attr: any = {};
            if (validateForm()) {
              fields.forEach(({ keyName }) => {
                attr[keyName] = state[keyName];
              });
              entity !== undefined
                ? update &&
                  update({
                    variables: { id: entity.id, ...attr },
                  })
                : create && create({ variables: attr });
              onClose();
            }
          }}
        >
          {entity !== undefined ? "Update" : "Create"}
        </Button>,
        <Button key="cancel" variant="link" onClick={onClose}>
          Cancel
        </Button>,
      ]}
    >
      <Form>
        {fields.map((f) =>
          f.type === "Password" ? (
            <PasswordWithConfirm
              key={f.keyName.toString()}
              keyName={f.keyName.toString()}
              label={f.label}
              helperText={f.helperText}
              helperTextInvalid={f.helperTextInvalid}
              validated={f.inputControl.validate(state[f.keyName])}
              onChangePassword={(v) =>
                setState({
                  ...state,
                  [f.keyName]: v,
                })
              }
              password={(state[f.keyName] || "") as string}
            />
          ) : (
            <FormGroup
              key={f.keyName.toString()}
              label={f.label}
              helperText={
                <FormHelperText
                  icon={<ExclamationCircleIcon />}
                  isHidden={
                    f.inputControl.validate(state[f.keyName]) !== "default"
                  }
                >
                  {f.helperText}
                </FormHelperText>
              }
              helperTextInvalid={f.helperTextInvalid}
              helperTextInvalidIcon={<ExclamationCircleIcon />}
              fieldId={f.keyName.toString()}
              validated={f.inputControl.validate(state[f.keyName])}
            >
              {f.type === "TextInput" ? (
                <TextInput
                  validated={f.inputControl.validate(state[f.keyName])}
                  value={(state[f.keyName] || "") as string}
                  id={f.keyName.toString()}
                  type={f.textInputType}
                  onChange={(v) => {
                    setState({
                      ...state,
                      [f.keyName]: f.textInputType === "number" ? parseFloat(v) : v ,
                    })
                  }
                }
                />
              ) : f.type === "SelectWithFilter" ? (
                <SelectWithFilter
                  keyName={f.keyName.toString()}
                  label={f.label}
                  options={f.options || []}
                  selected={_.find(f.options, ["id", state[f.keyName] ] )?.value}
                  handleChangeSelected={(v) =>
                    setState({
                      ...state,
                      [f.keyName]: _.find(f.options, { value: v })?.id,
                    })
                  }
                />
              ) : f.type === "ToggleSwitch" ? (
                <Toggle
                  checked={!!state[f.keyName]}
                  size="md"
                  onChange={(v) =>
                    setState({
                      ...state,
                      [f.keyName]: !!v,
                    })
                  }
                ></Toggle>
              ) : f.type === "MultiSelectWithFilter" ? (
                <MultiSelectWithFilter
                  keyName={f.keyName.toString()}
                  label={f.label}
                  options={f.options || []}
                  selected={(state[f.keyName] || []) as string[]}
                  handleChangeSelected={(v) =>
                    setState({
                      ...state,
                      [f.keyName]: v,
                    })
                  }
                />
              ) : undefined}
            </FormGroup>
          )
        )}
      </Form>
    </Modal>
  );
};

export default CreateUpdateModal;
