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
import { FormInputControl } from "../Utils";

import _ from "lodash";

import { Field } from "../FieldsTypes";
import SelectWithFilter from "../SelectWithFilter";

type Entity = { id: number; name: string } & Object;

interface GenericModalProps {
  title: string;
  entity?: Entity;
  onClose: () => void;
  fields?: Field[];
  create?: ({ variables }: { variables: Object }) => void;
  update?: ({ variables }: { variables: Object }) => void;
}

interface State {
  [key: string]: FormInputControl;
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
    const o: any = {};
    fields?.forEach(
      (f) =>
        (o[f.keyName] = {
          value: f.initValue,
          required: f.required,
          validate: f.validateFunction,
          validated: f.validateFunction(f.initValue, f.required),
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
              Object.keys(state).forEach((k) => (attr[k] = state[k].value));
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
        {(fields && fields.forEach((f) => (
          <FormGroup
            label={f.label}
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
            {f.type === "TextInput" ? (
              <TextInput
                validated={state.name.validated}
                value={state.name.value}
                id={f.keyName}
                type={f.testInputType}
                onChange={(v) =>
                  setState({
                    ...state,
                    [f.keyName]: {
                      ...state[f.keyName],
                      value: v,
                      validated: state[f.keyName].validate(v, state[f.keyName].required),
                    },
                  })
                }
              />
            ) : f.type === "SelectWithFilter" ? (
              <SelectWithFilter
              keyName={f.keyName}
              label={f.label}
              options={[{ value: "una opc" }, { value: "otra opc" }, { value: "tercer opc"}]}
              selected={state[f.keyName].value}
              handleChangeSelected={v => setState({
                ...state, 
                [f.keyName]: {
                  ...state[f.keyName],
                  value: v,
                  validated: state[f.keyName].validate(v, state[f.keyName].required)
              } }) }
            />
            ) : undefined}
          </FormGroup>
        ))) || <></>}
      </Form>
    </Modal>
  );
};

export default CreateUpdateModal;
