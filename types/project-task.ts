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
  user?: {
    _id: string;
    name: string;
    image_url?: string;
  }[];
  task?: {
    _id: string;
    name: string;
  }[];
  name: string;
  period?: ProjectTaskPeriodResponse;
  actual?: ProjectTaskPeriodResponse;
  status: ProjectTaskStatus[];
  volume?: ProjectTaskVolume;
  value: number;
  progress: number;
};