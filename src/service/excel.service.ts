import { Injectable, inject } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import {
  cellToText,
  fileTimestamp,
  normalizeHeader,
  rowHeightFor,
  toDisplayDate,
  toIsoDate,
} from './excel-cells';
import { ReportsStorageService } from './reports-storage.service';

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

/** Columnas de la tabla de actuaciones (mismo orden que ACTUACIONES DIARIAS del SCF). */
const ACTUACION_COLUMNS: { header: string; width: number }[] = [
  { header: 'Fecha', width: 12 },
  { header: 'Climatología', width: 16 },
  { header: 'Personal', width: 12 },
  { header: 'Hora', width: 8 },
  { header: 'Localización', width: 14 },
  { header: 'Especie', width: 22 },
  { header: 'Nº', width: 6 },
  { header: 'Actitud', width: 14 },
  { header: 'Tipo actuación', width: 16 },
  { header: 'Operación', width: 12 },
  { header: 'Interacción operación', width: 18 },
  { header: 'Método empleado', width: 20 },
  { header: 'Animal empleado', width: 16 },
  { header: 'Eficacia', width: 10 },
  { header: 'Captura (Nº indiv)', width: 14 },
  { header: 'Observaciones', width: 40 },
];

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  private reportsStorage = inject(ReportsStorageService);

  /**
   * Importa actuaciones desde un Excel. Acepta tanto el Excel de "Mis Reportes"
   * (hoja "Actuación") como un SCF (hoja "ACTUACIONES DIARIAS"): busca la fila
   * de cabeceras (Fecha, Climatología…) y lee las filas que hay debajo.
   */
  async importActuacionExcel(file: File): Promise<ActuacionData[]> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(await file.arrayBuffer());

    const preferred = ['Actuación', 'ACTUACIONES DIARIAS'];
    const worksheets = [
      ...preferred.map((name) => workbook.getWorksheet(name)).filter((ws) => !!ws),
      ...workbook.worksheets.filter((ws) => !preferred.includes(ws.name)),
    ] as ExcelJS.Worksheet[];

    for (const worksheet of worksheets) {
      const headerRow = this.findActuacionHeaderRow(worksheet);
      if (headerRow !== null) {
        return this.readActuacionRows(worksheet, headerRow);
      }
    }

    throw new Error('No se ha encontrado una tabla de actuaciones en el archivo');
  }

  /** Exporta las actuaciones de "Mis Reportes" a un Excel. */
  async exportGlobalExcel(data: ActuacionData[], filename?: string): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Actuación');
    const widths = ACTUACION_COLUMNS.map((c) => c.width);

    worksheet.columns = ACTUACION_COLUMNS.map((c) => ({ width: c.width }));
    this.createHeaderRow(
      worksheet,
      ACTUACION_COLUMNS.map((c) => c.header),
    );

    data.forEach((row) => {
      this.addDataRow(
        worksheet,
        [
          toDisplayDate(row.date),
          row.weather || '',
          row.worker || '',
          row.time || '',
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
        ],
        widths,
      );
    });

    await this.saveWorkbook(workbook, filename || `reportes_${fileTimestamp()}.xlsx`);
  }

  private findActuacionHeaderRow(worksheet: ExcelJS.Worksheet): number | null {
    for (let n = 1; n <= worksheet.rowCount; n++) {
      const row = worksheet.getRow(n);
      const first = normalizeHeader(cellToText(row.getCell(1).value));
      const second = normalizeHeader(cellToText(row.getCell(2).value));
      if (first === 'FECHA' && second.startsWith('CLIMATOLOG')) {
        return n;
      }
    }
    return null;
  }

  private readActuacionRows(worksheet: ExcelJS.Worksheet, headerRow: number): ActuacionData[] {
    const rows: ActuacionData[] = [];

    for (let n = headerRow + 1; n <= worksheet.rowCount; n++) {
      const row = worksheet.getRow(n);
      const v = (col: number) => cellToText(row.getCell(col).value);
      const values = ACTUACION_COLUMNS.map((_, i) => v(i + 1));

      // Filas vacías (p. ej. las filas en blanco de plantilla del SCF)
      if (values.every((value) => value === '')) continue;
      // Cabecera repetida
      if (normalizeHeader(values[0]) === 'FECHA') continue;

      rows.push({
        date: toIsoDate(v(1)),
        weather: v(2),
        worker: v(3),
        time: v(4),
        zoneId: v(5),
        speciesId: v(6),
        count: Number(v(7)) || 0,
        behavior: v(8),
        actionType: v(9),
        operation: v(10),
        interaction: v(11),
        method: v(12),
        animal: v(13),
        efficacy: v(14),
        captured: Number(v(15)) || 0,
        notes: v(16),
      });
    }

    return rows;
  }

  private createHeaderRow(worksheet: ExcelJS.Worksheet, headers: string[]): void {
    const headerRow = worksheet.addRow(headers);
    headerRow.height = 30;
    headerRow.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D9D9D9' } };
      cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: '000000' } };
      cell.border = this.border();
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    });
  }

  private addDataRow(worksheet: ExcelJS.Worksheet, data: unknown[], widths: number[]): void {
    const dataRow = worksheet.addRow(data);
    dataRow.height = rowHeightFor(data, widths, 12.5, 20);
    dataRow.eachCell((cell) => {
      cell.font = { name: 'Arial', size: 9 };
      cell.border = this.border();
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    });
  }

  private border(): Partial<ExcelJS.Borders> {
    const side = { style: 'thin' as const, color: { argb: '000000' } };
    return { top: side, left: side, bottom: side, right: side };
  }

  /**
   * En el móvil guarda el archivo en el dispositivo (y avisa al usuario);
   * en el navegador lo descarga. Si el guardado en el móvil falla, se lanza el
   * error para que la pantalla lo muestre, en lugar de dar un falso "exportado".
   */
  private async saveWorkbook(workbook: ExcelJS.Workbook, filename: string): Promise<void> {
    const buffer = await workbook.xlsx.writeBuffer();

    if (this.reportsStorage.isNative()) {
      await this.reportsStorage.saveReport(buffer as ArrayBuffer, filename, 'actuacion');
      return;
    }

    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), filename);
  }
}
