import { Injectable, inject } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { ReportsStorageService } from './reports-storage.service';

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
    worksheet.mergeCells(mergeColumns);
  }

  /**
   * Creates a header row with black background and white text
   */
  private createHeaderRow(worksheet: ExcelJS.Worksheet, headers: string[]): void {
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '000000' },
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
  }

  /**
   * Adds a data row with borders
   */
  private addDataRow(worksheet: ExcelJS.Worksheet, data: any[]): void {
    const row = worksheet.addRow(data);
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
  }

  /**
   * Creates assignment section (top section with categories)
   */
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

  /**
   * Generates an Excel file for "Actuación" with horizontal layout
   */
  async generateActuacionExcel(
    data: ActuacionData,
    assignmentRows: AssignmentRow[] = [
      { number: '1', category: 'Cetrero', name: '', alta: '', baja: '' },
      { number: '2', category: 'Jefe de Equipo', name: '', alta: '', baja: '' },
      { number: '3', category: 'Cetrero', name: '', alta: '', baja: '' },
      { number: '4', category: 'Cetrero', name: '', alta: '', baja: '' },
    ],
    filename: string = 'actuacion.xlsx',
  ): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Actuación');

    // Title
    this.createTitleRow(worksheet, 'Expediente xxxx', 'A1:M1');

    // Assignment Section
    this.createAssignmentSection(worksheet, assignmentRows);

    // Spacer
    worksheet.addRow([]);

    // Data Section Header
    this.createHeaderRow(worksheet, [
      'Zona',
      'Especie',
      'Cuántas',
      'Actitud',
      'Tipo acción',
      'Interacción',
      'Método',
      'Animal',
      'Eficacia',
      'Capturas',
      'Observaciones',
      'Fecha',
    ]);

    // Data Row
    this.addDataRow(worksheet, [
      data.zoneId || '',
      data.speciesId || '',
      data.count || 0,
      data.behavior || '',
      data.actionType || '',
      data.interaction || '',
      data.method || '',
      data.animal || '',
      data.efficacy || '',
      data.captured || 0,
      data.notes || '',
      new Date().toLocaleString(),
    ]);

    // Column widths
    worksheet.columns = [
      { width: 15 }, // Zona
      { width: 20 }, // Especie
      { width: 10 }, // Cuántas
      { width: 15 }, // Actitud
      { width: 15 }, // Tipo acción
      { width: 15 }, // Interacción
      { width: 20 }, // Método
      { width: 15 }, // Animal
      { width: 10 }, // Eficacia
      { width: 10 }, // Capturas
      { width: 30 }, // Observaciones
      { width: 20 }, // Fecha
    ];

    // Save with metadata
    await this.saveWorkbook(workbook, filename, 'actuacion', {
      zone: data.zoneId,
      species: data.speciesId,
      count: data.count,
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
    filename: string = 'trampas.xlsx',
  ): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Trampas');

    // Title
    this.createTitleRow(worksheet, 'Expediente xxxx', 'A1:M1');

    // Assignment Section
    this.createAssignmentSection(worksheet, assignmentRows);

    // Spacer
    worksheet.addRow([]);

    // TODO: Add your trap-specific headers and data here
    // Example:
    // this.createHeaderRow(worksheet, ['Field1', 'Field2', ...]);
    // this.addDataRow(worksheet, [data.field1, data.field2, ...]);

    // Save
    await this.saveWorkbook(workbook, filename, 'trampa', data);
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
   * Saves the workbook as a file
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
        await this.reportsStorage.saveReport(buffer, filename, reportType, metadata);
        console.log('Report saved successfully to device');
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

  /**
   * Helper to convert column index to Excel letter (A, B, C, ..., Z, AA, AB, ...)
   */
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
