import { SelectionOption } from "./SelectWithFilter";
import { ValidateFunction } from "./Utils";


type FieldType = "TextInput" | "SelectWithFilter" | "ToggleSwitch"

export interface Field {
  keyName: string;
  label: string;
  type: FieldType;
  testInputType?: "number" | "time" | "text" | "date" | "datetime-local" | "email" | "month" | "password" | "search" | "tel" | "url" | undefined;
  helperText: string;
  helperTextInvalid: string;
  required: boolean;
  validateFunction: ValidateFunction
  options?: SelectionOption[]
}