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
  address?: String;
  phone?: String;
  email?: String;
  role: String;
};
export type CustomerRequest = {
  name: string;
  contact: CustomerContact;
  person: CustomerPerson[];
};
export type CustomerMin = {
  _id: string;
  name: string;
};
