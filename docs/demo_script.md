# JomiTech (জমিটেক) — 3-Minute Hackathon Demo Script

> **LandTech 2026 Presentation Guide**  
> Total Runtime: 3 Minutes (180 Seconds)  
> Target Audience: Hackathon Judges, Civic Technologists & Land Administration Officials  

---

## ⏱️ Minute 0:00 – 0:30: The Problem & The Bangla-First Civic Interface

**Speaker (Say):**
> "আসসালামু আলাইকুম। বাংলাদেশে জমি কেনাবেচার ক্ষেত্রে সবচেয়ে বড় উদ্বেগ হলো জাল দলিল, গোপন দ্বৈত বিক্রয় (Double-Selling) এবং নামজারির জটিলতা।
> আমরা উপস্থাপন করছি **জমিটেক (JomiTech)** — বাংলাদেশের ভূমি রেকর্ড যাচাই ও ব্যাখ্যাযোগ্য ঝুঁকি গোয়েন্দা ব্যবস্থা।"

**Actions on Screen:**
1. Open homepage: `http://localhost:3000/bn`
2. Point out:
   - Original cadastral polygon logo and forest pine civic palette.
   - Persistent civic disclaimer badge: *"ডেমো ডেটা — সরকারি রেকর্ড নয়"*.
   - Live font scaler (`Small` → `Extra Large`) and numerals toggle (`১২৩৪৫` ↔ `12345`).
   - Seamless English toggle (`/en`) to show complete secondary bilingual localization.

---

## ⏱️ Minute 0:30 – 1:15: P3 — Catch Fraud & Double-Selling in Action

**Speaker (Say):**
> "আমাদের মূল লক্ষ্য হ্যাকার্থনের **P3 সমস্যা: প্রতারণা ও দ্বৈত বিক্রয় রোধ**।
> একজন নাগরিক জমি কেনার আগে কীভাবে প্রতারণা থেকে বাঁচবেন? চলুন দেখে নেওয়া যাক।"

**Actions on Screen:**
1. In the search bar, click sample chip **`PCL-DH-102`** (Tejgaon Mouza, Plot 124).
2. Click **অনুসন্ধান করুন (Search)** → Open Parcel Details.
3. Scroll to **ঝুঁকি গোয়েন্দা সতর্কতা (Risk Alerts)**:
   - Show **HIGH RISK (Score: 85/100)** with red warning badge.
   - Click accordion **"কেন এই সতর্কতা?" (Why This Alert?)**:
     - Explain rule `POSSIBLE_DOUBLE_SALE`: Two active registered deeds convey the exact same 10.00 decimal plot to two different buyers!
     - Point to exact registered deed numbers: `DEED-2024-1842` (Feb 15) vs `DEED-2024-9045` (March 20).
4. Click **"মালিকানা ও হস্তান্তর গ্রাফ" (Ownership Graph)**:
   - Toggle between interactive visual node tree and WCAG AA Accessible Table View.
5. Click **"ক্রয়ের পূর্বে যাচাই প্রতিবেদন" (Check Before Buying)**:
   - Display the clean, bilingual A4 Due Diligence Report.
   - Click **"প্রিন্ট / সংরক্ষণ" (Print)** to demonstrate instant browser print-preview.

---

## ⏱️ Minute 1:15 – 1:55: P1 — Digitize Old Records & OCR Review Queue

**Speaker (Say):**
> "কাগজের পুরনো দলিল ডিজিটাইজেশনে জমিটেক কোনো মনগড়া ফলাফল দেখায় না। এখানে রয়েছে মানুষের তত্ত্বাবধানে ওসিআর যাচাই কিউ।"

**Actions on Screen:**
1. In the top nav, switch role to **`Reviewer`** (Shafiqul Islam - Senior Reviewer).
2. Navigate to **`ওসিআর যাচাই কিউ (Review Queue)`**:
   - Show side-by-side split screen: Original deed preview on the left, extracted fields with per-field confidence scores on the right.
3. Click an editable field (e.g. Seller Name or Khatian number).
4. Demonstrate modifying a low-confidence reading and clicking **"অনুমোদন ও ইনডেক্স করুন" (Approve & Index)**.
5. Notice that an immutable audit log is immediately written with the reviewer's ID.

---

## ⏱️ Minute 1:55 – 2:30: P4 — Smart e-Mutation & P2 — Zero-PII Digital Integrity

**Speaker (Say):**
> "এবার আসা যাক সহকারী কমিশনারের কার্যালয়ে — আমাদের সিমুলেটেড ই-নামজারি ওয়ার্কফ্লো এবং জিরো-পিআইআই ডিজিটাল রসিদে।"

**Actions on Screen:**
1. Switch role to **`Land Office Officer`** (Nazmul Haque - AC Land Sim).
2. Go to **`নামজারি নথি (Mutation Cases)`**:
   - Select case **`MUT-2024-9912`**.
   - Check the statutory verification checklist boxes:
     - `✓ মূল সাব-কবলা দলিল ও ভলিউম নম্বর যাচাই`
     - `✓ ইউনিয়ন ভূমি উপ-সহকারীর দখল তদন্ত প্রতিবেদন প্রাপ্তি`
   - Enter order reasoning: *"সরেজমিন দখল ও দলিল সঠিক পাওয়ায় নামজারি মঞ্জুর করা হলো।"*
   - Click **"আদেশ কার্যকর করুন" (Execute Order)** → Transitions to **APPROVED**.
3. Now switch to Citizen role and go to **`নামজারি ট্র্যাকার (Track Mutation)`**:
   - Paste opaque reference `mut-ref-847291a9b`.
   - Show the 5-step visual progress bar.
   - Highlight the **Zero-PII guarantee**: The citizen's personal NID, phone, or private notes are strictly absent from the public response.

---

## ⏱️ Minute 2:30 – 3:00: Security, Audit Trail & Conclusion

**Speaker (Say):**
> "সবশেষে, জমিটেকে কোনো কৃত্রিম ব্লকচেইন হাইপ নেই। আমরা ব্যবহার করেছি রিয়েল এড২৫৫১৯ ডিজিটাল সিগনেচার এবং অপরিবর্তনীয় অডিট ট্রেইল।"

**Actions on Screen:**
1. Go to **`অডিট ও লগ পরিদর্শন (Audit Log)`**:
   - Show the live immutable log entries for all our previous actions with timestamps, actor IDs, and sanitized JSON metadata.
2. Go to **`কিউআর যাচাই (Verify QR Receipt)`**:
   - Test opaque receipt `rcpt-synth-001` → Shows **VALID** (Signed with `ed25519-jomitech-2026-v1`).
   - Test a tampered byte hash → Instantly flags **TAMPERED / Hash Mismatch**.
3. Conclusion:
   > "জমিটেক কোনো আইনি আদালত নয়, এটি একটি বুদ্ধিমান নাগরিক সহকারী যা নাগরিকদের ঠকে যাওয়া থেকে বাঁচায় এবং ভূমি প্রশাসনকে গতিশীল করে। ধন্যবাদ।"
