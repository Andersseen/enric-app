export interface Report {
  id: string;
  filename: string;
  type: 'actuacion' | 'trampa' | 'prevencion';
  createdAt: Date;
  fileUri: string;
  fileSize: number;
  metadata?: {
    // Report-specific data
    zone?: string;
    species?: string;
    count?: number;
    // Session data
    worker?: string;
    date?: string;
    time?: string;
    weather?: string;
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
