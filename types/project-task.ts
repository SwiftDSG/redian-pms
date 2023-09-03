import { UserImage } from "./user";

export type ProjectTaskStatusKind =
  | "running"
  | "paused"
  | "pending"
  | "finished";

export type ProjectTask = {
  _id: string;
  project_id: string;
  area_id: string;
  task_id?: string;
  user_id?: string[];
  name: string;
  description?: string;
  period?: ProjectTaskPeriod;
  status: ProjectTaskStatus[];
  volume?: ProjectTaskVolume;
  value: number;
};
export type ProjectTaskPeriod = {
  start: Date;
  end: Date;
};
export type ProjectTaskVolume = {
  value: number;
  unit: string;
};
export type ProjectTaskStatus = {
  kind: ProjectTaskStatusKind;
  time: Date;
  message?: string;
};

export type ProjectTaskRequest = {
  area_id?: string;
  user_id?: string[];
  name: string;
  description?: string;
  volume?: ProjectTaskVolume;
  value: number;
};
export type ProjectTaskPeriodRequest = {
  start: number;
  end: number;
};

export type ProjectTaskPeriodResponse = {
  start: string;
  end: string;
};

export type ProjectTaskMinResponse = {
  _id: string;
  area_id: string;
  user?: ProjectTaskUserResponse[];
  task?: ProjectTaskTaskResponse[];
  name: string;
  description?: string;
  period?: ProjectTaskPeriodResponse;
  actual?: ProjectTaskPeriodResponse;
  status: ProjectTaskStatus[];
  volume?: ProjectTaskVolume;
  value: number;
  progress: number;
};
export type ProjectTaskResponse = {
  _id: string;
  project: {
    _id: string;
    name: string;
  };
  area: {
    _id: string;
    name: string;
  };
  user?: ProjectTaskUserResponse[];
  task?: ProjectTaskMinResponse[];
  name: string;
  description?: string;
  period?: ProjectTaskPeriodResponse;
  actual?: ProjectTaskPeriodResponse;
  status: ProjectTaskStatus[];
  volume?: ProjectTaskVolume;
  value: number;
  progress: number;
};
export type ProjectTaskTaskResponse = {
  _id: string;
  name: string;
  period?: ProjectTaskPeriodResponse;
  status: ProjectTaskStatus[];
  volume?: ProjectTaskVolume;
};
export type ProjectTaskUserResponse = {
  _id: string;
  name: string;
  image?: UserImage;
};
