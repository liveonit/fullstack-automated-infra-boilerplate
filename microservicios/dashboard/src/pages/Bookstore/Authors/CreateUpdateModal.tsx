import React from "react";
import {
  Button,
  Modal,
  Form,
  FormGroup,
  TextInput,
  FormHelperText,
} from "@patternfly/react-core";
import { EntityType, ENTITY_NAME } from ".";
import { ExclamationCircleIcon } from "@patternfly/react-icons";
import {
  validateFullName,
  validateAge,
  validateCountry,
  FormInputControl,
} from "../../../components/Froms/Utils";
import _ from "lodash";

interface CreateUpdateModalProps {
  onClose: () => void;
  entity?: EntityType;
  create?: ({
    variables: { name, age, country },
  }: {
    variables: {
      name: String;
      age?: number;
      country?: String;
    };
  }) => void;
  update?: ({
    variables: { id, name, age, country },
  }: {
    variables: {
      id: number;
      name?: String;
      age?: number;
      country?: String;
    };
  }) => void;
}

const CreateUpdateModal: React.FC<CreateUpdateModalProps> = ({
  onClose,
  entity,
  update,
  create,
}) => {
  const [state, setState] = React.useState<{
    name: FormInputControl;
    age: FormInputControl;
    country: FormInputControl;
  }>({
    name: {
      value: entity?.name || "",
      required: true,
      validate: validateFullName,
      validated: "default",
    },
    age: {
      value: entity?.age?.toString() || "",
      required: true,
      validate: validateAge,
      validated: "default",
    },
    country: {
      value: entity?.country || "",
      required: false,
      validate: validateCountry,
      validated: "default",
    },
  });

  const validateForm = () => {
    const form =  {...state}

    for (const key in state) {
      const f: FormInputControl = _.get(form, key)
      _.set(form, `${key}.validated`, f.validate(f.value,f.required))
    }
    setState(form)
    return Object.values(form).reduce(
      (v, c) =>
        v &&
        (c.validated === "success" || c.validated === "default"),
      true
    );
  }


  const isUpdate = entity !== undefined;
  const id: number = entity !== undefined ? entity.id : 0;
  const name = state.name.value;
  const age = state.age.value;
  const country = state.country.value;

  return (
    <Modal
      title={`Create ${ENTITY_NAME}`}
      isOpen={true}
      onClose={onClose}
      actions={[
        <Button
          key="create"
          variant="primary"
          onClick={(e) => {
            if (validateForm()) {
              isUpdate
                ? update &&
                  update({
                    variables: { id, name, age: parseInt(age), country },
                  })
                : create &&
                  create({ variables: { name, age: parseInt(age), country } });
                onClose();
            }
          }}
        >
          {isUpdate ? "Update" : "Create"}
        </Button>,
        <Button key="cancel" variant="link" onClick={onClose}>
          Cancel
        </Button>,
      ]}
    >
      <Form>
      <FormGroup
          label="Full Name"
          helperText={
            <FormHelperText
              icon={<ExclamationCircleIcon />}
              isHidden={state.name.validated !== "default"}
            >
              Please enter Author's full name
            </FormHelperText>
          }
          helperTextInvalid="Full name has to be at least two words"
          helperTextInvalidIcon={<ExclamationCircleIcon />}
          fieldId="name-1"
          validated={state.name.validated}
        >
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
        </FormGroup>

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
