import { UserRecord } from "./general";

export type Customer = {
  _id: string;
  name: string;
  contact: CustomerPerson[];
  person: CustomerContact[];
};

export type CustomerContact = {
  address: string;
  email?: string;
  phone?: string;
};
export type CustomerPerson = {
  name: String;
  address: String;
  phone: String;
  email: String;
  role: String;
};
export type CustomerRequest = {
  // _id: string;
  name: string;
  contact: CustomerContact;
  person: CustomerPerson[];
};
// Old
export type CustomerNote = {
  title: string;
  message: string;
  user?: UserRecord;
};

export type CustomerMin = {
  _id: string;
  name: string;
};
