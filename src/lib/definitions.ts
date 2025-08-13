export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type RawTankEntry = {
  tanknumber: string;
  tanklevel: number;
  waterbottom: number;
};

export type TankLevelChartEntry = {
  tankID: string;
  water: number;
  oil: number;
};

export type RawStorageEntry = {
  grossstock: number;
  grossreceipt: number;
  currentnet: number;
  pumpedbarge: number;
  pumpedwrpc: number;
  pumpedgrossforcados: number;
  pumpednetforcados: number;
  totalpumped: number;
  oml26gross: number;
  oml34gross: number;
  midwesterngross: number;
  endurancedays: number;
  recieptrate: number;
  availuilage: number;
  datecreated: string;
};

type GasProductionEntry = {
  gasprodid: number;
  gasprodnid: number;
  fieldnid: number;
  gasproddate: string; // Format: "/Date(1738537200000)/"
  gaslift: number;
  flaredgas: number;
  fuelgas: number;
  gasproduced: number;
  comments: string | null;
  datecreated: string | null;
  createdby: string | null;
  dateedited: string | null;
  editedby: string | null;
  fieldname: string;
  blockfield: number;
};

export type GasProductionResponse = GasProductionEntry[];


export interface StorageSummary {
  enduranceDays: number | string;
  availullage: number;
}


export type ChartDataEntry = { date: string; net: number };

export type LocationEntry = {
  location: string;
  entry: { date: string; value: number } | null;
  target: number;
};

export type RawDataEntry = {
  produceyear: number;
  dailyprdid: number;
  dailyprdnid: number;
  fieldnid: number;
  grosstarget: number;
  grossactual: number;
  nettarget: number;
  netactual: number;
  water: number;
  downtime: number;
  uptime: number;
  uptimeReasonID: number;
  bswpercent: number;
  deferment: number;
  stringsup: number;
  chemical: number;
  average: number;
  producedate: string;
  remarks: string;
  datecreated: string;
  createdby: string;
  dateedited: string;
  editedby: string;
  createduser: string;
  allocation: number;
  grossactualraw: number;
  stringsTotal: number;
  stringsDown: number;
  omlnid: number;
  oml: string;
  fieldname: string;
  blockfield: number;
  area: string;
  stringcnt: number;
  produceMonth: string;
  netactualAllocation: number;
};

export type TransformedEntry = {
  date: string; // in YYYY-MM-DD
  stringsTotal: number;
  stringsUp: number;
  gross: number;
  net: number;
  bsw: number;
};

export type OutputFormat = {
  [fieldname: string]: TransformedEntry[];
};

type xEntry = {
  date: string; // "YYYY-MM-DD"
  stringsUp: number;
  gross: number;
  net: number;
  bsw: number;
};

export type xProductionData = {
  [fieldname: string]: xEntry[];
};

export type xTotals = {
  totalGrossForDay: number;
  totalNetForDay: number;
  cumulativeNetUpToDate: number;
};

export interface StaticCardData {
  naturalGas: number;
  brent: number;
  tfpIncidentsYTD: { mechanical: number; tpi: number };
  rotatingEquipmentAvailability: number;
  daysSinceLastLTI: number | null;
}