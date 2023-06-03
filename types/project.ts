import { ProjectTaskMinResponse } from "./project-task";

export type ProjectStatusKind =
  | "running"
  | "paused"
  | "pending"
  | "breakdown"
  | "finished"
  | "cancelled";
export type ProjectMemberKind = "direct" | "indirect" | "support";

export type Project = {
  _id: string;
  customer_id: string;
  name: string;
  code: string;
  status: ProjectStatus[];
  area?: ProjectArea[];
  member?: ProjectMember[];
  holiday?: Date[];
};
export type ProjectStatus = {
  kind: ProjectStatusKind;
  time: Date;
  message?: string;
};
export type ProjectArea = {
  _id: string;
  name: string;
};
export type ProjectAreaRequest = {
  name: string;
};
export type ProjectAreaResponse = {
  _id: string;
  name: string;
  task?: ProjectTaskMinResponse[]
};
export type ProjectProgressResponse = {
  x: number;
  y: number[];
};
export type ProjectMember = {
  _id: string;
  name: string;
  kind: ProjectMemberKind;
  role_id: string[];
};

export type ProjectResponse = {
  _id: string;
  customer: {
    _id: string;
    name: string;
  };
  name: string;
  code: string;
  status: ProjectStatus[];
  area?: ProjectArea[];
  holiday?: Date[];
};
