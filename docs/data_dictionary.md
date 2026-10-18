# JomiTech (জমিটেক) — Data Dictionary & Entity Schema

> **ডেমো ডেটা ঘোষণা / Demo Data Notice:**
> এই সিস্টেমের সমস্ত পার্সেল, দাগ, খতিয়ান, দলিল ও ব্যক্তি সম্পর্কিত তথ্য সম্পূর্ণ কাল্পনিক ও পরীক্ষামূলক সিন্থেটিক ডেটা। কোনো সরকারি সার্ভার স্ক্র্যাপ করা হয়নি বা কোনো জীবিত ব্যক্তির তথ্য ব্যবহার করা হয়নি।

---

## 1. Administrative Areas (`administrative_areas`)
সংরক্ষিত ভৌগোলিক ও প্রশাসনিক সীমানা কাঠামো।

| Column Name | Data Type | Nullable | Description & Constraints |
|:---|:---|:---|:---|
| `id` | VARCHAR(50) | No (PK) | Administrative boundary unique key (e.g. `ADM-DH-TJ`) |
| `division` | VARCHAR(50) | No | Division in English (e.g. `Dhaka`) |
| `division_bn` | VARCHAR(100) | No | Division in Bengali (e.g. `ঢাকা`) |
| `district` | VARCHAR(50) | No | District in English (e.g. `Dhaka`) |
| `district_bn` | VARCHAR(100) | No | District in Bengali (e.g. `ঢাকা`) |
| `upazila` | VARCHAR(50) | No | Upazila or Thana in English (e.g. `Tejgaon`) |
| `upazila_bn` | VARCHAR(100) | No | Upazila or Thana in Bengali (e.g. `তেজগাঁও`) |
| `mouza` | VARCHAR(100) | No | Mouza name in English (e.g. `Tejgaon`) |
| `mouza_bn` | VARCHAR(150) | No | Mouza name in Bengali (e.g. `তেজগাঁও`) |
| `jl_no` | VARCHAR(20) | No | Jurisdiction List (J.L.) number (e.g. `24`) |
| `created_at` | DATETIME | No | Row creation timestamp |

---

## 2. Land Parcels (`land_parcels`)
ক্যাডাস্ট্রাল প্লট ও পার্সেল পরিচিতি।

| Column Name | Data Type | Nullable | Description & Constraints |
|:---|:---|:---|:---|
| `id` | VARCHAR(50) | No (PK) | Canonical parcel ID (e.g. `PCL-DH-101`) |
| `synthetic_id` | VARCHAR(50) | No (Unique) | Synthetic public tracking identifier |
| `area_recorded` | FLOAT | No | Recorded total area in specified unit |
| `area_unit` | VARCHAR(20) | No | Unit (`decimal`, `acre`, `katha`) |
| `land_class` | VARCHAR(50) | No | Land classification (`নাল / Agricultural`, `ভিটি / Residential`, `বাণিজ্যিক / Commercial`) |
| `survey_type` | VARCHAR(10) | No | Latest official survey (`BS`, `RS`, `SA`, `CS`) |
| `dag_no` | VARCHAR(30) | No | Latest dag (plot) number |
| `dag_no_bn` | VARCHAR(50) | Yes | Bengali dag representation (e.g. `১২৪`) |
| `khatian_no` | VARCHAR(30) | No | Latest recorded khatian number |
| `khatian_no_bn` | VARCHAR(50) | Yes | Bengali khatian representation (e.g. `৮৯`) |
| `administrative_area_id`| VARCHAR(50) | No (FK) | Reference to `administrative_areas.id` |
| `polygon_geojson` | TEXT | Yes | Simulated spatial boundaries GeoJSON |
| `status` | VARCHAR(20) | No | Operational lifecycle state (`ACTIVE`, `DISPUTED`, `RESTRICTED`) |

---

## 3. Khatians (`khatian_records`) & Lineage
ঐতিহাসিক জরিপ খতিয়ান রেকর্ড (CS → SA → RS → BS)।

