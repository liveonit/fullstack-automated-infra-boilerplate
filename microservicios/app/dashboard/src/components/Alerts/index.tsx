import React from 'react';
import {
  Alert,
  AlertGroup,
  AlertActionCloseButton,
  AlertVariant
} from '@patternfly/react-core';



interface IAlert {
  title: string;
  type: AlertVariant;
  description: string;
}

interface Props {
  alerts: IAlert[];
  hideAlert: (s: string) => void;
}

const Alerts: React.FC<Props> = ({ alerts, hideAlert }) => {
  let count = 0;
  return (
    <React.Fragment>
      <AlertGroup isToast>
        { alerts.map(({ title, type, description }) => (
          <Alert
            isLiveRegion
            variant={AlertVariant[type]}
            title={title}
            key={++count}
            actionClose={
              <AlertActionCloseButton onClose={() => hideAlert(description)} />
            }
          >{description}</Alert>
        ))}
      </AlertGroup>
    </React.Fragment>
  );
};

export default Alerts;
