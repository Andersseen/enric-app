import { Injectable, inject } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular/standalone';
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Report, ReportFilter } from '../models/report.model';

const REPORTS_STORAGE_KEY = 'enric_reports';
const REPORTS_DIR = 'reports';

@Injectable({
  providedIn: 'root',
})
export class ReportsStorageService {
  private toastController = inject(ToastController);
  private alertController = inject(AlertController);

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
    const base64Data = await this.arrayBufferToBase64(buffer);

    let result;
    let finalDirectory = Directory.Documents;
    let savePath = `${REPORTS_DIR}/${filename}`;

    // TIER 1: Documents (Preferred)
    try {
      // Create 'reports' directory if it doesn't exist (recursive handles it usually, but good to be safe)
      // Attempt save
      result = await Filesystem.writeFile({
        path: savePath,
        data: base64Data,
        directory: Directory.Documents,
        recursive: true,
      });

      finalDirectory = Directory.Documents;
      await this.showToast('Guardado correctamente en Documentos', 'success');
      await this.presentSuccessAlert(filename, 'Documentos/reports', finalDirectory);
    } catch (docError) {
      console.warn('Tier 1 (Documents) failed:', docError);

      // TIER 2: External (App Specific - No Permissions needed usually)
      try {
        finalDirectory = Directory.External;
        // On Android 11+: Android/data/com.package/files/reports
        result = await Filesystem.writeFile({
          path: savePath,
          data: base64Data,
          directory: Directory.External,
          recursive: true,
        });

        await this.showToast('Guardado en carpeta de la App (Android/data)', 'medium');
        await this.presentSuccessAlert(filename, 'Android/data/.../reports', finalDirectory);
      } catch (extError) {
        console.warn('Tier 2 (External) failed:', extError);

        // TIER 3: Cache (Temporary)
        try {
          finalDirectory = Directory.Cache;
          result = await Filesystem.writeFile({
            path: savePath,
            data: base64Data,
            directory: Directory.Cache,
            recursive: true,
          });

          await this.showToast('Guardado temporalmente (Cache)', 'warning');
          // Auto-share because it's temporary
          await this.shareReportFile(filename, finalDirectory);
        } catch (cacheError) {
          console.error('Tier 3 (Cache) failed:', cacheError);
          throw new Error('No se pudo guardar el archivo en ninguna ubicación.');
        }
      }
    }

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
        // Try deleting from Documents
        try {
          await Filesystem.deleteFile({
            path: `${REPORTS_DIR}/${report.filename}`,
            directory: Directory.Documents,
          });
        } catch (e) {
          // Ignore if not found in Documents
        }

        // Try deleting from Cache
        try {
          await Filesystem.deleteFile({
            path: `${REPORTS_DIR}/${report.filename}`,
            directory: Directory.Cache,
          });
        } catch (e) {
          // Ignore if not found in Cache
        }
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
   * Private: Convert ArrayBuffer to base64 using FileReader
   * This is more efficient and prevents UI freezing for large files
   */
  private arrayBufferToBase64(buffer: ArrayBuffer): Promise<string> {
    return new Promise((resolve, reject) => {
      const blob = new Blob([buffer], { type: 'application/octet-stream' });
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        // remove "data:application/octet-stream;base64,"
        const base64 = dataUrl.split(',')[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Helpers
   */
  private async presentSuccessAlert(filename: string, path: string, directory: Directory) {
    const alert = await this.alertController.create({
      header: 'Archivo Guardado',
      message: `El archivo ${filename} se ha guardado en: \n\n${path}\n\n¿Quieres abrirlo o compartirlo?`,
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel',
        },
        {
          text: 'Compartir / Abrir',
          handler: () => {
            this.shareReportFile(filename, directory);
          },
        },
      ],
    });
    await alert.present();
  }

  private async shareReportFile(filename: string, directory: Directory) {
    const uriResult = await Filesystem.getUri({
      path: `${REPORTS_DIR}/${filename}`,
      directory: directory,
    });

    await Share.share({
      title: 'Compartir Reporte',
      text: `Reporte: ${filename}`,
      url: uriResult.uri,
      dialogTitle: 'Abrir con...',
    });
  }

  /**
   * Private: Show toast message
   */
  private async showToast(message: string, color: 'success' | 'warning' | 'danger' | 'medium') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'bottom',
    });
    await toast.present();
  }
}
