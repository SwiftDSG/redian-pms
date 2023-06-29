import { ProjectMemberResponse } from "./project";

export type ProjectIncidentReportKind =
  | "first_aid"
  | "lost_time_injury"
  | "fatal"
  | "property_damage"
  | "environmental"
  | "near_miss";

export type ProjectIncidentReportRequest = {
  member_id?: string[];
  breakdown: boolean;
  kind: ProjectIncidentReportKind;
};
export type ProjectIncidentReportResponse = {
  _id: string;
  user: ProjectIncidentReportUserResponse;
  project: ProjectIncidentReportProjectResponse;
  date: string;
  kind: ProjectIncidentReportKind;
  member?: ProjectMemberResponse[];
}
export type ProjectIncidentReportUserResponse = {
  _id: string;
  name: string;
}
export type ProjectIncidentReportProjectResponse = {
  _id: string;
  name: string;
}