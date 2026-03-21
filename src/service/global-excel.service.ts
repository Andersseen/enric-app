import { Injectable, inject } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { ReportsStorageService } from './reports-storage.service';
import Session from './session';

export interface GlobalReportRow {
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

export interface ScfSectionTemplate {
  title: string;
  headers: string[];
  emptyRows: number;
}

export interface ScfSheetTemplate {
  id: string;

  excelName: string;
  title: string;
  sections: ScfSectionTemplate[];
}

export interface ScfSectionData extends ScfSectionTemplate {
  rows: string[][];
}

export interface ScfSheetData {
  id: string;
  excelName: string;
  title: string;
  sections: ScfSectionData[];
}

export const SCF_SHEETS_TEMPLATE: ScfSheetTemplate[] = [
  {
    id: 'DATOS_GENERALES',
    excelName: 'DATOS_GENERALES',
    title: 'Datos base de asignación y animales en servicio.',
    sections: [
      {
        title: 'ASIGNACIÓN',

        headers: ['Asignación', 'CATEGORIA', 'NOMBRE', 'ALTA', 'BAJA'],
        emptyRows: 4,
      },
      {
        title: 'ANIMALES EN SERVICIO - AVES',
        headers: [
          'Nº',
          'Especie',
          'Anilla/Microchip',
          'Nombre',
          'Modalidad de vuelo',
          'Fecha Alta',
          'Fecha Baja',
          'Motivo baja',
        ],
        emptyRows: 12,
      },
      {
        title: 'ANIMALES EN SERVICIO - PERROS',
        headers: [
          'Nº',
          'Especie',
          'Microchip',
          'Nombre',
          'Fecha Alta',
          'Fecha Baja',
          'Motivo baja',
        ],
        emptyRows: 12,
      },
    ],
  },
  {
    id: 'ACTUACIONES_DIARIAS',

    excelName: 'ACTUACIONES DIARIAS',
    title: 'Hoja operativa con los registros de actuación.',
    sections: [
      {
        title: 'ACTUACIONES_DIARIAS',

        headers: [
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
        ],
        emptyRows: 6,
      },
    ],
  },
  {
    id: 'RETIRADAS_ANIMAL',
    excelName: 'RETIRADAS_ANIMAL',
    title: 'Retiradas y rescates de fauna.',
    sections: [
      {
        title: 'RETIRADA DE RESTOS DE FAUNA',
        headers: [
          'Fecha',
          'Hora',
          'Localización',
          'Cód. lugar',
          'Especie',
          'Nº',
          'Causa',
          'Observaciones',
        ],
        emptyRows: 6,
      },
      {
        title: 'RESCATE DE OTROS ANIMALES EN EL AREA DE MOVIMIENTO',
        headers: [
          'Fecha',
          'Hora',
          'Localización',
          'Cód. lugar',
          'Especie',
          'Nº',
          'Método empleado',
          'Observaciones',
        ],
        emptyRows: 6,
      },
    ],
  },
  {
    id: 'SEGUIMIENTO',
    excelName: 'SEGUIMIENTO',
    title: 'Seguimientos de vegetación y focos de atracción.',
    sections: [
      {
        title: 'SEGUIMIENTO DE LAS ACTUACIONES EN VEGETACIÓN',
        headers: ['Fecha', 'Hora', 'Descripción'],
        emptyRows: 6,
      },
      {
        title: 'SEGUIMIENTO DE FOCOS/PUNTOS ATRACTIVOS',
        headers: ['Foco/Punto atractivos', 'Fecha', 'Hora', 'Descripción'],
        emptyRows: 8,
      },
      {
        title: 'DETECCIÓN DE FOCOS/PUNTO DE ATRACCIÓN',
        headers: ['Fecha', 'Hora', 'Descripción'],
        emptyRows: 5,
      },
    ],
  },
  {
    id: 'REVISION_VALLADO',

    excelName: 'REVISIÓN_VALLADO',
    title: 'Control de incidencias y reparaciones de vallado.',
    sections: [
      {
        title: 'REVISIÓN DEL VALLADO',
        headers: [
          'Fecha',
          'Localización',
          'Descripción',
          'Comunicado a',
          'Fecha de reparación',
          'Tipo de reparación',
        ],
        emptyRows: 8,
      },
    ],
  },
  {
    id: 'COLISIONES',
    excelName: 'COLISIONES',
    title: 'Registro de impactos con aeronaves.',
    sections: [
      {
        title: 'IMPACTOS',
        headers: [
          'Fecha',
          'Hora',
          'Localización',
          'Cód. lugar',
          'Especie implicada',
          'Nº',
          'Detección de restos',
          'Descripción incidente',
          'Tipo aeronave',
          'Matrícula',
          'Consecuencia para la aeronave',
        ],
        emptyRows: 6,
      },
    ],
  },
  {
    id: 'AVISOS_TWR',

    excelName: 'AVISOS TWR',
    title: 'Comunicaciones con torre y otros colectivos.',
    sections: [
      {
        title: 'AVISOS DE/A TORRE U OTROS COLECTIVOS',
        headers: ['Fecha', 'Hora', 'Emisor/Receptor', 'Descripción de comunicación', 'Detalles'],
        emptyRows: 8,
      },
    ],
  },
];

const COLOR = {
  titleBg: '000000',
  titleFg: 'FFFFFF',
  headerBg: 'CFCFCF',
  headerFg: '000000',
  dataBg: 'E8E8E8',
  bannerBg: 'FFF200',
  bannerFg: '111111',
  border: '000000',
} as const;

@Injectable({
  providedIn: 'root',
})
export class GlobalExcelService {
  private reportsStorage = inject(ReportsStorageService);
  private session = inject(Session);

