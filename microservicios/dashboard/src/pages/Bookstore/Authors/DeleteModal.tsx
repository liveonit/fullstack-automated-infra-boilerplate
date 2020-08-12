import React from "react";
import { Button, Modal } from "@patternfly/react-core";
import { Author } from ".";

interface CreateUpdateModalProps {
  isModalOpen: boolean;
  handleModalToggle: () => void;
  author?: Author;
  rm: ({
    variables: { id },
  }: {
    variables: {
      id: number;
    };
  }) => void;
}

const CreateUpdateModal: React.FC<CreateUpdateModalProps> = ({
  isModalOpen,
  handleModalToggle,
  author,
  rm,
}) => {
  return (
    <Modal
      title="Simple modal header"
      isOpen={isModalOpen}
      onClose={handleModalToggle}
      actions={[
        <Button
          key="delete"
          variant="primary"
          onClick={(e) => {
            author && rm({ variables: { id: author.id } });
            handleModalToggle();
          }}
        >
          Yes, delete
        </Button>,
        <Button key="cancel" variant="link" onClick={handleModalToggle}>
          No, cancel
        </Button>,
      ]}
    >
      Are you sure to delete the Author?
    </Modal>
  );
};

export default CreateUpdateModal;
