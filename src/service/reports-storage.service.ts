import { Injectable } from '@angular/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';
import { Report, ReportFilter } from '../models/report.model';

const REPORTS_STORAGE_KEY = 'enric_reports';
const REPORTS_DIR = 'reports';

@Injectable({
  providedIn: 'root',
})
export class ReportsStorageService {
  /**
   * Check if running on native platform
   */
  isNative(): boolean {
    return Capacitor.isNativePlatform();
  }

  /**
   * Save a report file and register it in the database
   */
  async saveReport(
    buffer: ArrayBuffer,
    filename: string,
    type: Report['type'],
    metadata?: Report['metadata'],
  ): Promise<Report> {
    if (!this.isNative()) {
      throw new Error('File storage only available on native platforms');
    }

    // Convert ArrayBuffer to base64
    const base64Data = this.arrayBufferToBase64(buffer);

    // Save file to device
    const result = await Filesystem.writeFile({
      path: `${REPORTS_DIR}/${filename}`,
      data: base64Data,
      directory: Directory.Documents,
      recursive: true,
    });

    // Create report record
    const report: Report = {
      id: this.generateId(),
      filename,
      type,
      createdAt: new Date(),
      fileUri: result.uri,
      fileSize: buffer.byteLength,
      metadata,
    };

    // Save to database
    await this.addReportToDatabase(report);

    return report;
  }

  /**
   * Get all reports from database
   */
  async getReports(): Promise<Report[]> {
    const reportsJson = localStorage.getItem(REPORTS_STORAGE_KEY);
    if (!reportsJson) {
      return [];
    }

    const reports: Report[] = JSON.parse(reportsJson);
    // Convert date strings back to Date objects
    return reports.map((r) => ({
      ...r,
      createdAt: new Date(r.createdAt),
    }));
  }

  /**
   * Filter reports based on criteria
   */
  async filterReports(filter: ReportFilter): Promise<Report[]> {
    let reports = await this.getReports();

    if (filter.type) {
      reports = reports.filter((r) => r.type === filter.type);
    }

    if (filter.startDate) {
      reports = reports.filter((r) => r.createdAt >= filter.startDate!);
    }

    if (filter.endDate) {
      reports = reports.filter((r) => r.createdAt <= filter.endDate!);
    }

    if (filter.searchTerm) {
      const term = filter.searchTerm.toLowerCase();
      reports = reports.filter(
        (r) =>
          r.filename.toLowerCase().includes(term) ||
          r.metadata?.zone?.toLowerCase().includes(term) ||
          r.metadata?.species?.toLowerCase().includes(term),
      );
    }

    return reports;
  }

  /**
   * Delete a report file and remove from database
   */
  async deleteReport(reportId: string): Promise<void> {
    const reports = await this.getReports();
    const report = reports.find((r) => r.id === reportId);

    if (!report) {
      throw new Error('Report not found');
    }

    // Delete file from device
    if (this.isNative()) {
      try {
        await Filesystem.deleteFile({
          path: `${REPORTS_DIR}/${report.filename}`,
          directory: Directory.Documents,
        });
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }

    // Remove from database
    const updatedReports = reports.filter((r) => r.id !== reportId);
    localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(updatedReports));
  }

  /**
   * Share a report file
   */
  async shareReport(reportId: string): Promise<void> {
    const reports = await this.getReports();
    const report = reports.find((r) => r.id === reportId);

    if (!report) {
      throw new Error('Report not found');
    }

    if (!this.isNative()) {
      throw new Error('Share only available on native platforms');
    }

    await Share.share({
      title: report.filename,
      text: `Reporte: ${report.filename}`,
      url: report.fileUri,
      dialogTitle: 'Compartir reporte',
    });
  }

  /**
   * Open a report file with system default app
   */
  async openReport(reportId: string): Promise<void> {
    const reports = await this.getReports();
    const report = reports.find((r) => r.id === reportId);

    if (!report) {
      throw new Error('Report not found');
    }

    if (!this.isNative()) {
      throw new Error('Open file only available on native platforms');
    }

    // For now, use Share API which allows "Open in..." on both platforms
    // This is more reliable than trying to open files directly
    await Share.share({
      title: report.filename,
      text: `Abrir ${report.filename}`,
      url: report.fileUri,
      dialogTitle: 'Abrir con...',
    });
  }

  /**
   * Get report by ID
   */
  async getReportById(reportId: string): Promise<Report | null> {
    const reports = await this.getReports();
    return reports.find((r) => r.id === reportId) || null;
  }

  /**
   * Get reports count by type
   */
  async getReportsCountByType(): Promise<Record<Report['type'], number>> {
    const reports = await this.getReports();
    return {
      actuacion: reports.filter((r) => r.type === 'actuacion').length,
      trampa: reports.filter((r) => r.type === 'trampa').length,
      prevencion: reports.filter((r) => r.type === 'prevencion').length,
    };
  }

  /**
   * Private: Add report to database
   */
  private async addReportToDatabase(report: Report): Promise<void> {
    const reports = await this.getReports();
    reports.push(report);
    localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
  }

  /**
   * Private: Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Private: Convert ArrayBuffer to base64
   */
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
}
