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

import { Field, ValidateResult } from "../Utils";
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

type Validated<Entity> = {
  [key in keyof Entity]?: ValidateResult;
};

interface State<Entity> {
  localEntity: Entity;
  validated: Validated<Entity>;
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
  const onUpdate = !!entity;

  const [state, setState] = React.useState<State<Entity>>({
    localEntity: entity || ({} as Entity),
    validated: {},
  });

  React.useEffect(() => {
    const validated: Validated<Entity> = {};
    fields.forEach((f) => (validated[f.keyName] = "default"));
    setState({ ...state, validated });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // To validate, the function starts at True and does an "and" that verifies that all fields remain "success"
  const validateForm: () => boolean = () => {
    const validated: Validated<Entity> = {};
    fields.forEach(
      (f) =>
        (validated[f.keyName] = f.inputControl.validate(
          state.localEntity[f.keyName],
          f.inputControl.required
        ))
    );
    const result = (Object.values(validated) as ValidateResult[]).reduce(
      (prev: boolean, val: ValidateResult) =>
        prev && (val === "success" || val === "default"),
      true
    );
    setState({ ...state, validated });
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
                attr[keyName] = state.localEntity[keyName];
              });
              onUpdate
                ? update &&
                  update({
                    variables: { id: entity?.id, ...attr },
                  })
                : create && create({ variables: attr });
              onClose();
            }
          }}
        >
          {onUpdate ? "Update" : "Create"}
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
              validated={state.validated[f.keyName]}
              onChangePassword={(v) =>
                setState({
                  ...state,
                  localEntity: { ...state.localEntity, [f.keyName]: v },
                  validated: {
                    ...state.validated,
                    [f.keyName]: f.inputControl.validate(v, f.inputControl.required)
                  },
                })
              }
              password={(state.localEntity[f.keyName] || "") as string}
            />
          ) : (
            <FormGroup
              key={f.keyName.toString()}
              label={f.label}
              helperText={
                <FormHelperText
                  icon={<ExclamationCircleIcon />}
                  isHidden={state.validated[f.keyName] !== "default"}
                >
                  {f.helperText}
                </FormHelperText>
              }
              helperTextInvalid={f.helperTextInvalid}
              helperTextInvalidIcon={<ExclamationCircleIcon />}
              fieldId={f.keyName.toString()}
              validated={state.validated[f.keyName]}
            >
              {f.type === "TextInput" ? (
                <TextInput
                  validated={state.validated[f.keyName]}
                  value={(state.localEntity[f.keyName] || "") as string}
                  id={f.keyName.toString()}
                  type={f.textInputType}
                  onChange={(v) => {
                    setState({
                      ...state,
                      localEntity: {
                        ...state.localEntity,
                        [f.keyName]:
                          f.textInputType === "number" ? parseFloat(v) : v,
                      },
                      validated: {
                        ...state.validated,
                        [f.keyName]: f.inputControl.validate(
                          f.textInputType === "number" ? parseFloat(v) : v, f.inputControl.required
                        ),
                      },
                    });
                  }}
                />
              ) : f.type === "SelectWithFilter" ? (
                <SelectWithFilter
                  keyName={f.keyName.toString()}
                  label={f.label}
                  options={f.options || []}
                  direction={f.direction}
                  selected={
                    _.find(f.options, ["id", state.localEntity[f.keyName]])
                      ?.value
                  }
                  handleChangeSelected={(v) =>
                    setState({
                      ...state,
                      localEntity: {
                        ...state.localEntity,
                        [f.keyName]: _.find(f.options, { value: v })?.id,
                      },
                      validated: {
                        ...state.validated,
                        [f.keyName]: f.inputControl.validate(
                          _.find(f.options, { value: v })?.id, f.inputControl.required
                        ),
                      },
                    })
                  }
                />
              ) : f.type === "ToggleSwitch" ? (
                <Toggle
                  checked={!!state.localEntity[f.keyName]}
                  size="md"
                  onChange={(v) =>
                    setState({
                      ...state,
                      localEntity: { ...state.localEntity, [f.keyName]: !!v },
                      validated: {
                        ...state.validated,
                        [f.keyName]: f.inputControl.validate(!!v, f.inputControl.required),
                      },
                    })
                  }
                ></Toggle>
              ) : f.type === "MultiSelectWithFilter" ? (
                <MultiSelectWithFilter
                  keyName={f.keyName.toString()}
                  label={f.label}
                  options={f.options || []}
                  direction={f.direction}
                  selected={(state.localEntity[f.keyName] || []) as string[]}
                  handleChangeSelected={(v) =>
                    setState({
                      ...state,
                      localEntity: { ...state.localEntity, [f.keyName]: v },
                      validated: {
                        ...state.validated,
                        [f.keyName]: f.inputControl.validate(v, f.inputControl.required),
                      },
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
