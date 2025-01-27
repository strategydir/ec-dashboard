export const keyMapping = {
  Process: "projectType",
  กระบวนการ: "processStatus",
  ประเภทการพิจารณา: "considerType",
  ปี: "year",
  รหัสโครงการ: "id",
  สถานะ: "status",
} as const;

export interface ITransformedData {
  id: number;
  projectType: string;
  processStatus: string;
  considerType: string;
  year: number;
  status: string;
}

export interface IRawData {
  Process: string;
  กระบวนการ: string;
  ประเภทการพิจารณา: string;
  ปี: number;
  รหัสโครงการ: number;
  สถานะ: string;
}
