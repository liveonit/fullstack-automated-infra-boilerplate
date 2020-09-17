export type ValidateResult = "success" | "error" | "default" | "warning";

export type ValidateFunction = (text?: string, required?: boolean) => ValidateResult
export interface FormInputControl {
  value?: string;
  required: boolean;
  validate: ValidateFunction;
  validated: ValidateResult;
}


export const validateAge: ValidateFunction = (s,r) =>
  (s === "" || s === undefined) ? (r ? "error" : "default") : /^[1-9]?[1-2]?[0-9]{1}$/.test(s) ? "success" : "error";

export const validateFullName: ValidateFunction = (s,r) =>
  (s === "" || s === undefined) ? (r ? "error" : "default") : /^[a-zA-Z]+ +[a-zA-Z]+[a-zA-Z ]+?$/.test(s) ? "success" : "error";

export const validateCountry: ValidateFunction = (s,r) =>
  (s === "" || s === undefined) ? (r ? "error" : "default") : /^[a-zA-Z]+[a-zA-Z ]+?$/.test(s) ? "success" : "error";

export const validateString: ValidateFunction = (s,r) =>
  ((s === "" || s === undefined)  && r) ? "error" : "success";

export const validateId: ValidateFunction = (s,r) =>
  (s === "" || s === undefined) ? (r ? "error" : "default") : /^[1-9][0-9]*$/.test(s) ? "success" : "error";

export const validateBoolean: ValidateFunction = (s,r) =>
  (s === "false") ? (r ? "error" : "default") : "success";