  createScfSheetsData(sourceRows: GlobalReportRow[] = []): ScfSheetData[] {
    const actuacionesRows = this.mapGlobalRowsToActuacionesRows(sourceRows);

    return SCF_SHEETS_TEMPLATE.map((sheet) => ({
      id: sheet.id,
      excelName: sheet.excelName,
      title: sheet.title,
      sections: sheet.sections.map((section) => ({
        ...section,
        rows:
          sheet.id === 'ACTUACIONES_DIARIAS' && section.title === 'ACTUACIONES_DIARIAS'
            ? actuacionesRows
            : [],
      })),
    }));
  }

  async importScfWorkbook(file: File): Promise<ScfSheetData[]> {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);

    return SCF_SHEETS_TEMPLATE.map((sheet) => {
      const worksheet = workbook.getWorksheet(sheet.excelName) ?? workbook.getWorksheet(sheet.id);

      return {
        id: sheet.id,
        excelName: sheet.excelName,
        title: sheet.title,
        sections: sheet.sections.map((section, index) => ({
          ...section,
          rows: worksheet ? this.parseSectionRows(worksheet, sheet.sections, index) : [],
        })),
      };
    });
  }

  async exportScfWorkbook(sheets: ScfSheetData[]): Promise<void> {
    const workbook = new ExcelJS.Workbook();

    workbook.creator = 'SCF App';
    workbook.created = new Date();

    sheets.forEach((sheet) => {
      const ws = workbook.addWorksheet(sheet.excelName);
      this.buildSheetFromData(ws, sheet);
    });

    const filename = `SCF-${this.getScfDateStamp()}.xlsx`;
    await this.saveWorkbook(workbook, filename);
  }

  mapGlobalRowsToActuacionesRows(data: GlobalReportRow[]): string[][] {
    const sessionData = this.session.sessionForm.value;

    return data.map((row) => [
      row.date || sessionData.date || new Date().toLocaleDateString('es-ES'),
      row.weather || sessionData.weather || '',
      row.worker || sessionData.worker || '',
      row.time ||
        sessionData.time ||
        new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      row.zoneId || '',
      row.speciesId || '',
      String(row.count || 0),
      row.behavior || '',
      row.actionType || '',
      row.operation || '',
      row.interaction || '',
      row.method || '',
      row.animal || '',
      row.efficacy || '',
      String(row.captured || 0),
      row.notes || '',
    ]);
  }

  private buildSheetFromData(worksheet: ExcelJS.Worksheet, sheet: ScfSheetData): void {
    if (sheet.id === 'DATOS_GENERALES') {
      this.addExpedienteBanner(worksheet, sheet);
    }

    sheet.sections.forEach((section) => {
      this.addSectionWithRows(
        worksheet,
        section.title,
        section.headers,
        section.rows,
        section.emptyRows,
      );
    });

    worksheet.views = [{ state: 'frozen', ySplit: 1 }];
  }

