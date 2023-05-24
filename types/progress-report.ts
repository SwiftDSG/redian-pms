export type ProjectProgressReportWeatherKind =
  | "Sunny"
  | "Cloudy"
  | "Rainy"
  | "Snowy";

export type ProjectProgressReportRequest = {
  time: number;
  actual?: ProjectProgressReportActual;
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
