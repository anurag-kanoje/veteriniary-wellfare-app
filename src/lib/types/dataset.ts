export interface DatasetEntry {
  id: string;
  title: string;
  symptoms: string[];
  diagnosis: string;
  treatment: string;
  prevention: string;
}

export interface Dataset {
  id: string;
  name: string;
  source: string;
  entries: DatasetEntry[];
}