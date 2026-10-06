# sora2nas (صورة إلى نص)

An Android app that turns photos, scans and PDFs into editable text, Word and Excel files.
Everything runs **on the device**. The internet is only used for Google Play Billing and for the
one-time download of an offline translation language (ML Kit).

English is the default UI language. Arabic (full RTL) and French can be chosen in Settings.

## Features

| Feature | What it does |
|---|---|
| **Scanner** (free, unlimited) | CameraX with autofocus, tap-to-focus and flash. OpenCV edge detection, perspective correction and draggable corners. Colour enhancement and shadow removal. Quality Normal / High / Max (default Max). Brightness, contrast and sharpness sliders. Multi-page with reorder and delete, exported as one compressed PDF (optionally searchable) or as images. ID-card mode puts front and back on one A4 page at real size. QR and barcode reader. |
| **Image to text** | Camera or gallery, one image or a batch. Tesseract (tessdata_best, ara/fra/eng) with preprocessing (denoise, background flattening, contrast, deskew) and automatic language detection. |
| **PDF to text** | Uses the PDF's text layer when it has one, otherwise OCR page by page with progress. |
| **Table to Excel/Word** | From an image or a PDF. Ruled tables via OpenCV grid detection, borderless tables via word positions. OCR per cell, preview with cell editing, export `.xlsx` or `.docx` (RTL tables supported). |
| **Result screen** | Editable text (auto-saved), big "Copy all" button, Share, export TXT or Word, Read aloud (TTS), offline translation between AR / FR / EN. |
| **History** | Room database with thumbnails and full-text search. Rename, delete, re-open. |
| **Sharing** | Accepts images and PDFs shared from other apps. |
| **Free tier** | 5 conversions per day (a batch of N images counts as N). Scanning is free and unlimited. A searchable PDF is part of the free scanner. |
| **Pro** | Monthly and yearly subscriptions through Google Play Billing, with Restore purchases. |

Handwriting recognition is **not** supported and is never promised in the UI.

Files are saved through MediaStore: images in `Pictures/sora2nas`, documents in `Documents/sora2nas`.
The only runtime permission is the camera (plus legacy storage write on Android 9 and older).

## Building

Requirements:
- Android Studio (Narwhal or newer) with JDK 17.
- Android SDK Platform 36.

```bash
./gradlew assembleDebug          # debug APK in app/build/outputs/apk/debug/
./gradlew testDebugUnitTest      # unit tests (OCR pipeline, counter, tables, exporters)
```

Tesseract4Android is published on **JitPack**. `settings.gradle.kts` already declares it, so the
build machine needs access to `https://jitpack.io`.

The OCR models (`app/src/main/assets/tessdata/*.traineddata`, about 30 MB in total) and the fonts
are bundled. Nothing is downloaded at runtime except translation languages.

### Signed release bundle (AAB)

1. Create an upload key once:
   ```bash
   keytool -genkeypair -v -keystore sora2nas-upload.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload
   ```
2. Create `keystore.properties` at the project root. Never commit it; it is already in `.gitignore`.
   ```properties
   storeFile=sora2nas-upload.jks
   storePassword=********
   keyAlias=upload
   keyPassword=********
   ```
3. Build the bundle:
   ```bash
   ./gradlew bundleRelease
   ```
   The bundle is written to `app/build/outputs/bundle/release/app-release.aab`.
4. Upload it in Play Console and enrol in **Play App Signing**.

Alternatively, in Android Studio use *Build > Generate Signed App Bundle*.

Release builds use R8 with resource shrinking. `app/proguard-rules.pro` keeps the Tesseract, OpenCV
and PdfBox classes that are reached from native code or by reflection.

## Google Play Console: subscriptions

The app expects two subscription products. The IDs must match `BillingRepository.kt`.

| Product ID | Base plan | Billing period |
|---|---|---|
| `sora2nas_pro_monthly` | e.g. `monthly` | 1 month, auto-renewing |
| `sora2nas_pro_yearly` | e.g. `yearly` | 1 year, auto-renewing |

Steps:
1. Upload a signed build to a testing track (internal testing is enough). Billing products can only
   be created once the app has a build with the `com.android.vending.BILLING` permission, which the
   Billing library adds automatically.
2. Go to **Monetize > Products > Subscriptions** and create both subscriptions with the IDs above.
3. For each subscription add one **auto-renewing base plan**, set prices for your countries and
   **activate** it. An optional free-trial offer works too, because the app shows the recurring price.
4. Add tester accounts under **Settings > License testing**. Test purchases then renew quickly and
   are not charged.
5. Install the app from the testing track with a tester account. Use Paywall > Subscribe, then
   Settings > Restore purchases.

The paywall shows the yearly saving percentage, computed from the two prices.
The Pro state is cached on the device and trusted for 7 days offline.

## Architecture

