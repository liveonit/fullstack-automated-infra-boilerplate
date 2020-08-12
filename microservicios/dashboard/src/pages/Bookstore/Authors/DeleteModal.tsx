import React from "react";
import { Button, Modal } from "@patternfly/react-core";
import { Author } from ".";

interface CreateUpdateModalProps {
  onClose: () => void;
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
  onClose,
  author,
  rm,
}) => {
  return (
    <Modal
      title="Simple modal header"
      isOpen={true}
      onClose={onClose}
      actions={[
        <Button
          key="delete"
          variant="primary"
          onClick={(e) => {
            author && rm({ variables: { id: author.id } });
            onClose();
          }}
        >
          Yes, delete
        </Button>,
        <Button key="cancel" variant="link" onClick={onClose}>
          No, cancel
        </Button>,
      ]}
    >
      Are you sure to delete the Author?
    </Modal>
  );
};

export default CreateUpdateModal;
