export type User = {
  _id: string;
  role_id: string[];
  name: string;
  email: string;
  password: string;
  image?: UserImage;
};
export type UserRequest = {
  name: string;
  email: string;
  password: string;
  role_id: [];
};
export type UserImage = {
  _id: string;
  extension: string;
}