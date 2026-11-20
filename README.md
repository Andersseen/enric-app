# Fauna Tech

Mobile app for wildlife control at an airport (runway, perimeter and traps). Field staff record
sightings and actions step by step, and the app produces the Excel files the client delivers,
including the official **SCF** workbook.

Built with Angular 22 (standalone, signals, zoneless), Ionic 9 and Capacitor 8 (Android).
All data is stored on the device (Capacitor Preferences and Filesystem); there is no backend.

## Main features

- **Actuación**, **Trampas** and **Prevención** (runway, perimeter, dog review, marking flight,
  PPOAM) step-by-step records, plus **No actividad** for zones without sightings.
- **Mis Reportes**: table of saved records, Excel export/import, backups.
- **Reporte SCF**: the full SCF workbook (all sheets), import an existing SCF, move the records
  into `ACTUACIONES DIARIAS` and export it.
- Workers, falcons and dogs are managed from the home screen.
- **Spanish and Catalan** UI ([Etyma](https://github.com/Andersseen/etyma)), chosen on the home
  screen and remembered. Stored values and Excel/SCF headers always stay in Spanish.

## Development

```bash
pnpm install
pnpm start                 # http://localhost:4200
pnpm test                  # unit tests (Vitest)
pnpm run i18n:validate     # check that es.json and ca.json match
pnpm run build
```

Translations live in `src/i18n/` (`es.json` is the source, `ca.json` is loaded on demand).
Option labels map the stored Spanish value to a translation key in `src/i18n/options.ts`.

## Android

The native Android project lives in `android/` and is committed to git (Capacitor recommends this):
permissions, icons and version live there. Build outputs, `local.properties` and the copied web
assets are ignored by `android/.gitignore`. Never commit a signing keystore.

Requirements: Android Studio (SDK + emulator) and **JDK 21** (Capacitor 8 plugins compile with
Java 21; the JDK bundled with Android Studio may be newer). On macOS: `brew install openjdk@21`.

```bash
export JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home
pnpm run android:apk        # debug APK in android/app/build/outputs/apk/debug/
```

After changing web code, `npx cap sync android` copies the build into the native project.
App icons are generated from `assets/` with `npx capacitor-assets generate --android`.

### Release APK (signed)

**Always sign with the same key as the app already installed on the phones**, otherwise Android
refuses the update and the app has to be uninstalled (losing all local data).

The installed app is signed with the original key `android/original-debug.keystore` (the Android
Studio debug key created on 18/01/2026). Keystores and `keystore*.properties` are git-ignored, so
**keep a backup of that file outside the repo**; without it the app can never be updated in place.

1. `android/keystore.properties` (see `keystore.properties.example`) must point to that key:
   `storeFile=original-debug.keystore`, `keyAlias=androiddebugkey`, passwords `android`.
2. Bump `versionCode`/`versionName` in `android/app/build.gradle`.
3. Build: `pnpm run android:apk:prod` (with JDK 21) →
   `android/app/build/outputs/apk/release/app-release.apk`.
4. Users install the new APK over the old one; their data is kept.
