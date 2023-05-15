export interface User {
  _id: string;
  name: String;
  email: String;
  password: String;
  role: [];
}

export interface UserRequest {
  name: String;
  email: String;
  password: String;
  role: [];
}

//Old
