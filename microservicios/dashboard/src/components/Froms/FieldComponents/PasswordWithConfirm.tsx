import {
  FormGroup,
  FormHelperText,
  TextInput,
  TextInputProps,
} from "@patternfly/react-core";
import { ExclamationCircleIcon } from "@patternfly/react-icons";
import React from "react";

interface Props extends TextInputProps {
  onChangePassword: (password: string) => void;
  password: string;
  keyName: string;
  label?: string;
  helperText?: string;
  helperTextInvalid?: string;
  validated?: "default" | "warning" | "success" | "error";
}

interface State {
  confirmPass: string;
  confirmValidate: "default" | "success" | "error" | "warning";
}

const PasswordWithConfirm: React.FC<Props> = (props) => {
  const {
    onChangePassword,
    password,
    keyName,
    label,
    helperText,
    helperTextInvalid,
    validated,
  } = props;
  const [state, setState] = React.useState<State>({
    confirmPass: "",
    confirmValidate: "default",
  });

  return (
    <>
      <FormGroup
        key={keyName}
        label={label}
        helperText={
          <FormHelperText
            icon={<ExclamationCircleIcon />}
            isHidden={validated !== "default"}
          >
            {helperText}
          </FormHelperText>
        }
        helperTextInvalid={
          validated !== "success"
            ? helperTextInvalid
            : "The password confirmation does not match"
        }
        helperTextInvalidIcon={<ExclamationCircleIcon />}
        fieldId={keyName}
        validated={
          (validated === "success" && state.confirmValidate === "success") ||
          (validated === "default" && state.confirmValidate === "default")
            ? "success"
            : "error"
        }
      >
        <TextInput
          aria-label={label}
          key={keyName + "i1"}
          value={password}
          onChange={(v) => onChangePassword(v)}
          validated={validated}
          onBlur={() =>
            setState({
              ...state,
              confirmValidate:
                password !== ""
                  ? password === state.confirmPass
                    ? "success"
                    : "error"
                  : "default",
            })
          }
          type="password"
        />
        <div className="pf-c-form__group-label" style={{ paddingTop: "0.4rem"}}>
          <label className="pf-c-form__label">
            <span className="pf-c-form__label-text">Confirm Password</span>
          </label>
        </div>

        <TextInput
          aria-label={label}
          key={keyName + "i2"}
          value={state.confirmPass}
          onChange={(v) => {
            setState({
              ...state,
              confirmPass: v,
              confirmValidate:
                password === v ? "success" : "error",
            });
          }}
          validated={state.confirmValidate}
          type="password"
        />
      </FormGroup>
    </>
  );
};

export default PasswordWithConfirm;
