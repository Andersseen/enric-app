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
  title: string;
  sections: ScfSectionTemplate[];
}

export interface ScfSectionData extends ScfSectionTemplate {
  rows: string[][];
}

export interface ScfSheetData {
  id: string;
  title: string;
  sections: ScfSectionData[];
}

export const SCF_SHEETS_TEMPLATE: ScfSheetTemplate[] = [
  {
    id: 'DATOS_GENERALES',
    title: 'Datos base de asignacion y animales en servicio.',
    sections: [
      {
        title: 'ASIGNACIÓN',
        headers: ['Asignación', 'Categoría', 'Nombre', 'Alta', 'Baja'],
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
    title: 'Hoja operativa con los registros de actuacion.',
    sections: [
      {
        title: 'ACTUACIONES_DIARIAS',
        headers: [
          'Fecha',
          'Hora',
          'Climatología',
          'Personal',
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
    title: 'Seguimientos de vegetacion y focos de atraccion.',
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
      const worksheet = workbook.getWorksheet(sheet.id);

      return {
        id: sheet.id,
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

    sheets.forEach((sheet) => {
      this.buildSheetFromData(workbook.addWorksheet(sheet.id), sheet);
    });

    const filename = `SCF-${this.getScfDateStamp()}.xlsx`;
    await this.saveWorkbook(workbook, filename);
  }

  private createHeaderRow(worksheet: ExcelJS.Worksheet, headers: string[]): void {
    const headerRow = worksheet.addRow(headers);
    headerRow.height = 30;
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'D9D9D9' },
      };
      cell.font = {
        name: 'Arial',
        size: 10,
        bold: true,
        color: { argb: '000000' },
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

  mapGlobalRowsToActuacionesRows(data: GlobalReportRow[]): string[][] {
    const sessionData = this.session.sessionForm.value;

    return data.map((row) => [
      row.date || sessionData.date || new Date().toLocaleDateString('es-ES'),
      row.time ||
        sessionData.time ||
        new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      row.weather || sessionData.weather || '',
      row.worker || sessionData.worker || '',
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
    sheet.sections.forEach((section) => {
      this.addSectionWithRows(
        worksheet,
        section.title,
        section.headers,
        section.rows,
        section.emptyRows,
      );
    });
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
    const startColumn = 1;
    const endColumn = headers.length;
    worksheet.mergeCells(titleRow.number, startColumn, titleRow.number, endColumn);

    const titleCell = titleRow.getCell(1);
    titleCell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFFFFF' } };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '000000' } };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    titleCell.border = {
      top: { style: 'thin', color: { argb: '000000' } },
      left: { style: 'thin', color: { argb: '000000' } },
      bottom: { style: 'thin', color: { argb: '000000' } },
      right: { style: 'thin', color: { argb: '000000' } },
    };

    this.createHeaderRow(worksheet, headers);

    const rowsToRender =
      rows.length > 0
        ? rows
        : Array.from({ length: emptyRows }, () => Array(headers.length).fill(''));
    rowsToRender.forEach((row) => {
      this.addDataRow(worksheet, row);
    });

    worksheet.addRow([]);

    headers.forEach((header, index) => {
      const col = worksheet.getColumn(index + 1);
      col.width = Math.max(col.width ?? 10, Math.min(Math.max(header.length + 4, 12), 32));
    });
  }

  private parseSectionRows(
    worksheet: ExcelJS.Worksheet,
    sections: ScfSectionTemplate[],
    sectionIndex: number,
  ): string[][] {
    const section = sections[sectionIndex];
    const startRow = this.findRowByFirstCell(worksheet, section.title);
    if (!startRow) {
      return [];
    }

    const nextSectionTitle = sections[sectionIndex + 1]?.title;
    const rows: string[][] = [];

    for (let rowNumber = startRow + 2; rowNumber <= worksheet.rowCount; rowNumber++) {
      const row = worksheet.getRow(rowNumber);
      const firstCell = this.normalizeCellValue(row.getCell(1).value);

      if (nextSectionTitle && firstCell === nextSectionTitle) {
        break;
      }

      const values = section.headers.map((_, index) =>
        this.normalizeCellValue(row.getCell(index + 1).value),
      );

      if (values.some((value) => value !== '')) {
        rows.push(values);
      }
    }

    return rows;
  }

  private findRowByFirstCell(worksheet: ExcelJS.Worksheet, value: string): number | null {
    for (let rowNumber = 1; rowNumber <= worksheet.rowCount; rowNumber++) {
      const rowValue = this.normalizeCellValue(worksheet.getRow(rowNumber).getCell(1).value);
      if (rowValue === value) {
        return rowNumber;
      }
    }

    return null;
  }

  private normalizeCellValue(value: ExcelJS.CellValue | undefined | null): string {
    if (value == null) {
      return '';
    }

    if (value instanceof Date) {
      return value.toLocaleDateString('es-ES');
    }

    if (typeof value === 'object') {
      if ('text' in value && typeof value.text === 'string') {
        return value.text.trim();
      }

      if ('result' in value && value.result != null) {
        return String(value.result).trim();
      }

      if ('richText' in value && Array.isArray(value.richText)) {
        return value.richText
          .map((part) => part.text)
          .join('')
          .trim();
      }
    }

    return String(value).trim();
  }

  private getScfDateStamp(): string {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
  }

  private async saveWorkbook(workbook: ExcelJS.Workbook, filename: string): Promise<void> {
    const buffer = await workbook.xlsx.writeBuffer();

    if (this.reportsStorage.isNative()) {
      try {
        await this.reportsStorage.saveReport(buffer, filename, 'actuacion', {
          source: 'reporte-entero',
        });
      } catch (error) {
        console.error('Error saving global report to device:', error);
        const file = new Blob([buffer], { type: 'application/octet-stream' });
        saveAs(file, filename);
      }
      return;
    }

    const file = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(file, filename);
  }
}
