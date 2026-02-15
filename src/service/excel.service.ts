import { Injectable, inject } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { ReportsStorageService } from './reports-storage.service';
import Session from './session';

export interface AssignmentRow {
  number: string;
  category: string;
  name: string;
  alta: string;
  baja: string;
}

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

export interface TrampaData {
  // Add trap-specific fields here based on your needs
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  private reportsStorage = inject(ReportsStorageService);
  private session = inject(Session);
  /**
   * Creates a styled title row with yellow background
   */
  private createTitleRow(worksheet: ExcelJS.Worksheet, title: string, mergeColumns: string): void {
    const titleRow = worksheet.addRow([title]);
    titleRow.font = { name: 'Arial', size: 14, bold: true, color: { argb: '000000' } };
    titleRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFF00' },
    };
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' };
    titleRow.height = 25;
    worksheet.mergeCells(mergeColumns);
  }

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
        fgColor: { argb: '375623' }, // Dark green like in the reference
      };
      cell.font = {
        name: 'Arial',
        size: 10,
        bold: true,
        color: { argb: 'FFFFFF' },
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

  private createAssignmentSection(
    worksheet: ExcelJS.Worksheet,
    assignmentRows: AssignmentRow[],
  ): void {
    this.createHeaderRow(worksheet, ['Asignación', 'CATEGORÍA', 'NOMBRE', 'ALTA', 'BAJA']);

    assignmentRows.forEach((rowData) => {
      this.addDataRow(worksheet, [
        rowData.number,
        rowData.category,
        rowData.name,
        rowData.alta,
        rowData.baja,
      ]);
    });
  }

  async generateActuacionExcel(
    data: ActuacionData,
    assignmentRows: AssignmentRow[] = [
      { number: '1', category: 'Cetrero', name: '', alta: '', baja: '' },
      { number: '2', category: 'Jefe de Equipo', name: '', alta: '', baja: '' },
      { number: '3', category: 'Cetrero', name: '', alta: '', baja: '' },
      { number: '4', category: 'Cetrero', name: '', alta: '', baja: '' },
    ],
    filename?: string,
  ): Promise<void> {
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
      'Interacción perro/halcón',
      'Método empleado',
      'Animal empleado',
      'Eficacia',
      'Captura Efectiva',
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
   * Generates an Excel file for "Trampas" with horizontal layout
   */
  async generateTrampaExcel(
    data: TrampaData,
    assignmentRows: AssignmentRow[] = [
      { number: '1', category: 'Cetrero', name: '', alta: '', baja: '' },
      { number: '2', category: 'Jefe de Equipo', name: '', alta: '', baja: '' },
      { number: '3', category: 'Cetrero', name: '', alta: '', baja: '' },
      { number: '4', category: 'Cetrero', name: '', alta: '', baja: '' },
    ],
    filename: string = 'trampa.xlsx',
  ): Promise<void> {
    // Get current session data
    const sessionData = this.session.sessionForm.value;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Trampa');

    // Title
    this.createTitleRow(worksheet, 'Expediente xxxx', 'A1:M1');

    // Assignment Section
    this.createAssignmentSection(worksheet, assignmentRows);

    // Spacer
    worksheet.addRow([]);

    // Save with session data
    await this.saveWorkbook(workbook, filename, 'trampa', {
      ...data,
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
    title: string,
    headers: string[],
    dataRows: any[][],
    columnWidths: number[],
    filename: string,
    reportType: 'actuacion' | 'trampa' | 'prevencion' = 'actuacion',
    assignmentRows?: AssignmentRow[],
    metadata?: any,
  ): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    // Title
    const mergeRange = `A1:${this.getColumnLetter(headers.length)}1`;
    this.createTitleRow(worksheet, title, mergeRange);

    // Optional Assignment Section
    if (assignmentRows && assignmentRows.length > 0) {
      this.createAssignmentSection(worksheet, assignmentRows);
      worksheet.addRow([]);
    }

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
      'Interacción perro/halcón',
      'Método empleado',
      'Animal empleado',
      'Eficacia',
      'Captura Efectiva',
      'Observaciones',
    ]);

    const sessionData = this.session.sessionForm.value;

    data.forEach((row) => {
      this.addDataRow(worksheet, [
        row.date || sessionData.date || new Date().toLocaleDateString('es-ES'), // Fallback to session
        sessionData.weather || '',
        sessionData.worker || '',
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
