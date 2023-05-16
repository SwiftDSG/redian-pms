import { UserRecord } from "./general";

export interface Customer {
  _id: string;
  name: string;
  contact: CustomerPerson[];
  person: CustomerContact[];
}

export interface CustomerContact {
  address: string;
  email?: string;
  phone?: string;
}
export interface CustomerPerson {
  name: String;
  address: String;
  phone: String;
  email: String;
  role: String;
}
export interface CustomerRequest {
  // _id: string;
  name: string;
  contact: CustomerContact;
  person: CustomerPerson[];
}
// Old
export interface CustomerNote {
  title: string;
  message: string;
  user?: UserRecord;
}

export interface CustomerMin {
  _id: string;
  name: string;
}
