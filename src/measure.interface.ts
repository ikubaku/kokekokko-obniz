export interface Measure {
  weight: number;
  datetime: number;
  // "noData": No data is not yet acquired.
  // "ok": The data is available and the last measurement succeeded.
  // "ng": The data is available but the last measurement failed.
  status: string;
}
