export type RegisterFormState = {
  name: string;
  surname: string;
  username: string;
  email: string;
  password: string;
  passwordConfirmation?: string;
};

export const initialFormState: RegisterFormState = {
  name: "",
  surname: "",
  username: "",
  email: "",
  password: "",
  passwordConfirmation: "",
};