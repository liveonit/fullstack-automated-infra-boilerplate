import React from "react";
import { Button, Modal } from "@patternfly/react-core";

interface CreateUpdateModalProps {
  onClose: () => void;
  entityName: string;
  entity?: any;
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
  entityName,
  entity,
  rm,
}) => {
  return (
    <Modal
      title={`Delete ${entityName}`}
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
