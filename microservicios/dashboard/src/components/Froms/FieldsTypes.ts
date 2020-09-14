import { SelectionOption } from "./SelectWithFilter";
import { ValidateFunction } from "./Utils";


type FieldType = "TextInput" | "SelectWithFilter"

export interface Field {
  keyName: string;
  type: FieldType;
  helperText: string;
  helperTextInvalid: string;
  initValue: string;
  required: boolean;
  validateFunction: ValidateFunction
  options?: SelectionOption[]
}