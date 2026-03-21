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

@Injectable({
  providedIn: 'root',
})
export class GlobalExcelService {
  private reportsStorage = inject(ReportsStorageService);
  private session = inject(Session);

  async exportScfWorkbook(data: GlobalReportRow[]): Promise<void> {
    const workbook = new ExcelJS.Workbook();

    this.buildDatosGeneralesSheet(workbook.addWorksheet('DATOS_GENERALES'));

    const actuacionesSheet = workbook.addWorksheet('ACTUACIONES_DIARIAS');
    this.buildActuacionesDiariasSheet(actuacionesSheet, data);

    this.buildRetiradasAnimalSheet(workbook.addWorksheet('RETIRADAS_ANIMAL'));
    this.buildSeguimientoSheet(workbook.addWorksheet('SEGUIMIENTO'));
    this.buildRevisionValladoSheet(workbook.addWorksheet('REVISION_VALLADO'));
    this.buildColisionesSheet(workbook.addWorksheet('COLISIONES'));
    this.buildAvisosTwrSheet(workbook.addWorksheet('AVISOS_TWR'));

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

  private buildActuacionesDiariasSheet(
    worksheet: ExcelJS.Worksheet,
    data: GlobalReportRow[],
  ): void {
    const sessionData = this.session.sessionForm.value;

    this.createHeaderRow(worksheet, [
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
    ]);

    data.forEach((row) => {
      this.addDataRow(worksheet, [
        row.date || sessionData.date || new Date().toLocaleDateString('es-ES'),
        row.time ||
          sessionData.time ||
          new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        row.weather || sessionData.weather || '',
        row.worker || sessionData.worker || '',
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

    worksheet.columns = [
      { width: 12 },
      { width: 10 },
      { width: 14 },
      { width: 16 },
      { width: 16 },
      { width: 20 },
      { width: 6 },
      { width: 14 },
      { width: 18 },
      { width: 12 },
      { width: 18 },
      { width: 18 },
      { width: 16 },
      { width: 10 },
      { width: 14 },
      { width: 32 },
    ];
  }

  private buildDatosGeneralesSheet(worksheet: ExcelJS.Worksheet): void {
    this.addSectionWithHeaders(
      worksheet,
      'ASIGNACIÓN',
      ['Asignación', 'Categoría', 'Nombre', 'Alta', 'Baja'],
      4,
    );
    this.addSectionWithHeaders(
      worksheet,
      'ANIMALES EN SERVICIO - AVES',
      [
        'Nº',
        'Especie',
        'Anilla/Microchip',
        'Nombre',
        'Modalidad de vuelo',
        'Fecha Alta',
        'Fecha Baja',
        'Motivo baja',
      ],
      12,
    );
    this.addSectionWithHeaders(
      worksheet,
      'ANIMALES EN SERVICIO - PERROS',
      ['Nº', 'Especie', 'Microchip', 'Nombre', 'Fecha Alta', 'Fecha Baja', 'Motivo baja'],
      12,
    );
  }

  private buildRetiradasAnimalSheet(worksheet: ExcelJS.Worksheet): void {
    this.addSectionWithHeaders(
      worksheet,
      'RETIRADA DE RESTOS DE FAUNA',
      ['Fecha', 'Hora', 'Localización', 'Cód. lugar', 'Especie', 'Nº', 'Causa', 'Observaciones'],
      6,
    );
    this.addSectionWithHeaders(
      worksheet,
      'RESCATE DE OTROS ANIMALES EN EL AREA DE MOVIMIENTO',
      [
        'Fecha',
        'Hora',
        'Localización',
        'Cód. lugar',
        'Especie',
        'Nº',
        'Método empleado',
        'Observaciones',
      ],
      6,
    );
  }

  private buildSeguimientoSheet(worksheet: ExcelJS.Worksheet): void {
    this.addSectionWithHeaders(
      worksheet,
      'SEGUIMIENTO DE LAS ACTUACIONES EN VEGETACIÓN',
      ['Fecha', 'Hora', 'Descripción'],
      6,
    );
    this.addSectionWithHeaders(
      worksheet,
      'SEGUIMIENTO DE FOCOS/PUNTOS ATRACTIVOS',
      ['Foco/Punto atractivos', 'Fecha', 'Hora', 'Descripción'],
      8,
    );
    this.addSectionWithHeaders(
      worksheet,
      'DETECCIÓN DE FOCOS/PUNTO DE ATRACCIÓN',
      ['Fecha', 'Hora', 'Descripción'],
      5,
    );
  }

  private buildRevisionValladoSheet(worksheet: ExcelJS.Worksheet): void {
    this.addSectionWithHeaders(
      worksheet,
      'REVISIÓN DEL VALLADO',
      [
        'Fecha',
        'Localización',
        'Descripción',
        'Comunicado a',
        'Fecha de reparación',
        'Tipo de reparación',
      ],
      8,
    );
  }

  private buildColisionesSheet(worksheet: ExcelJS.Worksheet): void {
    this.addSectionWithHeaders(
      worksheet,
      'IMPACTOS',
      [
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
      6,
    );
  }

  private buildAvisosTwrSheet(worksheet: ExcelJS.Worksheet): void {
    this.addSectionWithHeaders(
      worksheet,
      'AVISOS DE/A TORRE U OTROS COLECTIVOS',
      ['Fecha', 'Hora', 'Emisor/Receptor', 'Descripción de comunicación', 'Detalles'],
      8,
    );
  }

  private addSectionWithHeaders(
    worksheet: ExcelJS.Worksheet,
    title: string,
    headers: string[],
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

    for (let i = 0; i < emptyRows; i++) {
      this.addDataRow(worksheet, Array(headers.length).fill(''));
    }

    worksheet.addRow([]);

    headers.forEach((header, index) => {
      const col = worksheet.getColumn(index + 1);
      col.width = Math.max(col.width ?? 10, Math.min(Math.max(header.length + 4, 12), 32));
    });
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
