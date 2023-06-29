import { ProjectMemberResponse } from "./project";

export type ProjectProgressReportWeatherKind =
  | "sunny"
  | "cloudy"
  | "rainy"
  | "snowy";

export type ProjectProgressReportRequest = {
  member_id?: string[];
  time?: [[number, number], [number, number]];
  actual?: ProjectProgressReportActual[];
  plan?: ProjectProgressReportPlan;
  weather?: ProjectProgressReportWeather;
  documentation?: ProjectProgressReportDocumentation;
};

export type ProjectProgressReportActual = {
  task_id: string;
  value: number;
};
export type ProjectProgressReportPlan = {
  task_id: string;
};
export type ProjectProgressReportWeather = {
  time: number;
  kind: ProjectProgressReportWeatherKind;
};
export type ProjectProgressReportDocumentation = {
  _id?: string;
  description?: string;
  extension?: string;
};
export type ProjectProgressReportResponse = {
  _id: string;
  user: ProjectProgressReportUserResponse;
  project: ProjectProgressReportProjectResponse;
  date: string;
  time?: [[number, number], [number, number]];
  member?: ProjectMemberResponse[];
  actual?: ProjectProgressReportActual[];
  plan?: ProjectProgressReportPlan[];
  weather?: ProjectProgressReportWeather[];
  documentation?: ProjectProgressReportDocumentation[];
  progress: number;
}
export type ProjectProgressReportUserResponse = {
  _id: string;
  name: string;
}
export type ProjectProgressReportProjectResponse = {
  _id: string;
  name: string;
}