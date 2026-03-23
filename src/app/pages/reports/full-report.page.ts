import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
  ActionSheetController,
  AlertController,
  ToastController,
} from '@ionic/angular/standalone';
import { GlobalExcelService, ScfSheetData } from '@service/global-excel.service';
import { ReportStore } from '@service/report-store';
import { Preferences } from '@capacitor/preferences';
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons';
import { ScfActionBarComponent } from '@app/components/scf-action-bar/scf-action-bar.component';
import { ScfSheetSelectorComponent } from '@app/components/scf-sheet-selector/scf-sheet-selector.component';
import { ScfSectionTableComponent } from '@app/components/scf-section-table/scf-section-table.component';
import { ScfRowEditModalComponent } from '@app/components/scf-row-edit-modal/scf-row-edit-modal.component';

@Component({
  selector: 'app-full-report',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
    ScfActionBarComponent,
    ScfSheetSelectorComponent,
    ScfSectionTableComponent,
    ScfRowEditModalComponent,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="goHome()" color="dark">
            <ion-icon name="arrow-back"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title class="cursor-pointer" (click)="goHome()">Reporte SCF</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding bg-background text-foreground">
      <div class="flex flex-col gap-4 text-foreground">

        <!-- ── Action bar ── -->
        <app-scf-action-bar
          [isLoading]="isLoading()"
          [loadingMessage]="loadingMessage()"
          [activeSheetId]="activeSheet().id"
          [sourceReportCount]="sourceReportCount()"
          [actuacionesTableCount]="actuacionesTableCount()"
          (importFile)="onFileSelected($event)"
          (moveData)="moveActuacionesData()"
          (clearTables)="clearAllTables()"
          (exportScf)="exportScf()"
        />

        <!-- ── Sheet selector ── -->
        <app-scf-sheet-selector
          [sheets]="scfSheets()"
          [selectedSheetId]="selectedSheetId()"
          (sheetSelected)="selectSheet($event)"
        />

        <!-- ── Active sheet content ── -->
        <div class="bg-surface p-4 rounded-lg shadow-sm border border-border flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-foreground">
              {{ sheetLabel(activeSheet().id) }}
            </h3>
            <span class="text-xs text-muted bg-background px-2 py-1 rounded border border-border">
              {{ activeSheet().excelName }}
            </span>
          </div>

          <div class="grid grid-cols-1 gap-4">
            @for (section of activeSheet().sections; track section.title) {
              <app-scf-section-table
                [section]="section"
                (editRequested)="onSectionEditRequested(activeSheet().id, section.title, section.headers, section.rows)"
                (addRowRequested)="openNewRow(activeSheet().id, section.title, section.headers)"
              />
            }
          </div>
        </div>

      </div>
    </ion-content>

    <!-- ── Row edit modal (single instance, page-level) ── -->
    <app-scf-row-edit-modal
      [isOpen]="editModalOpen()"
      [headers]="editingHeaders()"
      [row]="editingRow()"
      (saved)="onRowSaved($event)"
      (deleted)="onRowDeleted()"
      (cancelled)="closeEditModal()"
    />
  `,
})
export default class FullReportPage {
  private static readonly SCF_STATE_KEY = 'enric_scf_full_report_state';

  private globalExcelService = inject(GlobalExcelService);
  private router = inject(Router);
  private actionSheetController = inject(ActionSheetController);
  private reportStore = inject(ReportStore);
  private toastController = inject(ToastController);
  private alertController = inject(AlertController);

  sourceReportRows = this.reportStore.rows;
  sourceReportCount = this.reportStore.count;

  scfSheets = signal<ScfSheetData[]>(this.globalExcelService.createScfSheetsData());
  selectedSheetId = signal<string>(this.scfSheets()[0]?.id ?? 'DATOS_GENERALES');
  isLoading = signal(false);
  loadingMessage = signal('');

  // ── Edit state ──────────────────────────────────────────────────────────────
  editModalOpen = signal(false);
  private editingSheetId = signal<string | null>(null);
  private editingSectionTitle = signal<string | null>(null);
  private editingRowIndex = signal<number | null>(null); // null = new row

  editingHeaders = signal<string[]>([]);
  editingRow = signal<string[] | null>(null); // null = new row

  // ── Computed ────────────────────────────────────────────────────────────────
  activeSheet = computed(
    () => this.scfSheets().find((s) => s.id === this.selectedSheetId()) ?? this.scfSheets()[0],
  );

  actuacionesTableCount = computed(() => {
    const sheet = this.scfSheets().find((s) => s.id === 'ACTUACIONES_DIARIAS');
    const section = sheet?.sections.find((s) => s.title === 'ACTUACIONES_DIARIAS');
    return section?.rows.length ?? 0;
  });

  constructor() {
    addIcons({ arrowBack });
    this.restoreScfState();
  }

  // ── Edit modal handlers ─────────────────────────────────────────────────────

  /** Tap on ✏️ Editar in section header → ActionSheet lists rows → edit modal */
  async onSectionEditRequested(
    sheetId: string,
    sectionTitle: string,
    headers: string[],
    rows: string[][],
  ) {
    const MAX_ROWS = 25;
    const rowButtons = rows.slice(0, MAX_ROWS).map((row, i) => ({
      text: `${i + 1}. ${row[0] || '—'}  ${row[1] ? '· ' + row[1] : ''}`,
      handler: () => this.openEditRow(sheetId, sectionTitle, headers, row, i),
    }));

    const sheet = await this.actionSheetController.create({
      header: sectionTitle,
      subHeader: rows.length === 0 ? 'Sin filas — añade una nueva' : `${rows.length} fila${rows.length !== 1 ? 's' : ''}`,
      buttons: [
        ...rowButtons,
        ...(rows.length > MAX_ROWS
          ? [{ text: `… y ${rows.length - MAX_ROWS} filas más (edita desplazándote)`, disabled: true }]
          : []),
        {
          text: '+ Añadir fila nueva',
          icon: 'add-circle-outline',
          handler: () => this.openNewRow(sheetId, sectionTitle, headers),
        },
        { text: 'Cancelar', role: 'cancel' },
      ],
    });
    await sheet.present();
  }

  openEditRow(
    sheetId: string,
    sectionTitle: string,
    headers: string[],
    row: string[],
    rowIndex: number,
  ) {
    this.editingSheetId.set(sheetId);
    this.editingSectionTitle.set(sectionTitle);
    this.editingRowIndex.set(rowIndex);
    this.editingHeaders.set(headers);
    this.editingRow.set([...row]);
    this.editModalOpen.set(true);
  }

  openNewRow(sheetId: string, sectionTitle: string, headers: string[]) {
    this.editingSheetId.set(sheetId);
    this.editingSectionTitle.set(sectionTitle);
    this.editingRowIndex.set(null);
    this.editingHeaders.set(headers);
    this.editingRow.set(null);
    this.editModalOpen.set(true);
  }

  onRowSaved(values: string[]) {
    const sheetId = this.editingSheetId();
    const sectionTitle = this.editingSectionTitle();
    if (!sheetId || !sectionTitle) return;

    const currentRows = this.getSectionRows(sheetId, sectionTitle);
    const rowIndex = this.editingRowIndex();

    const updatedRows =
      rowIndex === null
        ? [...currentRows, values] // append new row
        : currentRows.map((r, i) => (i === rowIndex ? values : r)); // replace existing

    this.updateSectionRows(sheetId, sectionTitle, updatedRows);
    this.closeEditModal();
    this.showToast(rowIndex === null ? 'Fila añadida ✓' : 'Fila actualizada ✓', 'success');
  }

  async onRowDeleted() {
    const sheetId = this.editingSheetId();
    const sectionTitle = this.editingSectionTitle();
    const rowIndex = this.editingRowIndex();
    if (!sheetId || !sectionTitle || rowIndex === null) return;

    const confirm = await this.askDeleteRowConfirmation();
    if (!confirm) return;

    const updatedRows = this.getSectionRows(sheetId, sectionTitle).filter(
      (_, i) => i !== rowIndex,
    );
    this.updateSectionRows(sheetId, sectionTitle, updatedRows);
    this.closeEditModal();
    this.showToast('Fila eliminada', 'warning');
  }

  closeEditModal() {
    this.editModalOpen.set(false);
  }

  // ── Page actions ────────────────────────────────────────────────────────────

  async exportScf() {
    const filename = await this.askExportFilename();
    if (!filename) return;

    this.setLoading(true, 'Generando fichero SCF…');
    try {
      await this.globalExcelService.exportScfWorkbook(this.scfSheets(), filename);
      this.showToast('SCF exportado correctamente ✓', 'success');
    } catch (error) {
      console.error('SCF export error:', error);
      this.showToast('Error al exportar el SCF', 'danger');
    } finally {
      this.setLoading(false);
    }
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  async onFileSelected(file: File) {
    if (!file.name.toLowerCase().endsWith('.xlsx')) {
      this.showToast('Solo se aceptan ficheros .xlsx', 'danger');
      return;
    }

    this.setLoading(true, `Importando ${file.name}…`);
    try {
      const importedSheets = await this.globalExcelService.importScfWorkbook(file);
      this.scfSheets.set(importedSheets);
      this.selectedSheetId.set(importedSheets[0]?.id ?? 'DATOS_GENERALES');
      await this.persistScfState();

      const totalRows = this.countAllRows(importedSheets);
      this.showToast(`SCF importado — ${totalRows} filas cargadas ✓`, 'success');
    } catch (error) {
      console.error('SCF import error:', error);
      this.showToast('Error al importar el SCF. Comprueba el formato del fichero.', 'danger');
    } finally {
      this.setLoading(false);
    }
  }

  selectSheet(sheetId: string) {
    this.selectedSheetId.set(sheetId);
  }

  async moveActuacionesData() {
    const rows = this.globalExcelService.mapGlobalRowsToActuacionesRows(this.sourceReportRows());
    if (rows.length === 0) {
      this.showToast('No hay datos de reportes para mover', 'warning');
      return;
    }

    const currentRows = this.getSectionRows('ACTUACIONES_DIARIAS', 'ACTUACIONES_DIARIAS');

    if (currentRows.length === 0) {
      this.updateSectionRows('ACTUACIONES_DIARIAS', 'ACTUACIONES_DIARIAS', rows);
      this.showToast(`${rows.length} filas movidas a ACTUACIONES DIARIAS`, 'success');
      return;
    }

    const decision = await this.askMoveMode();
    if (decision === 'cancel') return;

    const mergedRows = decision === 'replace' ? rows : [...currentRows, ...rows];
    this.updateSectionRows('ACTUACIONES_DIARIAS', 'ACTUACIONES_DIARIAS', mergedRows);

    const actionText = decision === 'replace' ? 'reemplazadas' : 'agregadas';
    this.showToast(`${rows.length} filas ${actionText} en ACTUACIONES DIARIAS`, 'success');
  }

  async clearAllTables() {
    const confirm = await this.askClearTablesConfirmation();
    if (!confirm) return;

    this.scfSheets.set(this.globalExcelService.createScfSheetsData());
    this.selectedSheetId.set(this.scfSheets()[0]?.id ?? 'DATOS_GENERALES');
    await this.persistScfState();

    this.showToast('Tablas limpiadas. Ya puedes reimportar todo.', 'success');
  }

  sheetLabel(sheetId: string): string {
    return sheetId.replace(/_/g, ' ');
  }

  // ── Private helpers ─────────────────────────────────────────────────────────

  private updateSectionRows(sheetId: string, sectionTitle: string, rows: string[][]) {
    this.scfSheets.update((current) =>
      current.map((sheet) => {
        if (sheet.id !== sheetId) return sheet;
        return {
          ...sheet,
          sections: sheet.sections.map((section) => {
            if (section.title !== sectionTitle) return section;
            return { ...section, rows };
          }),
        };
      }),
    );
    this.persistScfState();
  }

  private getSectionRows(sheetId: string, sectionTitle: string): string[][] {
    const sheet = this.scfSheets().find((s) => s.id === sheetId);
    const section = sheet?.sections.find((s) => s.title === sectionTitle);
    return section?.rows ?? [];
  }

  private async askMoveMode(): Promise<'replace' | 'append' | 'cancel'> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header: 'ACTUACIONES DIARIAS',
        message: 'Ya existen datos en la tabla. ¿Quieres reemplazar o agregar?',
        buttons: [
          { text: 'Cancelar', role: 'cancel', handler: () => resolve('cancel') },
          { text: 'Reemplazar', role: 'destructive', handler: () => resolve('replace') },
          { text: 'Agregar', handler: () => resolve('append') },
        ],
      });
      await alert.present();
    });
  }

  private async askClearTablesConfirmation(): Promise<boolean> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header: 'Limpiar tablas',
        message: 'Se borrarán todos los datos cargados de este SCF. ¿Continuar?',
        buttons: [
          { text: 'Cancelar', role: 'cancel', handler: () => resolve(false) },
          { text: 'Limpiar', role: 'destructive', handler: () => resolve(true) },
        ],
      });
      await alert.present();
    });
  }

  private async askDeleteRowConfirmation(): Promise<boolean> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header: 'Eliminar fila',
        message: '¿Estás seguro de que quieres eliminar esta fila? Esta acción no se puede deshacer.',
        buttons: [
          { text: 'Cancelar', role: 'cancel', handler: () => resolve(false) },
          { text: 'Eliminar', role: 'destructive', handler: () => resolve(true) },
        ],
      });
      await alert.present();
    });
  }

  private async askExportFilename(): Promise<string | null> {
    const suggestedFilename = this.globalExcelService.getDefaultScfFilename();

    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header: 'Exportar SCF',
        message: 'Confirma el nombre del archivo antes de generarlo.',
        inputs: [
          {
            name: 'filename',
            type: 'text',
            value: suggestedFilename,
            placeholder: 'SCF-dd-MM-yy.xlsx',
          },
        ],
        buttons: [
          { text: 'Cancelar', role: 'cancel', handler: () => resolve(null) },
          {
            text: 'OK',
            handler: (data) => {
              const filename = (data?.filename ?? '').trim();
              if (!filename) {
                resolve(suggestedFilename);
                return;
              }
              resolve(filename.toLowerCase().endsWith('.xlsx') ? filename : `${filename}.xlsx`);
            },
          },
        ],
      });
      await alert.present();
    });
  }

  private async restoreScfState() {
    try {
      const { value } = await Preferences.get({ key: FullReportPage.SCF_STATE_KEY });
      if (!value) return;

      const parsed = JSON.parse(value) as ScfSheetData[];
      if (!Array.isArray(parsed) || parsed.length === 0) return;

      this.scfSheets.set(parsed);
      this.selectedSheetId.set(parsed[0]?.id ?? 'DATOS_GENERALES');
    } catch (error) {
      console.error('Error restoring SCF state:', error);
    }
  }

  private async persistScfState() {
    try {
      await Preferences.set({
        key: FullReportPage.SCF_STATE_KEY,
        value: JSON.stringify(this.scfSheets()),
      });
    } catch (error) {
      console.error('Error persisting SCF state:', error);
    }
  }

  private countAllRows(sheets: ScfSheetData[]): number {
    return sheets.reduce(
      (total, sheet) => total + sheet.sections.reduce((acc, s) => acc + s.rows.length, 0),
      0,
    );
  }

  private setLoading(active: boolean, message = '') {
    this.isLoading.set(active);
    this.loadingMessage.set(message);
  }

  private async showToast(message: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'bottom',
    });
    await toast.present();
  }
}
