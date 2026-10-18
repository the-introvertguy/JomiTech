# JomiTech (জমিটেক) — Architecture Decisions & Design Record (docs/decisions.md)

**Document Version:** 1.0.0  
**Date:** 2026-10-18  
**Context:** LandTech 2026 Hackathon Prototype  
**Scope:** Architecture, Security, Data Models, AI/OCR Provider Interface, Risk Intelligence Engine (P3), Simulated Mutation (P4), Verification (P2), and Buyer Reports (P5).

---

## 1. Executive Summary & Mission
JomiTech (জমিটেক) is an explainable civic intelligence prototype engineered to address land-record discrepancies, fraud patterns, and title risks in Bangladesh—most notably **P3: Catch Fraud & Double-Selling**. 

JomiTech does **not** assert legal title, certify ownership, or replace official land registrars or courts. Every record, parcel, deed, mutation case, and person in this prototype is **100% synthetic demo data**. All risk findings provide explainable, evidence-backed indicators designed to guide citizen diligence and officer review.

---

## 2. Architecture Decision Records (ADRs)

### ADR-001: Backend & Frontend Decoupled Architecture
- **Decision:** Build a high-performance Python 3.11+ **FastAPI** backend paired with a **Next.js (App Router)** TypeScript frontend.
- **Rationale:** 
  - FastAPI provides native Pydantic v2 validation, OpenAPI/Swagger documentation, fast asynchronous I/O, and seamless integration with Python's data analysis, cryptographic (`cryptography`), and OCR/CV ecosystem.
  - Next.js provides server-side rendering, client-side caching, first-class internationalization (Bangla-first `bn` + `en`), and modular component architectures.
- **Consequences:** Backend serves API under `/api/v1` with strict CORS and security headers; frontend communicates via typed client SDK.

### ADR-002: Bangla-First Routing & Global Accessibility System
- **Decision:** Default route is Bangla (`/bn` or root redirected to `/bn`), with English (`/en`) as a complete secondary locale.
- **Rationale:** The target civic demographic in Bangladesh requires immediate, natural Bangla phrasing (using official land administration terminology: খতিয়ান, দাগ, মৌজা, খারিজ/নামজারি, দলিলের নকল).
- **Accessibility:** 
  - Persistent global font size (`small`, `default`, `large`, `xlarge`) stored in client storage.
  - Dual numeral preference: Bangla numerals (১২৩৪৫৬৭৮৯০) vs English numerals (1234567890).
  - Forest/pine green civic palette with WCAG AA compliance. Never convey status by color alone (always icon + text + badge).

### ADR-003: Deterministic Rule Engine for P3 (No Black-Box Scoring)
- **Decision:** Implement fraud and risk checks as deterministic, versioned, unit-tested Python functions before any machine learning hints.
- **Rationale:** Citizens and officers must know *why* a risk alert fired. Probabilistic black-box models or generative AI hallucinations can falsely accuse citizens or miss known edge cases.
- **Engine Rules:**
  1. `POSSIBLE_DOUBLE_SALE`: Conflicting active transfers for same parcel or overlapping shares.
  2. `SELLER_MISMATCH`: Seller is not the reviewed, recorded holder on transaction date.
  3. `DUPLICATE_DEED`: Duplicate deed registration reference or identical cryptographic file hash.
  4. `AREA_OR_SHARE_EXCEEDED`: Cumulative transfer exceeds parcel area or vendor's verified fraction.
  5. `REGISTERED_NOT_MUTATED`: Registered transfer lacking corresponding mutation within the review window.
  6. `MUTATION_PARTY_MISMATCH`: Applicant identity diverges from deed buyer.
  7. `REGISTRATION_MUTATION_MISMATCH`: Discrepancy between mutation record and underlying deed.
  8. `RAPID_RESALE`: Abnormally rapid re-conveyance interval flag.
  9. `IMPOSSIBLE_DATE` / `DEED_NO_FORMAT_INVALID`: Logical date or reference syntax defects.
  10. `SURVEY_CHAIN_GAP`: Gap in CS → SA → RS → BS lineage chain.
  11. `ACTIVE_DISPUTE` / `KHAS_INDICATOR` / `ACQUISITION_INDICATOR`: Explicit synthetic legal flags.
  12. `LOW_OCR_CONFIDENCE`: Automated extraction uncertainty requiring manual human review.
