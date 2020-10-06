import { SelectionOption } from "./SelectWithFilter";
import { ValidateFunction } from "./Utils";


type FieldType = "TextInput" | "SelectWithFilter" | "ToggleSwitch" | "MultiSelectWithFilter"

export interface Field {
  keyName: string;
  label: string;
  type: FieldType;
  textInputType?: "number" | "time" | "text" | "date" | "datetime-local" | "email" | "month" | "password" | "search" | "tel" | "url" | undefined;
  helperText: string;
  helperTextInvalid: string;
  required: boolean;
  validateFunction: ValidateFunction
  options?: SelectionOption[]
}