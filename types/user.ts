import { RoleResponse } from "./role";

export type User = {
  _id: string;
  role: RoleResponse[];
  name: string;
  email: string;
  password: string;
  image?: UserImage;
};
export type UserResponse = {
  _id: string;
  role: RoleResponse[];
  name: string;
  email: string;
  image?: UserImage;
};
export type UserRequest = {
  name: string;
  email: string;
  password: string;
  role_id?: string[];
  image?: UserImageRequest;
  image_photo?: File;
};
export type UserImageRequest = {
  extension: string;
};
export type UserImage = {
  _id: string;
  extension: string;
}