```
app/src/main/java/com/sora2nas/app/
├── core/        Pure Kotlin, unit-tested: ConversionLimiter, TextCleaner, LanguageDetector,
│                OcrPipeline, table builders, XLSX/DOCX writers
├── imaging/     OpenCV: document detection, perspective, enhancement, OCR preprocessing,
│                table grid detection, ID-card composer
├── pdf/         PDF writer (compressed JPEG + invisible text layer), PDF text-layer reader
├── platform/    Android adapters: Tesseract engine, PDF renderer, ML Kit translator, TTS, image IO
├── data/        Room history (FTS4), DataStore settings, encrypted usage counter, MediaStore saver
├── billing/     Play Billing v8
├── scan/        Scan session and page processing
└── ui/          Jetpack Compose screens (MVVM + Hilt), navigation, theme
```

- **MVVM**: one `@HiltViewModel` per screen exposes `StateFlow` UI state. Heavy work runs on
  `Dispatchers.Default` / `IO`.
- **Daily counter**: `ConversionLimiter` is stored in EncryptedSharedPreferences. It resets at local
  midnight. Moving the clock backwards by more than 10 minutes does not reset the quota.
- **Searchable PDF**: each page is a compressed JPEG with invisible text (`RenderingMode.NEITHER`)
  placed over every word. Arabic words are written in visual order so PDF viewers return the
  correct logical text.

## Verification

### Unit tests

Run with `./gradlew testDebugUnitTest`:
- `ConversionLimiterTest`: daily limit, batches, midnight reset, clock rollback.
- `TextCleanerTest`, `LanguageDetectorTest`, `OcrPipelineTest`: OCR pipeline with a fake engine.
- `TableBuildersTest`, `OoxmlWritersTest`.

### JVM integration harness

`tools/jvm-verify` runs the real imaging, OCR, table and PDF code on the desktop JVM, against real
OpenCV and the real Tesseract with the bundled models. It needs the `tesseract` CLI to be installed.

```bash
cd tools/jvm-verify && gradle test
```

### What was verified, and what was not

The project was developed in a sandbox without the Android SDK or Google's Maven repository.

**Verified there:**
- The core logic (pure Kotlin) passes all 37 unit tests.
- Real OpenCV and the real Tesseract with the bundled models ran on the JVM:
  - Document corners were detected within 6 px.
  - Shadows were removed with paper at 246–250 brightness, and colour was preserved.
  - Deskew was accurate to ±0.6°.
  - OCR character error rate: French 0 %, English 0 %, Arabic 2.7 %. The language was detected automatically.
  - Ruled French, ruled Arabic (RTL) and borderless tables were rebuilt with 100 % correct cells.
  - The `.xlsx` and `.docx` files open in openpyxl, python-docx and LibreOffice, including RTL.
  - The searchable PDF is searchable in Arabic and French (checked with `pdftotext`). A one-page scan is about 74 KB.
- All Kotlin sources were type-checked against the Android 16 framework classes and desktop
  builds of Compose. The only errors left come from libraries that were not available in the
  sandbox (CameraX, Room, Billing, ML Kit, DataStore, Navigation, AppCompat). There were no
  errors in any file that does not use them.

**Not verified there (needs one Android Studio build and a device):**
- The full Gradle Android build.
- The UI on a device.
- Camera capture.
- Play Billing purchases.
- Text-to-speech.
- ML Kit translation and barcode scanning.
- The Tesseract4Android JNI calls, which were checked against the library's public API only.

Please run `./gradlew assembleDebug` and the manual test list below once on a real phone.

### Manual test list (device)

1. **Home.** The app opens in English. Switch to Arabic in Settings and check that the layout flips to RTL, then try French.
2. **Scanner.**
   - Check that the edges are detected and the corners can be dragged.
   - Try the flash and tap-to-focus.
   - Scan 3 pages, reorder them and delete one.
   - Save a PDF and check that it appears in `Documents/sora2nas`.
   - Turn on the searchable PDF option and search a word in a PDF reader.
3. **ID card.** Scan the front, then the back. Check that you get one A4 page.
4. **QR / barcode.** Check that the code is read and that Copy and Open work.
5. **Image to text.** Use the camera, then a batch of 3 images from the gallery.
   - Check that Copy all shows a toast and that Share works.
   - Export TXT and Word.
   - Use Read aloud.
   - Translate (the language downloads the first time), then switch back to the original.
6. **PDF to text.** Try a text PDF (instant) and a scanned PDF (shows page-by-page progress).
7. **Table.** Try a photo of a ruled table and a PDF table.
   - Edit a cell.
   - Export XLSX and DOCX and open them in Excel and Word.
8. **History.** Search for a word inside a text, then rename, delete and re-open items.
9. **Share in.** Share an image and a PDF from the gallery or a file manager to sora2nas.
10. **Free limit.**
    - After 5 conversions the paywall appears.
    - Scanning still works.
    - Moving the clock back does not reset the counter.
11. **Billing.** Using a license tester account, buy the monthly plan, then use Restore purchases.


## Licences

- Tesseract OCR and tessdata_best: Apache 2.0.
- Tesseract4Android: Apache 2.0.
- OpenCV: Apache 2.0.
- PdfBox-Android: Apache 2.0.
- ML Kit: Google APIs terms.
- Noto Sans, Noto Sans Arabic and Tajawal fonts: SIL Open Font License 1.1.