- **Score Scale:** 0–19 (LOW), 20–49 (MEDIUM), 50+ (HIGH - Priority Review).

### ADR-004: Pluggable OCR & Extraction Provider Interface
- **Decision:** Create an abstract `BaseOCRProvider` and `BaseExtractor` interface:
  - `TesseractOCRProvider`: Integrates with Tesseract OCR (`ben+eng`) if installed.
  - `DeterministicExtractor`: Heuristic and regex extractor parsing normalized Bengali/English dates, khatians, dags, and area measurements.
  - `SyntheticFixtureProvider`: Fallback provider for automated testing and deterministic demo runs.
  - `LLMExtractor`: Optional provider behind a feature flag for structured JSON schema extraction.
- **Rule of Truthfulness:** When Tesseract or external engines are unavailable, report structured errors (`ocr_engine_unavailable`); never silently fabricate OCR results.

### ADR-005: Cryptographic Integrity Receipts (No Blockchain)
- **Decision:** Document integrity is proven using server-side **SHA-256** content hashing and **Ed25519** digital signatures over canonical receipt payloads.
- **Rationale:** Avoids superficial blockchain overhead while providing genuine cryptographic non-repudiation, instantaneous verification, and tamper detection.
- **QR Privacy:** The QR code encodes only a random opaque verification URI (e.g., `/public/verify/{opaque_id}`), never personal names, NIDs, or confidential parcel notes.

### ADR-006: Human-in-the-Loop Document Review Pipeline
- **Decision:** Extracted OCR data is never indexed directly into searchable parcel records without explicit human review.
- **Pipeline:** Upload → Byte Validation & SHA-256 → Private Storage → OCR Job → Extraction → Review Queue (`PENDING_REVIEW`) → Officer Reviewer approves/edits/rejects → Approved Data updates parcel timeline & risk assessments.

### ADR-007: Simulated e-Mutation Lifecycle (P4)
- **Decision:** A strict state machine for simulated mutations:
  `DRAFT` → `SUBMITTED` → `DOCUMENT_CHECK` → `OFFICER_REVIEW` → `HEARING` (optional) → `DECISION_RECORDED` → `COMPLETED` / `REJECTED` / `NEEDS_CORRECTION`.
- **Privacy & Safety:** All screens and outputs carry the mandatory notice: *"Simulation only — not submitted to a government office."* Public mutation tracker exposes only stage, date, and generic office designation.

### ADR-008: Role-Based Access Control (RBAC) & Default-Deny
- **Decision:** Five distinct roles enforced on all backend API routes:
  1. `citizen`: Search parcels, view public buyer report, verify QR receipts, track mutation status.
  2. `data_entry`: Upload documents, trigger extraction jobs.
  3. `reviewer`: Inspect OCR extractions side-by-side, correct fields, approve or reject jobs.
  4. `officer`: Manage simulated mutation cases, update case checklists, record decisions.
  5. `admin`: User/role management, risk rule weight configuration, system audit logs.

### ADR-009: Database Engine & Provenance Architecture
- **Decision:** SQLAlchemy 2.0 with async/sync SQLite for self-contained, zero-dependency demo execution, with full PostgreSQL-compatible DDL schema.
- **Immutable Provenance:** Ownership states, transactions, and audit events are append-only. Historical ownership records are preserved across CS, SA, RS, and BS survey milestones.

### ADR-010: Bilingual "Check Before You Buy" A4 Report (P5)
- **Decision:** Web and print-optimized bilingual diligence report.
- **Components:** Parcel identifiers, historical chain of title, document integrity status, active risk alerts with evidence, explicitly identified *Missing/Unknown Information*, recommended official diligence steps, and prominent civic disclaimer.

---

## 3. Threat Model & Security Posture

