import React from "react";
import {
  Button,
  Modal,
  Form,
  FormGroup,
  TextInput,
  FormHelperText, ModalVariant
} from "@patternfly/react-core";

import { Toggle } from 'rsuite'

import { ExclamationCircleIcon } from "@patternfly/react-icons";
import { FormInputControl } from "../Utils";

import _ from "lodash";

import { Field } from "../FieldsTypes";
import SelectWithFilter from "../SelectWithFilter";

type Entity = { id: number; name: string } & any;

interface GenericModalProps {
  title: string;
  modalVariant: ModalVariant;
  entity?: Entity;
  onClose: () => void;
  fields: Field[];
  create?: ({ variables }: { variables: any }) => void;
  update?: ({ variables }: { variables: any }) => void;
}

interface State {
  [key: string]: FormInputControl;
}

const CreateUpdateModal: React.FC<GenericModalProps> = ({
  title,
  entity,
  modalVariant,
  onClose,
  fields,
  update,
  create,
}) => {
  const [state, setState] = React.useState<State>({});

  React.useEffect(() => {
    const o: any = {};
    fields?.forEach(
      (f) =>
        (o[f.keyName] = {
          value: (entity && entity[f.keyName]) || "",
          required: f.required,
          validate: f.validateFunction,
          validated: "default",
        } as FormInputControl)
    );
    setState(o);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateForm = () => {
    const form = { ...state };

    for (const key in state) {
      const f: FormInputControl = _.get(form, key);
      _.set(form, `${key}.validated`, f.validate(f.value, f.required));
    }
    setState(form);
    return Object.values(form).reduce(
      (v, c) =>
        v &&
        ((c as FormInputControl).validated === "success" ||
          (c as FormInputControl).validated === "default"),
      true
    );
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
          onClick={(e) => {
            if (state && validateForm()) {
              const attr: any = {};
              Object.keys(state).forEach(
                (k, i) =>
                  (attr[k] =
                    fields[i].type === "ToggleSwitch"
                    ? state[k].value === 'true'
                    : fields[i].type === 'SelectWithFilter'
                    ? fields[i].options?.filter(o => o.value === state[k].value)[0].id
                    : fields[i].testInputType === "number"
                      ? parseInt(state[k].value || "")
                      : state[k].value)
              );
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
        {fields.map((f) => (
          <FormGroup
            key={f.keyName}
            label={f.label}
            helperText={
              <FormHelperText
                icon={<ExclamationCircleIcon />}
                isHidden={state[f.keyName]?.validated !== "default"}
              >
                {f.helperText}
              </FormHelperText>
            }
            helperTextInvalid={f.helperTextInvalid}
            helperTextInvalidIcon={<ExclamationCircleIcon />}
            fieldId={f.keyName}
            validated={state[f.keyName]?.validated}
          >
            {f.type === "TextInput" ? (
              <TextInput
                validated={state[f.keyName]?.validated}
                value={state[f.keyName]?.value}
                id={f.keyName}
                type={f.testInputType}
                onChange={(v) =>
                  setState({
                    ...state,
                    [f.keyName]: {
                      ...state[f.keyName],
                      value: v,
                      validated: state[f.keyName]?.validate(
                        v,
                        state[f.keyName]?.required
                      ),
                    },
                  })
                }
              />
            ) : f.type === "SelectWithFilter" ? (
              <SelectWithFilter
                keyName={f.keyName}
                label={f.label}
                options={f.options || []}
                selected={state[f.keyName]?.value}
                handleChangeSelected={(v) =>
                  setState({
                    ...state,
                    [f.keyName]: {
                      ...state[f.keyName],
                      value: v,
                      validated: state[f.keyName]?.validate(
                        v,
                        state[f.keyName]?.required
                      ),
                    },
                  })
                }
              />
            ) : f.type === "ToggleSwitch" 
            ? <Toggle size="md" onChange={(v) =>
              setState({
                ...state,
                [f.keyName]: {
                  ...state[f.keyName],
                  value: v ? "true" : "false",
                  validated: state[f.keyName]?.validate(
                    v ? "true" : "false",
                    state[f.keyName]?.required
                  ),
                },
              })
            } ></Toggle>
            : undefined
          }
          </FormGroup>
        ))}
      </Form>
    </Modal>
  );
};

export default CreateUpdateModal;
