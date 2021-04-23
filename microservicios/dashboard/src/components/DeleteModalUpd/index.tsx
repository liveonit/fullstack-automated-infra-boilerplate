import React from "react";
import { Button, Modal, ModalVariant } from "@patternfly/react-core";

interface CreateUpdateModalProps {
  onClose: () => void;
  modalVariant?: ModalVariant;
  entityName: string;
  entity?: any;
  rm: ({
    variables: { id },
  }: {
    variables: {
      id: any;
    };
  }) => void;
}

const CreateUpdateModal: React.FC<CreateUpdateModalProps> = ({
  onClose,
  modalVariant,
  entityName,
  entity,
  rm,
}) => {
  return (
    <Modal
      title={`Delete ${entityName}`}
      variant={modalVariant || "small"}
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
      {`Are you sure to delete the ${entityName}?`}
    </Modal>
  );
};

export default CreateUpdateModal;
