import React from "react";
import {
  Button,
  Modal,
  Form,
  FormGroup,
  TextInput,
  FormHelperText,
} from "@patternfly/react-core";

import { ExclamationCircleIcon } from "@patternfly/react-icons";
import {
  FormInputControl,
} from "../Utils";

import _ from "lodash";

import { Field } from "../FieldsTypes";

type Entity = { id: number, name: string } & Object;

interface GenericModalProps {
  title: string;
  entity?: Entity;
  onClose: () => void;
  fields?: Field[];
  create?: ({ variables }: { variables: Object }) => void;
  update?: ({ variables }: { variables: Object }) => void;
}

interface State {
  [key: string]: FormInputControl
}

const CreateUpdateModal: React.FC<GenericModalProps> = ({
  title,
  entity,
  onClose,
  fields,
  update,
  create,
}) => {
  const [state, setState] = React.useState<State>({});
  
  React.useEffect(() => {
    const o: any = {}
    fields?.forEach((f) => (
      o[f.keyName] = {
        value: f.initValue,
        required: f.required,
        validate: f.validateFunction,
        validated: f.validateFunction(f.initValue, f.required)
      } as FormInputControl
    ));
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
      (v, c) => v && ((c as FormInputControl).validated === "success" || (c as FormInputControl).validated === "default"),
      true
    );
  };

  return (
    <Modal
      title={title}
      isOpen={true}
      onClose={onClose}
      actions={[
        <Button
          key="create"
          variant="primary"
          onClick={(e) => {
            if (state && validateForm()) {
              const attr: any = {}
              Object.keys(state).forEach(k => attr[k] = state[k].value)
              entity !== undefined
                ? update &&
                  update({
                    variables: { id: entity.id, ...attr },
                  })
                : create &&
                  create({ variables: attr });
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
        {
          fields?.forEach(f => <FormGroup
            label="Full Name"
            helperText={
              <FormHelperText
                icon={<ExclamationCircleIcon />}
                isHidden={state[f.keyName].validated !== "default"}
              >
                {f.helperText}
              </FormHelperText>
            }
            helperTextInvalid={f.helperTextInvalid}
            helperTextInvalidIcon={<ExclamationCircleIcon />}
            fieldId={f.keyName}
            validated={state[f.keyName].validated}
          >
            {
              f.type === "TextInput" 
              ? <p>Is text input</p>
              : f.type === "SelectWithFilter"
              ? <p> Is select with filter</p>
              : undefined
            }
            <TextInput
              validated={state.name.validated}
              value={state.name.value}
              id="name-1"
              type="text"
              onChange={(v) =>
                setState({
                  ...state,
                  name: {
                    ...state.name,
                    value: v,
                    validated: state.name.validate(v, state.name.required),
                  },
                })
              }
            />
          </FormGroup>)
        }
        

        <FormGroup
          label="Age"
          type="number"
          helperText={
            <FormHelperText
              icon={<ExclamationCircleIcon />}
              isHidden={state.age.validated !== "default"}
            >
              Please enter your age
            </FormHelperText>
          }
          helperTextInvalid="Age has to be a number"
          helperTextInvalidIcon={<ExclamationCircleIcon />}
          fieldId="age-1"
          validated={state.age.validated}
        >
          <TextInput
            validated={state.age.validated}
            value={state.age.value}
            id="age-1"
            type="number"
            onChange={(v) =>
              setState({
                ...state,
                age: {
                  ...state.age,
                  value: v,
                  validated: state.age.validate(v, state.age.required),
                },
              })
            }
          />
        </FormGroup>

        <FormGroup
          label="Country"
          helperText={
            <FormHelperText
              icon={<ExclamationCircleIcon />}
              isHidden={state.country.validated !== "default"}
            >
              Please enter Author's country
            </FormHelperText>
          }
          helperTextInvalid="If country is set, it has to be at least one word"
          helperTextInvalidIcon={<ExclamationCircleIcon />}
          fieldId="country-1"
          validated={state.country.validated}
        >
          <TextInput
            validated={state.country.validated}
            value={state.country.value}
            id="country-1"
            type="text"
            onChange={(v) =>
              setState({
                ...state,
                country: {
                  ...state.country,
                  value: v,
                  validated: state.country.validate(v, state.country.required),
                },
              })
            }
          />
        </FormGroup>
      </Form>
    </Modal>
  );
};

export default CreateUpdateModal;
