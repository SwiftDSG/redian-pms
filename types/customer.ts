export type Customer = {
  _id: string;
  name: string;
  field: string;
  contact: CustomerContact;
  person: CustomerPerson[];
  image?: CustomerImage,
};
export type CustomerContact = {
  address: string;
  email?: string;
  phone?: string;
};
export type CustomerPerson = {
  name: String;
  address?: String;
  phone?: String;
  email?: String;
  role: String;
};
export type CustomerImage = {
  _id: string,
  extension: string,
}
export type CustomerRequest = {
  name: string;
  field: string;
  contact: CustomerContact;
  person: CustomerPerson[];
  image?: CustomerImageRequest;
  image_photo?: File;
};
export type CustomerImageRequest = {
  extension: string;
};
export type CustomerMin = {
  _id: string;
  name: string;
};
