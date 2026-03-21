import { Injectable, inject } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { ReportsStorageService } from './reports-storage.service';
import Session from './session';

export interface ActuacionData {
  zoneId: string;
  speciesId: string;
  count: number;
  behavior: string;
  actionType: string;
  interaction: string;
  method: string;
  animal: string;
  efficacy: string;
  captured: number;
  notes: string;
  operation?: string;
  date?: string;
  time?: string;
  weather?: string;
  worker?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  private reportsStorage = inject(ReportsStorageService);
  private session = inject(Session);
  /**
   * Creates a header row with dark green background and white text (matching reference Excel)
   */
  private createHeaderRow(worksheet: ExcelJS.Worksheet, headers: string[]): void {
    const headerRow = worksheet.addRow(headers);
    headerRow.height = 30;
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'D9D9D9' }, // Light grey background
      };
      cell.font = {
        name: 'Arial',
        size: 10,
        bold: true,
        color: { argb: '000000' }, // Black text
      };
      cell.border = {
        top: { style: 'thin', color: { argb: '000000' } },
        left: { style: 'thin', color: { argb: '000000' } },
        bottom: { style: 'thin', color: { argb: '000000' } },
        right: { style: 'thin', color: { argb: '000000' } },
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true,
      };
    });
  }

  /**
   * Adds a data row with borders (matching reference Excel)
   */
  private addDataRow(worksheet: ExcelJS.Worksheet, data: any[]): void {
    const dataRow = worksheet.addRow(data);
    dataRow.height = 20;
    dataRow.eachCell((cell) => {
      cell.font = {
        name: 'Arial',
        size: 9,
      };
      cell.border = {
        top: { style: 'thin', color: { argb: '000000' } },
        left: { style: 'thin', color: { argb: '000000' } },
        bottom: { style: 'thin', color: { argb: '000000' } },
        right: { style: 'thin', color: { argb: '000000' } },
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true,
      };
    });
  }

  async generateActuacionExcel(data: ActuacionData, filename?: string): Promise<void> {
    // Get current session data
    const sessionData = this.session.sessionForm.value;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Actuación');

    this.createHeaderRow(worksheet, [
      'Fecha',
      'Climatología',
      'Personal',
      'Hora',
      'Localización',
      'Especie',
      'Nº',
      'Actitud',
      'Tipo actuación',
      'Operación',
      'Interacción operación',
      'Método empleado',
      'Animal empleado',
      'Eficacia',
      'Captura (Nº indiv)',
      'Observaciones',
    ]);

    this.addDataRow(worksheet, [
      sessionData.date || new Date().toLocaleDateString('es-ES'), // Fecha
      sessionData.weather || '', // Climatología
      sessionData.worker || '', // Personal
      sessionData.time ||
        new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }), // Hora
      data.zoneId || '', // Localización
      data.speciesId || '', // Especie
      data.count || 0, // Nº
      data.behavior || '', // Actitud
      data.actionType || '', // Tipo actuación
      data.operation || '', // Operación
      data.interaction || '', // Interacción perro/halcón
      data.method || '', // Método empleado
      data.animal || '', // Animal empleado
      data.efficacy || '', // Eficacia
      data.captured || 0, // Captura Efectiva
      data.notes || '', // Observaciones
    ]);

    // Column widths (matching reference Excel)
    worksheet.columns = [
      { width: 10 }, // Fecha
      { width: 12 }, // Crimológico
      { width: 10 }, // Personal
      { width: 8 }, // Hora
      { width: 14 }, // Localización
      { width: 16 }, // Especie
      { width: 6 }, // Nº
      { width: 14 }, // Actitud
      { width: 14 }, // Tipo actuación
      { width: 12 }, // Operación
      { width: 18 }, // Interacción perro/halcón
      { width: 16 }, // Método empleado
      { width: 16 }, // Animal empleado
      { width: 10 }, // Eficacia
      { width: 14 }, // Captura Efectiva
      { width: 30 }, // Observaciones
    ];

    // Generate filename: actuacion_2026-02-01_18-30.xlsx
    const dateStr = (sessionData.date || new Date().toISOString().split('T')[0]).replace(
      /\//g,
      '-',
    );
    const timeStr = (sessionData.time || new Date().toTimeString().slice(0, 5)).replace(':', '-');
    const generatedFilename = `actuacion_${dateStr}_${timeStr}.xlsx`;

    // Save with metadata including session data
    await this.saveWorkbook(workbook, generatedFilename, 'actuacion', {
      zone: data.zoneId,
      species: data.speciesId,
      count: data.count,
      worker: sessionData.worker || undefined,
      date: sessionData.date || undefined,
      time: sessionData.time || undefined,
      weather: sessionData.weather || undefined,
    });
  }

  /**
   * Generates an Excel file for "Trampas"
   */
  async generateTrampaExcel(data: ActuacionData, filename?: string): Promise<void> {
    const sessionData = this.session.sessionForm.value;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Trampa');

    this.createHeaderRow(worksheet, [
      'Fecha',
      'Climatología',
      'Personal',
      'Hora',
      'Localización',
      'Especie',
      'Nº',
      'Actitud',
      'Tipo actuación',
      'Operación',
      'Interacción operación',
      'Método empleado',
      'Animal empleado',
      'Eficacia',
      'Captura (Nº indiv)',
      'Observaciones',
    ]);

    this.addDataRow(worksheet, [
      sessionData.date || new Date().toLocaleDateString('es-ES'),
      sessionData.weather || '',
      sessionData.worker || '',
      sessionData.time ||
        new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      data.zoneId || '',
      data.speciesId || '',
      data.count || 0,
      data.behavior || '',
      data.actionType || '',
      data.operation || '',
      data.interaction || '',
      data.method || '',
      data.animal || '',
      data.efficacy || '',
      data.captured || 0,
      data.notes || '',
    ]);

    worksheet.columns = [
      { width: 10 },
      { width: 12 },
      { width: 10 },
      { width: 8 },
      { width: 14 },
      { width: 16 },
      { width: 6 },
      { width: 14 },
      { width: 14 },
      { width: 12 },
      { width: 18 },
      { width: 16 },
      { width: 16 },
      { width: 10 },
      { width: 14 },
      { width: 30 },
    ];

    const dateStr = (sessionData.date || new Date().toISOString().split('T')[0]).replace(
      /\//g,
      '-',
    );
    const timeStr = (sessionData.time || new Date().toTimeString().slice(0, 5)).replace(':', '-');
    const generatedFilename = filename || `trampas_${dateStr}_${timeStr}.xlsx`;

    await this.saveWorkbook(workbook, generatedFilename, 'trampa', {
      zone: data.zoneId,
      species: data.speciesId,
      count: data.count,
      worker: sessionData.worker || undefined,
      date: sessionData.date || undefined,
      time: sessionData.time || undefined,
      weather: sessionData.weather || undefined,
    });
  }

  /**
   * Generates an Excel file for "Prevención"
   */
  async generatePrevencionExcel(data: ActuacionData, filename?: string): Promise<void> {
    const sessionData = this.session.sessionForm.value;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Prevención');

    this.createHeaderRow(worksheet, [
      'Fecha',
      'Climatología',
      'Personal',
      'Hora',
      'Localización',
      'Especie',
      'Nº',
      'Actitud',
      'Tipo actuación',
      'Operación',
      'Interacción operación',
      'Método empleado',
      'Animal empleado',
      'Eficacia',
      'Captura (Nº indiv)',
      'Observaciones',
    ]);

    this.addDataRow(worksheet, [
      sessionData.date || new Date().toLocaleDateString('es-ES'),
      sessionData.weather || '',
      sessionData.worker || '',
      sessionData.time ||
        new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      data.zoneId || '',
      data.speciesId || '',
      data.count || 0,
      data.behavior || '',
      data.actionType || '',
      data.operation || '',
      data.interaction || '',
      data.method || '',
      data.animal || '',
      data.efficacy || '',
      data.captured || 0,
      data.notes || '',
    ]);

    worksheet.columns = [
      { width: 10 },
      { width: 12 },
      { width: 10 },
      { width: 8 },
      { width: 14 },
      { width: 16 },
      { width: 6 },
      { width: 14 },
      { width: 14 },
      { width: 12 },
      { width: 18 },
      { width: 16 },
      { width: 16 },
      { width: 10 },
      { width: 14 },
      { width: 30 },
    ];

    const dateStr = (sessionData.date || new Date().toISOString().split('T')[0]).replace(
      /\//g,
      '-',
    );
    const timeStr = (sessionData.time || new Date().toTimeString().slice(0, 5)).replace(':', '-');
    const generatedFilename = filename || `prevencion_${dateStr}_${timeStr}.xlsx`;

    await this.saveWorkbook(workbook, generatedFilename, 'prevencion', {
      zone: data.zoneId,
      species: data.speciesId,
      count: data.count,
      worker: sessionData.worker || undefined,
      date: sessionData.date || undefined,
      time: sessionData.time || undefined,
      weather: sessionData.weather || undefined,
    });
  }

  /**
   * Generic method to create a custom Excel with full control
   */
  async generateCustomExcel(
    sheetName: string,
    headers: string[],
    dataRows: any[][],
    columnWidths: number[],
    filename: string,
    reportType: 'actuacion' | 'trampa' | 'prevencion' = 'actuacion',
    metadata?: any,
  ): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    // Headers
    this.createHeaderRow(worksheet, headers);

    // Data Rows
    dataRows.forEach((rowData) => {
      this.addDataRow(worksheet, rowData);
    });

    // Column widths
    worksheet.columns = columnWidths.map((width) => ({ width }));

    // Save
    await this.saveWorkbook(workbook, filename, reportType, metadata);
  }

  /**
   * Import Actuacion Excel file and return rows as ActuacionData
   */
  async importActuacionExcel(file: File): Promise<ActuacionData[]> {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);

    const worksheet = workbook.getWorksheet('Actuación');
    if (!worksheet) {
      throw new Error('No valid "Actuación" sheet found in file');
    }

    const rows: ActuacionData[] = [];

    // Assuming headers are in row 2 (based on createHeaderRow being called after assignment section?)
    // But createHeaderRow puts headers in a new row. Logic:
    // createActuacionExcel adds headers at row 1 (since no assignment section in that method).
    // Let's assume headers are at row 1 for now, as per generateActuacionExcel structure.

    worksheet.eachRow((row, rowNumber) => {
      // Skip header row
      if (rowNumber === 1) return;

      const values = row.values as any[];
      // ExcelJS values array is 1-based, so index 1 is column A.
      // Columns:
      // 1: Fecha, 2: Climatología, 3: Personal, 4: Hora, 5: Localización (Zone)
      // 6: Especie, 7: Nº, 8: Actitud, 9: Tipo actuación, 10: Operación
      // 11: Interacción, 12: Método, 13: Animal, 14: Eficacia, 15: Captura, 16: Observaciones

      // Helper to safely get string
      const getVal = (idx: number) => {
        const val = values[idx];
        return val ? String(val) : '';
      };

      const data: ActuacionData = {
        date: getVal(1),
        weather: getVal(2),
        worker: getVal(3),
        time: getVal(4),
        zoneId: getVal(5),
        speciesId: getVal(6),
        count: Number(values[7]) || 0,
        behavior: getVal(8),
        actionType: getVal(9),
        operation: getVal(10), // Operation
        interaction: getVal(11),
        method: getVal(12),
        animal: getVal(13),
        efficacy: getVal(14),
        captured: Number(values[15]) || 0,
        notes: getVal(16),
      };

      rows.push(data);
    });

    return rows;
  }

  /**
   * Export multiple ActuacionData rows to a single Excel file
   */
  async exportGlobalExcel(
    data: ActuacionData[],
    filename: string = 'reporte_global.xlsx',
  ): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Actuación');

    this.createHeaderRow(worksheet, [
      'Fecha',
      'Climatología',
      'Personal',
      'Hora',
      'Localización',
      'Especie',
      'Nº',
      'Actitud',
      'Tipo actuación',
      'Operación',
      'Interacción operación',
      'Método empleado',
      'Animal empleado',
      'Eficacia',
      'Captura (Nº indiv)',
      'Observaciones',
    ]);

    const sessionData = this.session.sessionForm.value;

    data.forEach((row) => {
      this.addDataRow(worksheet, [
        row.date || sessionData.date || new Date().toLocaleDateString('es-ES'), // Fallback to session
        row.weather || sessionData.weather || '',
        row.worker || sessionData.worker || '',
        row.time ||
          sessionData.time ||
          new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        row.zoneId || '',
        row.speciesId || '',
        row.count || 0,
        row.behavior || '',
        row.actionType || '',
        row.operation || '',
        row.interaction || '',
        row.method || '',
        row.animal || '',
        row.efficacy || '',
        row.captured || 0,
        row.notes || '',
      ]);
    });

    // Column widths
    worksheet.columns = [
      { width: 10 },
      { width: 12 },
      { width: 10 },
      { width: 8 },
      { width: 14 },
      { width: 16 },
      { width: 6 },
      { width: 14 },
      { width: 14 },
      { width: 12 },
      { width: 18 },
      { width: 16 },
      { width: 16 },
      { width: 10 },
      { width: 14 },
      { width: 30 },
    ];

    await this.saveWorkbook(workbook, filename, 'actuacion');
  }

  /**
   * On mobile: saves to device and registers in reports database
   * On web: downloads using file-saver
   */
  private async saveWorkbook(
    workbook: ExcelJS.Workbook,
    filename: string,
    reportType: 'actuacion' | 'trampa' | 'prevencion' = 'actuacion',
    metadata?: any,
  ): Promise<void> {
    const buffer = await workbook.xlsx.writeBuffer();

    // Check if running on native platform
    if (this.reportsStorage.isNative()) {
      // Save to device using Capacitor Filesystem
      try {
        const report = await this.reportsStorage.saveReport(buffer, filename, reportType, metadata);
        console.log('Report saved successfully to device:', report.fileUri);

        // UI feedback (Toast/Alert) is now handled inside saveReport
      } catch (error) {
        console.error('Error saving report to device:', error);
        // Fallback to file-saver if Capacitor fails
        const file = new Blob([buffer], { type: 'application/octet-stream' });
        saveAs(file, filename);
      }
    } else {
      // Web: use file-saver
      const file = new Blob([buffer], { type: 'application/octet-stream' });
      saveAs(file, filename);
    }
  }

  private getColumnLetter(columnNumber: number): string {
    let letter = '';
    while (columnNumber > 0) {
      const remainder = (columnNumber - 1) % 26;
      letter = String.fromCharCode(65 + remainder) + letter;
      columnNumber = Math.floor((columnNumber - 1) / 26);
    }
    return letter;
  }
}
