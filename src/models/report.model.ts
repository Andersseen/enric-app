export interface Report {
  id: string;
  filename: string;
  type: 'actuacion' | 'trampa' | 'prevencion';
  createdAt: Date;
  fileUri: string;
  fileSize: number;
  metadata?: {
    zone?: string;
    species?: string;
    count?: number;
    [key: string]: any;
  };
}

export type ReportType = Report['type'];

export interface ReportFilter {
  type?: ReportType;
  startDate?: Date;
  endDate?: Date;
  searchTerm?: string;
}
