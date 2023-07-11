export type Company = {
  _id: string;
  name: string;
  field: string;
  contact: CompanyContact;
  image?: CompanyImage,
};
export type CompanyContact = {
  address: string;
  email?: string;
  phone?: string;
};
export type CompanyImage = {
  _id: string,
  extension: string,
}
export type CompanyRequest = {
  name: string;
  field: string;
  contact: CompanyContact;
  image?: CompanyImageRequest;
  image_photo?: File;
};
export type CompanyImageRequest = {
  extension: string;
};
