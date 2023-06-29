import { ProjectIncidentReportResponse } from "./project-incident";
import { ProjectProgressReportResponse } from "./project-report";
import { ProjectRoleResponse } from "./project-role";
import { ProjectTaskMinResponse } from "./project-task";
import { UserImage } from "./user";

export type ProjectStatusKind =
  | "running"
  | "paused"
  | "pending"
  | "breakdown"
  | "finished"
  | "cancelled";
export type ProjectMemberKind = "direct" | "indirect" | "support";
export type ProjectReportKind = "progress" | "incident";

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
export type ProjectMemberRequest = {
  _id?: string;
  name?: string;
  kind: ProjectMemberKind;
  role_id: string[];
};

export type ProjectRequest = {
  customer_id: string;
  name: string;
  code: string;
  period: {
    start: number,
    end: number
  }
};
export type ProjectResponse = {
  _id: string;
  customer: {
    _id: string;
    name: string;
  };
  name: string;
  code: string;
  period: {
    start: string;
    end: string;
  };
  status: ProjectStatus[];
  area?: ProjectArea[];
  leave?: Date[];
};
export type ProjectMinResponse = {
  _id: string;
  customer: {
    _id: string;
    name: string;
  };
  user?: {
    _id: string;
    name: string;
  };
  name: string;
  code: string;
  period: {
    start: string;
    end: string;
  };
  status: ProjectStatus[];
  progress: {
    plan: number;
    actual: number;
  };
};
export type ProjectMemberResponse = {
  _id: string;
  name: string;
  kind: ProjectMemberKind;
  role: ProjectRoleResponse[];
  image?: UserImage;
}
export type ProjectUserResponse = {
  user: ProjectMemberResponse[];
  role: ProjectRoleResponse[];
}
export type ProjectReportResponse = {
  date: string;
  kind: ProjectReportKind;
  progress?: ProjectProgressReportResponse;
  incident?: ProjectIncidentReportResponse;
}
