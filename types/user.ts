export type User = {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: [];
};

export type UserRequest = {
  name: string;
  email: string;
  password: string;
  role: [];
};