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
import MultiSelectWithFilter from "../MultiSelectWithFilter";

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
      f => {
        const value: string = 
        f.type === 'ToggleSwitch'
          ? ((entity && entity[f.keyName]) ? 'true' : 'false')
          : f.type === 'SelectWithFilter'
          ? _.find(f.options, { id: (entity && entity[f.keyName]) })?.value
          : ((entity && entity[f.keyName]) || "");
          
        (o[f.keyName] = {
          value,
          required: f.required,
          validate: f.validateFunction,
          validated: "default",
        } as FormInputControl)
      }
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
                    // si es ToggleSwitch el valor se pasa de string a boolean
                    fields[i].type === 'ToggleSwitch'
                    ? !!state[k].value
                    : fields[i].type === 'SelectWithFilter'
                    // Select with filter es para seleccionar de una lista de opciones y 
                    //lo que se setea en valor es el id correspondiente a esa opcion
                    ? fields[i].options?.filter(o => o.value === state[k].value)[0].id
                    // si el type es TextInput llega aca, y si el tipo de input es number
                    // hace el parseo de lo contrario coloca el texto directamente
                    : fields[i].textInputType === "number"
                      ? parseInt(state[k].value?.toString() || "")
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
                value={(state[f.keyName]?.value || "") as string}
                id={f.keyName}
                type={f.textInputType}
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
                selected={(state[f.keyName]?.value || "") as string}
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
            ? <Toggle checked={!!state[f.keyName]?.value} size="md" onChange={(v) =>
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
            } ></Toggle>
            : f.type === "MultiSelectWithFilter" ? (
              <MultiSelectWithFilter
                keyName={f.keyName}
                label={f.label}
                options={f.options || []}
                selected={(state[f.keyName]?.value || []) as string[]}
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
            ) : undefined
          }
          </FormGroup>
        ))}
      </Form>
    </Modal>
  );
};

export default CreateUpdateModal;