| Threat | Impact | Mitigation Strategy |
|---|---|---|
| **Malicious File Upload** | Remote Code Execution, DoS | Validate MIME by magic bytes, enforce 10MB size limit, restrict to PDF/PNG/JPEG, randomize storage keys on disk, never serve uploads directly from public web directory. |
| **Insecure Direct Object Reference (IDOR)** | Unauthorized view of drafts or private notes | Default-deny RBAC on all `/api/v1` routes; verify role and ownership before returning internal extraction or officer logs. |
| **Privilege Escalation** | Regular user accessing review/admin queue | JWT tokens signed server-side with role claims verified on every request; demo account switcher only enabled in non-production environments. |
| **Tampered Document Copy** | Forged deed presented as original | Client can upload copy to `/documents/{id}/verify-copy`; backend recomputes SHA-256 and compares to approved hash. Mismatch flagged as "No exact match". |
| **QR Code Scraping / Enumeration** | Citizen privacy leak | QR codes use UUIDv4/opaque keys; public response contains zero PII (no owner names, NIDs, or contact info), only cryptographic validity and issue date. |
| **False-Positive Defamation** | Unjustly flagging legitimate sellers | Findings are worded neutrally as discrepancies ("রেকর্ড যাচাই প্রয়োজন"), never labelling persons as "fraudulent". Multi-owner partial shares are explicitly recognized to prevent false double-sale flags. |

---

## 4. Deterministic Synthetic Fixture Catalog (12 Required Scenarios)

1. **SCEN-01 (Clean Chain):** Mouza Tejgaon, CS Dag 101 → SA Dag 205 → RS Dag 410 → BS Dag 815. Continuous single-owner transfer with valid mutation. **Risk: LOW (Score 0).**
2. **SCEN-02 (Possible Double-Sale):** Vendor sells 100% share of RS Dag 502 to Buyer A, and 15 days later sells the same RS Dag 502 to Buyer B. **Risk: HIGH (`POSSIBLE_DOUBLE_SALE`, Score 65).**
3. **SCEN-03 (Seller Mismatch):** Vendor claims ownership of Dag 703, but latest reviewed RS Khatian lists a different deceased or non-consenting owner. **Risk: HIGH (`SELLER_MISMATCH`, Score 55).**
4. **SCEN-04 (Duplicate Deed):** Deed No. 1234/2024 registered with identical file hash or deed reference in two separate transactions. **Risk: HIGH (`DUPLICATE_DEED`, Score 70).**
5. **SCEN-05 (Area/Share Exceeded):** Vendor owns 0.2500 (4 ana / 25%) share in Dag 901, but deeds 0.5000 (50%) share. **Risk: HIGH (`AREA_OR_SHARE_EXCEEDED`, Score 60).**
6. **SCEN-06 (Registered Not Mutated):** Deed registered 18 months ago, but no mutation case or khatian update exists on file. **Risk: MEDIUM (`REGISTERED_NOT_MUTATED`, Score 25).**
7. **SCEN-07 (Mutation Party Mismatch):** Mutation Case #M-9912 filed by party "Kamal Hossain" citing Deed #5541, but Deed #5541 records buyer as "Rahim Uddin". **Risk: MEDIUM (`MUTATION_PARTY_MISMATCH`, Score 35).**
8. **SCEN-08 (Impossible Date / Invalid Ref):** Deed lists execution date in the future or prior to predecessor survey year. **Risk: MEDIUM (`IMPOSSIBLE_DATE`, Score 30).**
9. **SCEN-09 (Khas / Vested / Acquisition Flag):** Parcel Dag 401 flagged with synthetic Government Khas / Acquisition notice. **Risk: HIGH (`KHAS_INDICATOR`, `ACQUISITION_INDICATOR`, Score 80).**
10. **SCEN-10 (Survey Chain Gap):** BS Khatian 334 references non-existent RS Khatian predecessor link. **Risk: MEDIUM (`SURVEY_CHAIN_GAP`, Score 25).**
11. **SCEN-11 (Low OCR Confidence):** Synthetic deed scan with heavy noise/distortion resulting in average field confidence < 0.80. **Risk: MEDIUM (`LOW_OCR_CONFIDENCE`, Score 20), requires mandatory human review.**
12. **SCEN-12 (Valid Co-Ownership & Partial Transfer):** Three heirs hold 0.3333 share each; Heir 1 sells 0.1666 share. Clean transaction that **must not trigger false double-sale or over-transfer**. **Risk: LOW (Score 0).**
