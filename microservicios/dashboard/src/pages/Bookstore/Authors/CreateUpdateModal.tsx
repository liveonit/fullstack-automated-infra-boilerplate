import React from "react";
import {
  Button,
  Modal,
  Form,
  FormGroup,
  TextInput,
  FormHelperText,
} from "@patternfly/react-core";
import { Author } from ".";
import { ExclamationCircleIcon } from "@patternfly/react-icons";

interface CreateUpdateModalProps {
  onClose: () => void;
  author?: Author;
  create?: ({
    variables: { name, age, country },
  }: {
    variables: {
      name: String;
      age?: number | undefined;
      country?: String | undefined;
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

type ValidateResult = "success" | "error" | "default" | "warning" | undefined;

const CreateUpdateModal: React.FC<CreateUpdateModalProps> = ({
  onClose,
  author,
  update,
  create,
}) => {
  const validateName = (n: string): ValidateResult =>
    n === "" ? "default" : /^\d+$/.test(n) ? "success" : "error";

  const validateAge = (n: string): ValidateResult =>
    n === "" ? "default" : /^[1-9]?[1-2]?[0-9]{1}$/.test(n) ? "success" : "error";

  const validateCountry = (n: string): ValidateResult =>
    n === "" ? "default" : /^\d+$/.test(n) ? "success" : "error";

  const [state, setState] = React.useState({
    form: {
      name: {
        value: author?.name || "",
        required: true,
        validate: validateName(author?.name || ""),
      },
      age: {
        value: author?.age?.toString() || "",
        required: true,
        validate: validateAge(author?.age?.toString() || ""),
      },
      country: {
        value: author && author.country,
        required: false,
        validate: validateCountry((author && author.country) || ""),
      },
    },
  });

  const validateForm = () =>
    Object.values(state.form).reduce(
      (v, c) =>
        v &&
        (c.required
          ? c.value === "success"
          : c.value === "success" || c.value === "default"),
      true
    );

  const isUpdate = author !== undefined;
  const id: number = author !== undefined ? author.id : 0;
  const name = state.form.name.value;
  const age = state.form.age.value;
  const country = state.form.country.value;

  return (
    <Modal
      title="Simple modal header"
      isOpen={true}
      onClose={onClose}
      actions={[
        <Button
          key="create"
          variant="primary"
          onClick={(e) => {
            if (validateForm())
              isUpdate
                ? update && update({ variables: { id, name, age: parseInt(age), country } })
                : create && create({ variables: { name, age: parseInt(age) , country } });
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
          label="Age"
          type="number"
          helperText={
            <FormHelperText
              icon={<ExclamationCircleIcon />}
              isHidden={state.form.age.validate !== "default"}
            >
              Please enter your age
            </FormHelperText>
          }
          helperTextInvalid="Age has to be a number"
          helperTextInvalidIcon={<ExclamationCircleIcon />}
          fieldId="age-1"
          validated={state.form.age.validate}
        >
          <TextInput
            validated={state.form.age.validate}
            value={state.form.age.value}
            id="age-1"
            type="number"
            onChange={(v) =>
              setState({
                ...state,
                form: {
                  ...state.form,
                  age: {
                    ...state.form.age,
                    value: v,
                    validate: validateAge(v),
                  }
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
