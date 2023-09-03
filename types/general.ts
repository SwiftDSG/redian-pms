export type View = "desktop" | "mobile" | null;

export type Address = {
  _id?: string;
  name?: string;
  type?: string;
  city: string;
  country?: string;
  state: string;
  line_1: string;
  line_2: string;
  country_code: string;
  postal_code: string;
  contact: {
    name: string;
    phone?: string;
    email?: string;
  };
};

export type InputSwitchOption = {
  options: [string, string] | string[];
  model: string;
  disabled?: boolean;
};
export type InputColorOption = {
  color: string;
  alpha: number;
};
export type InputToggleOption = {
  model: boolean;
  disabled?: boolean;
};
export type InputFileOption = {
  file?: File;
  type?: "any" | "image";
  disabled?: boolean;
  label?: string;
  image_url?: string;
  width?: number;
  height?: number;
};
export type InputImageOption = {
  label: string;
  limit: number;
  file: File[];
};
export type InputOption = {
  name: string;
  placeholder: string;
  model: string;
  prefix?: string;
  icon?: string;
  color?: string;
  value?: string;
  label?: string;
  error?: string;
  type?: "email" | "password" | "tel" | "number" | "hour" | "minute";
  disabled?: boolean;
  options?: (
    | string
    | {
        name: string;
        value: string;
      }
  )[];
};
export type InputDateOption = {
  name?: string;
  placeholder?: string;
  model: string;
  value?: string;
  icon?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  threshold?: Date | [Date, Date];
  available?: number[];
};
export type InputTimeOption = {
  model: [number, number];
  label?: string;
};
export type InputCodeOption = {
  name: string;
  length: number;
  model: string;
  disabled?: boolean;
};
export type InputSearchOption = {
  name: string;
  placeholder: string;
  model: string;
};
export type InputGeneric<T> = {
  name: string;
  placeholder: string;
  model: string;
  value?: T;
  icon?: string;
  label?: string;
  error?: string;
  type?: "email" | "password" | "tel" | "number";
  disabled?: boolean;
  options?: (
    | string
    | {
        name: string;
        value: T;
      }
  )[];
};
