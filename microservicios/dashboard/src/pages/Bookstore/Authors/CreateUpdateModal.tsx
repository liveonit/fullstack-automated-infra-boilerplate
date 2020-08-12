import React from "react";
import { Button, Modal } from "@patternfly/react-core";
import { Author } from ".";

interface CreateUpdateModalProps {
  isModalOpen: boolean;
  handleModalToggle: () => void;
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

const CreateUpdateModal: React.FC<CreateUpdateModalProps> = ({
  isModalOpen,
  handleModalToggle,
  author,
  update,
  create,
}) => {
  const [authorLoc, setAuthorLoc] = React.useState(author);

  const isUpdate = author !== undefined;
  let id: number,
    name: string,
    age: number,
    country: string | undefined
  if (authorLoc) ({ id, name, age, country } = authorLoc)
  return (
    <Modal
      title="Simple modal header"
      isOpen={isModalOpen}
      onClose={handleModalToggle}
      actions={[
        <Button
          key="create"
          variant="primary"
          onClick={(e) =>
            {
              isUpdate
              ? update && update({ variables: { id, name, age, country } })
              : create && create({ variables: { name, age, country } })
            }
            
          }
        >
          {isUpdate ? "Update" : "Create"}
        </Button>,
        <Button key="cancel" variant="link" onClick={handleModalToggle}>
          Cancel
        </Button>,
      ]}
    >
      Aca va todo el formulario para crear el modal
    </Modal>
  );
};

export default CreateUpdateModal;