  private addExpedienteBanner(worksheet: ExcelJS.Worksheet, sheet: ScfSheetData): void {
    const widestSection = sheet.sections.reduce(
      (max, section) => Math.max(max, section.headers.length),
      1,
    );

    const spacer = worksheet.addRow(Array(widestSection).fill(''));
    spacer.height = 12;

    const bannerRow = worksheet.addRow(['', '', '', 'Expediente xxxx']);
    bannerRow.height = 20;
    worksheet.mergeCells(bannerRow.number, 1, bannerRow.number, widestSection);

    const bannerCell = bannerRow.getCell(1);
    bannerCell.font = {
      name: 'Arial',
      size: 10,
      bold: true,
      color: { argb: COLOR.bannerFg },
    };
    bannerCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLOR.bannerBg } };
    bannerCell.alignment = { vertical: 'middle', horizontal: 'center' };
    this.applyBorder(bannerCell);

    worksheet.addRow(Array(widestSection).fill(''));
  }

  private addSectionWithRows(
    worksheet: ExcelJS.Worksheet,
    title: string,
    headers: string[],
    rows: string[][],
    emptyRows: number,
  ): void {
    const titleRow = worksheet.addRow([title]);
    titleRow.height = 22;
    worksheet.mergeCells(titleRow.number, 1, titleRow.number, headers.length);
    const titleCell = titleRow.getCell(1);
    titleCell.font = { name: 'Arial', size: 10, bold: true, color: { argb: COLOR.titleFg } };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLOR.titleBg } };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    this.applyBorder(titleCell);

    this.createHeaderRow(worksheet, headers);

    const rowsToRender =
      rows.length > 0
        ? rows
        : Array.from({ length: emptyRows }, () => Array(headers.length).fill(''));
    rowsToRender.forEach((row) => this.addDataRow(worksheet, row));

    worksheet.addRow([]);

    headers.forEach((header, index) => {
      const col = worksheet.getColumn(index + 1);
      col.width = Math.max(col.width ?? 10, Math.min(Math.max(header.length + 4, 12), 32));
    });
  }

  private createHeaderRow(worksheet: ExcelJS.Worksheet, headers: string[]): void {
    const row = worksheet.addRow(headers);
    row.height = 28;
    row.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLOR.headerBg } };
      cell.font = { name: 'Arial', size: 11, bold: true, color: { argb: COLOR.headerFg } };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      this.applyBorder(cell);
    });
  }

  private addDataRow(worksheet: ExcelJS.Worksheet, data: unknown[]): void {
    const row = worksheet.addRow(data);
    row.height = 19;
    row.eachCell((cell) => {
      cell.font = { name: 'Arial', size: 9 };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLOR.dataBg } };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      this.applyBorder(cell);
    });
  }

  private applyBorder(cell: ExcelJS.Cell): void {
    const side: ExcelJS.BorderStyle = 'thin';
    cell.border = {
      top: { style: side, color: { argb: COLOR.border } },
      left: { style: side, color: { argb: COLOR.border } },
      bottom: { style: side, color: { argb: COLOR.border } },
      right: { style: side, color: { argb: COLOR.border } },
    };
  }

  private parseSectionRows(
    worksheet: ExcelJS.Worksheet,
    sections: ScfSectionTemplate[],
    sectionIndex: number,
  ): string[][] {
    const section = sections[sectionIndex];

    let startRow = this.findRowByFirstCell(worksheet, section.title);

    if (startRow === null) {
      startRow = this.findRowByFirstCell(worksheet, section.headers[0]);
      if (startRow === null) return [];

      return this.extractDataRows(worksheet, section, startRow + 1, sections, sectionIndex);
    }

    return this.extractDataRows(worksheet, section, startRow + 2, sections, sectionIndex);
  }

  private extractDataRows(
    worksheet: ExcelJS.Worksheet,
    section: ScfSectionTemplate,
    firstDataRow: number,
    sections: ScfSectionTemplate[],
    sectionIndex: number,
  ): string[][] {
    const nextSectionTitle = sections[sectionIndex + 1]?.title;
    const rows: string[][] = [];

    for (let rowNumber = firstDataRow; rowNumber <= worksheet.rowCount; rowNumber++) {
      const row = worksheet.getRow(rowNumber);
      const firstCell = this.normalizeCellValue(row.getCell(1).value);

      if (nextSectionTitle && firstCell === nextSectionTitle) break;

      if (nextSectionTitle && firstCell.trim() === nextSectionTitle.trim()) break;

      const values = section.headers.map((_, index) =>
        this.normalizeCellValue(row.getCell(index + 1).value),
      );

      if (values.some((v) => v !== '')) {
        rows.push(values);
      }
    }

    return rows;
  }

  private findRowByFirstCell(worksheet: ExcelJS.Worksheet, value: string): number | null {
    const normalizedTarget = value.trim().toLowerCase();
    for (let rowNumber = 1; rowNumber <= worksheet.rowCount; rowNumber++) {
      const cellValue = this.normalizeCellValue(worksheet.getRow(rowNumber).getCell(1).value);
      if (cellValue.trim().toLowerCase() === normalizedTarget) {
        return rowNumber;
      }
    }
    return null;
  }

  private normalizeCellValue(value: ExcelJS.CellValue | undefined | null): string {
    if (value == null) return '';

    if (value instanceof Date) {
      return value.toLocaleDateString('es-ES');
    }

    if (typeof value === 'object') {
      if ('result' in value && value.result != null) {
        const r = value.result;
        if (r instanceof Date) return r.toLocaleDateString('es-ES');
        return String(r).trim();
      }

      if ('text' in value && typeof (value as { text: unknown }).text === 'string') {
        return (value as { text: string }).text.trim();
      }

      if (
        'richText' in value &&
        Array.isArray((value as { richText: { text: string }[] }).richText)
      ) {
        return (value as { richText: { text: string }[] }).richText
          .map((p) => p.text)
          .join('')
          .trim();
      }
    }

    if (typeof value === 'object' && value !== null && 'getHours' in (value as object)) {
      const d = value as any;
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      return `${hh}:${mm}`;
    }

    return String(value).trim();
  }

  private getScfDateStamp(): string {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yy = String(now.getFullYear()).slice(-2);
    return `${dd}-${mm}-${yy}`;
  }

  private async saveWorkbook(workbook: ExcelJS.Workbook, filename: string): Promise<void> {
    const buffer = await workbook.xlsx.writeBuffer();

    if (this.reportsStorage.isNative()) {
      try {
        await this.reportsStorage.saveReport(buffer, filename, 'actuacion', {
          source: 'reporte-entero',
        });
        return;
      } catch (error) {
        console.error('Error saving global report to device:', error);
      }
    }

    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(blob, filename);
  }
}