| Column Name | Data Type | Nullable | Description & Constraints |
|:---|:---|:---|:---|
| `id` | VARCHAR(50) | No (PK) | Khatian ID (e.g. `KHT-BS-101`) |
| `parcel_id` | VARCHAR(50) | No (FK) | Reference to `land_parcels.id` |
| `survey_type` | VARCHAR(10) | No | Survey level (`CS`, `SA`, `RS`, `BS`) |
| `khatian_no` | VARCHAR(30) | No | Recorded khatian number |
| `predecessor_khatian_id`| VARCHAR(50) | Yes (FK) | Explicit link to historical ancestor khatian in chain |
| `volume_no` | VARCHAR(30) | Yes | Sub-Registry record volume number |
| `page_no` | VARCHAR(30) | Yes | Registry volume page number |
| `effective_year` | INTEGER | Yes | Survey gazette/recording year |
| `provenance_type` | VARCHAR(30) | No | Provenance status (`APPROVED_ARCHIVE`, `PROVISIONAL`, `OCR_EXTRACTED`) |

---

## 4. Deeds & Transfers (`deeds`, `ownership_history`)
রেজিস্ট্রিকৃত সাব-কবলা, হেবা বা দান দলিল ও হস্তান্তর ইতিহাস।

| Column Name | Data Type | Nullable | Description & Constraints |
|:---|:---|:---|:---|
| `id` | VARCHAR(50) | No (PK) | Deed identifier (e.g. `DEED-2024-1842`) |
| `parcel_id` | VARCHAR(50) | No (FK) | Reference to `land_parcels.id` |
| `deed_no` | VARCHAR(50) | No | Registered deed number |
| `deed_year` | INTEGER | No | Execution calendar year |
| `deed_type` | VARCHAR(30) | No | Instrument type (`SAF_KABALA`, `HEBA`, `PARTITION`, `MORTGAGE`) |
| `seller_id` | VARCHAR(50) | Yes (FK) | Seller owner reference |
| `buyer_id` | VARCHAR(50) | Yes (FK) | Buyer owner reference |
| `transferred_area` | FLOAT | No | Area conveyed in transaction |
| `transferred_share` | FLOAT | No | Fraction of plot conveyed (0.0000 to 1.0000) |
| `execution_date` | DATE | No | Date of deed registration |
| `document_sha256` | VARCHAR(64) | Yes | Exact byte-level SHA-256 hash of instrument scan |
| `status` | VARCHAR(20) | No | State (`MUTATED`, `REGISTERED_UNMUTATED`, `CANCELLED`) |

---

## 5. Simulated Mutation Cases (`mutation_cases`, `mutation_events`)
ই-নামজারি রাজ্যযন্ত্র (State Machine) ও কার্যবিবরণী।

| Column Name | Data Type | Nullable | Description & Constraints |
|:---|:---|:---|:---|
| `id` | VARCHAR(50) | No (PK) | Case unique key (e.g. `MUT-2024-9912`) |
| `case_no` | VARCHAR(50) | No | Official case code (`MUT-2024-XXXX`) |
| `case_no_bn` | VARCHAR(80) | No | Bengali case code (`নামজারি-২০২৪-XXXX`) |
| `opaque_reference` | VARCHAR(64) | No (Unique) | Zero-PII public lookup token (`mut-ref-XXXXXXXXXX`) |
| `parcel_id` | VARCHAR(50) | No (FK) | Linked parcel identifier |
| `applicant_name` | VARCHAR(100) | No | Simulated applicant name (restricted from public tracker) |
| `applicant_nid` | VARCHAR(30) | Yes | Simulated 10/17-digit national ID (restricted from public tracker) |
| `status` | VARCHAR(30) | No | Stage: `SUBMITTED`, `FIELD_INVESTIGATION`, `HEARING_SCHEDULED`, `OFFICER_REVIEW`, `APPROVED`, `REJECTED` |

---

