export interface InputGroupType {
  id: string;
  label: string;
  inputType: string;
  registerName: string;
  register: any;
  placeholder: string;
  errorMessage?: string;
  min?: string;
}

export interface ToggleInputType extends InputGroupType {
  currentState: boolean;
}
