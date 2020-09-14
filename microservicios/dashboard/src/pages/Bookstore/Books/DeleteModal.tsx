import React from "react";
import { Button, Modal } from "@patternfly/react-core";
import { EntityType, ENTITY_NAME } from ".";

interface CreateUpdateModalProps {
  onClose: () => void;
  entity?: EntityType;
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
  entity,
  rm,
}) => {
  return (
    <Modal
      title={`Delete ${ENTITY_NAME}`}
      isOpen={true}
      onClose={onClose}
      actions={[
        <Button
          key="delete"
          variant="primary"
          onClick={(e) => {
            entity && rm({ variables: { id: entity.id } });
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
      {`Are you sure to delete the ${ENTITY_NAME}?`}
    </Modal>
  );
};

export default CreateUpdateModal;
