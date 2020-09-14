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
  validateString,
  FormInputControl,
  validateId
} from "../../../components/Froms/Utils";
import _ from "lodash";

interface CreateUpdateModalProps {
  onClose: () => void;
  entity?: EntityType;
  create?: ({
    variables: { title, authorId, isPublished },
  }: {
    variables: {
      title: string;
      authorId?: number;
      isPublished?: boolean;
    };
  }) => void;
  update?: ({
    variables: { id, title, authorId, isPublished },
  }: {
    variables: {
      id: number;
      title?: string;
      authorId?: number;
      isPublished?: boolean;
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
    title: FormInputControl;
    authorId: FormInputControl;
    isPublished: FormInputControl;
  }>({
    title: {
      value: entity?.title || "",
      required: true,
      validate: validateString,
      validated: "default",
    },
    authorId: {
      value: entity?.authorId?.toString() || "",
      required: true,
      validate: validateId,
      validated: "default",
    },
    isPublished: {
      value: entity?.isPublished ? "true" : "false",
      required: false,
      validate: () => "success",
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
  const title = state.title.value;
  const authorId = state.authorId.value;
  const isPublished = state.isPublished.value;

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
                    variables: { id, title, authorId: parseInt(authorId), isPublished: (isPublished === 'true')  },
                  })
                : create &&
                  create({ variables: { title, authorId: parseInt(authorId), isPublished: (isPublished === 'true') } });
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
          label="Title"
          helperText={
            <FormHelperText
              icon={<ExclamationCircleIcon />}
              isHidden={state.title.validated !== "default"}
            >
              Please enter Title
            </FormHelperText>
          }
          helperTextInvalid="Title cannot be undefined"
          helperTextInvalidIcon={<ExclamationCircleIcon />}
          fieldId="title-1"
          validated={state.title.validated}
        >
          <TextInput
            validated={state.title.validated}
            value={state.title.value}
            id="name-1"
            type="text"
            onChange={(v) =>
              setState({
                ...state,
                title: {
                  ...state.title,
                  value: v,
                  validated: state.title.validate(v, state.title.required),
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
