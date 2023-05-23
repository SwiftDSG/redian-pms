export type ProjectTaskStatusKind = 'running' | 'paused' | 'pending' | 'finished';

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
}
export type ProjectTaskPeriod = {
  start: Date;
  end: Date;
}
export type ProjectTaskVolume = {
  value: number;
  unit: string;
}
export type ProjectTaskStatus = {
  kind: ProjectTaskStatusKind;
  time: Date;
  message?: string;
}

export type ProjectTaskRequest = {
  area_id?: string;
  user_id?: string[];
  name: string;
  description?: string;
  volume?: ProjectTaskVolume;
  value: number;
}