## 6. Cryptographic Receipts (`verification_receipts`)
এড২৫৫১৯ ডিজিটাল স্বাক্ষর ও জিরো-পিআইআই পাবলিক রিসিপ্ট।

| Column Name | Data Type | Nullable | Description & Constraints |
|:---|:---|:---|:---|
| `id` | VARCHAR(50) | No (PK) | Receipt ID (e.g. `RCPT-73FA8109`) |
| `opaque_id` | VARCHAR(64) | No (Unique) | Public QR reference URL token (`rcpt-synth-001`) |
| `document_id` | VARCHAR(50) | Yes (FK) | Reference to ingested document |
| `document_sha256` | VARCHAR(64) | No | Exact byte hash (SHA-256) |
| `ed25519_signature`| TEXT | No | Hex-encoded Ed25519 cryptographic signature |
| `key_id` | VARCHAR(50) | No | Public verification key identifier (`ed25519-jomitech-2026-v1`) |
| `status` | VARCHAR(20) | No | Status (`VALID`, `REVOKED`, `EXPIRED`, `TAMPERED`) |
| `issued_at` | DATETIME | No | Timestamp of issuance |

---

## 7. Explainable Risk Intelligence (`risk_assessments`, `risk_findings`)
১৫টি বিধিবদ্ধ প্রতারণা ও অসঙ্গতি বিশ্লেষণ ফলাফল।

| Rule Code | Severity | Score Weight | Description |
|:---|:---|:---|:---|
| `POSSIBLE_DOUBLE_SALE` | HIGH | +40 | সমাপতিত দাগে একই অংশের একাধিক সক্রিয় হস্তান্তর |
| `SELLER_MISMATCH` | HIGH | +35 | বিক্রেতা ও সর্বশেষ রেকর্ডীয় মালিকের তথ্যে গরমিল |
| `DUPLICATE_DEED` | HIGH | +30 | একই দলিল নম্বর বা হ্যাশের ডুপ্লিকেট অস্তিত্ব |
| `AREA_OR_SHARE_EXCEEDED` | HIGH | +35 | প্রাপ্য হিস্যার অতিরিক্ত জমি হস্তান্তর |
| `REGISTERED_NOT_MUTATED`| MEDIUM | +20 | দলিল রেজিস্ট্রি হলেও সময়মতো নামজারি স্থগিত |
| `MUTATION_PARTY_MISMATCH`| MEDIUM | +25 | নামজারি আবেদনকারী ও দলিলের ক্রেতার তথ্যে অমিল |
| `REGISTRATION_MUTATION_MISMATCH`| MEDIUM | +20 | রেজিস্ট্রি ও নামজারি রেকর্ডের তফসিলে অসঙ্গতি |
| `RAPID_RESALE` | MEDIUM | +15 | অস্বাভাবিক স্বল্প সময়ে দ্রুত পুনঃবিক্রয় |
| `IMPOSSIBLE_DATE` | HIGH | +30 | কালানুক্রমিক অসঙ্গতি বা ভবিষ্যৎ দলিল তারিখ |
| `DEED_NO_FORMAT_INVALID`| LOW | +10 | দলিল নম্বর বিন্যাসে ত্রুটি |
| `SURVEY_CHAIN_GAP` | MEDIUM | +20 | সিএস-এসএ-আরএস-বিএস শৃঙ্খলে লিঙ্কের অনুপস্থিতি |
| `ACTIVE_DISPUTE` | HIGH | +35 | সক্রিয় দেওয়ানি মামলা বা নিষেধাজ্ঞা নোটিশ |
| `KHAS_INDICATOR` | HIGH | +40 | সরকারি খাস, অর্পিত বা পরিত্যক্ত জমি তফসিল |
| `ACQUISITION_INDICATOR` | HIGH | +40 | জেলা প্রশাসক কর্তৃক ভূমি অধিগ্রহণ প্রক্রিয়াধীন |
| `LOW_OCR_CONFIDENCE` | MEDIUM | +20 | ওসিআর পাঠোদ্ধারে কনফিডেন্স <৮৫% |
