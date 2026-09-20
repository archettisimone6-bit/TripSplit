# TripSplit

TripSplit is a portfolio-ready iPhone app that makes shared travel spending simple: friends can record expenses, scan receipts, see who owes whom, and keep the trip ledger available across devices without losing access when connectivity drops.

## Features

- **SwiftUI UI** — Native create/join onboarding, trip dashboards, expense history, balances, and settle-up flows.
- **Receipt capture and OCR** — Camera and photo-library receipt capture with VisionKit and Vision text recognition to suggest merchant names and totals while keeping every field editable.
- **Balance and settlement logic** — Equal-split allocation, per-person balances, and a settlement engine that reduces debts into a short list of suggested transfers.
- **CloudKit sync with offline support** — SwiftData persists the trip locally and uses an automatic CloudKit-backed model container when available, with a local-store fallback so the app remains usable offline.
- **Push notifications and background updates** — The project enables push notifications and the remote-notification background mode for CloudKit-driven updates after signing and container setup.

## Architecture Overview

TripSplit follows an MVVM-oriented structure that keeps the interface, domain data, and app logic separated:

- **Model** — SwiftData entities in `TripSplit/Models` represent trips, participants, expenses, and split allocations.
- **View** — SwiftUI screens in `TripSplit/Views` render onboarding, dashboards, expense entry, receipt scanning, and reusable design components.
- **ViewModel and service layer** — View-owned observable state coordinates focused services in `TripSplit/Services` for balance calculation, OCR, demo data, and CloudKit account status. This keeps calculation and framework-heavy work outside the visual components.

At launch, `TripSplitApp` creates a SwiftData `ModelContainer` configured with `cloudKitDatabase: .automatic`. SwiftData writes to the local persistent store first and mirrors compatible changes through CloudKit. If the CloudKit-backed container cannot initialize, the app falls back to a local-only configuration. The Xcode target includes iCloud, push notification, and remote background notification capabilities so CloudKit can deliver database changes once the developer team and production container are configured.

## Tech Stack

- Swift
- SwiftUI
- SwiftData
- Vision and VisionKit
- CloudKit
- XCTest

## Project Structure

```text
TripSplit/
├── TripSplit/                 App source
│   ├── Models/                SwiftData entities
│   ├── Services/              OCR, balances, demo data, cloud status
│   ├── Views/                 SwiftUI screens and components
│   └── Resources/             Asset catalog
├── TripSplitTests/            Balance and settlement unit tests
├── TripSplit.xcodeproj/       Xcode project
├── CASE_STUDY.md              Portfolio case study
└── TripSplit_Xcode_Setup.md   Setup and CloudKit guide
```

## Run Locally

1. Install Xcode 16 or newer.
2. Open `TripSplit.xcodeproj`.
3. Select the `TripSplit` scheme and an iPhone simulator.
4. Choose your Apple development team and replace the placeholder bundle identifier.
5. Press Run.

See `TripSplit_Xcode_Setup.md` for CloudKit container and signing instructions.

## Status

The app is built and the source is complete. It is pending Xcode simulator verification, plus CloudKit container activation with an Apple Developer account.

## License

TripSplit is available under the MIT License. See `LICENSE` for details.

## Other projects in this repository

- **`hr-platform/`** — TripSplit HR, a separate Next.js + Prisma web app
  for tracking job applications and hiring pipelines. See
  [`hr-platform/README.md`](hr-platform/README.md) for details. It shares
  no code with the iOS app above.
