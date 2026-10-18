import json
import hashlib
from datetime import datetime, timedelta
from backend.app.core.security import hash_password
from backend.app.core.database import engine, Base, SessionLocal
from backend.app.models.user import User
from backend.app.models.administrative import AdministrativeArea
from backend.app.models.owner import Owner
from backend.app.models.parcel import LandParcel, EncumbranceIndicator
from backend.app.models.khatian import KhatianRecord, KhatianOwner
from backend.app.models.deed import Deed, Transaction, OwnershipHistory
from backend.app.models.document import Document
from backend.app.models.extraction import ExtractionJob, ExtractedField
from backend.app.models.receipt import VerificationReceipt
from backend.app.models.risk import RiskAssessment, RiskFinding
from backend.app.models.mutation import MutationCase, MutationEvent, MutationChecklistItem
from backend.app.models.audit import AuditLog

def seed_database():
    """Repeatable deterministic synthetic database seed for JomiTech."""
    print("Initializing clean database tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 1. Seed Demo Users
        password_hash = hash_password("jomitech2026")
        users = [
            User(
                id="usr_citizen_01",
                email="tareq.citizen@example.com",
                name="Md. Tareq Hasan",
                name_bn="মোঃ তারেক হাসান",
                hashed_password=password_hash,
                role="citizen",
                designation="Citizen / Prospective Buyer",
                designation_bn="নাগরিক / জমি ক্রেতা",
            ),
            User(
                id="usr_entry_01",
                email="farzana.entry@example.com",
                name="Farzana Akter",
                name_bn="ফারজানা আক্তার",
                hashed_password=password_hash,
                role="data_entry",
                designation="Data Entry Assistant",
                designation_bn="ডেটা এন্ট্রি সহকারী",
            ),
            User(
                id="usr_reviewer_01",
                email="shafiqul.review@example.com",
                name="Shafiqul Islam",
                name_bn="শফিকুল ইসলাম",
                hashed_password=password_hash,
                role="reviewer",
                designation="Senior Record Reviewer",
                designation_bn="ঊর্ধ্বতন রেকর্ড যাচাইকারী",
            ),
            User(
                id="usr_officer_01",
                email="nazmul.officer@example.com",
                name="Nazmul Haque",
                name_bn="নাজমুল হক",
                hashed_password=password_hash,
                role="officer",
                designation="Assistant Commissioner (Land) Sim.",
                designation_bn="সহকারী কমিশনার (ভূমি) সিমুলেশন",
            ),
            User(
                id="usr_admin_01",
                email="admin.jomitech@example.com",
                name="System Admin",
                name_bn="সিস্টেম প্রশাসক",
                hashed_password=password_hash,
                role="admin",
                designation="Platform Administrator",
                designation_bn="প্ল্যাটফর্ম অ্যাডমিনিস্ট্রেটর",
            ),
        ]
        db.add_all(users)

        # 2. Seed Administrative Areas
        areas = [
            AdministrativeArea(
                id="adm_tejgaon",
                division="Dhaka",
                division_bn="ঢাকা",
                district="Dhaka",
                district_bn="ঢাকা",
                upazila="Tejgaon",
                upazila_bn="তেজগাঁও",
                mouza="Tejgaon",
                mouza_bn="তেজগাঁও",
                jl_no="214",
                jl_no_bn="২১৪",
            ),
            AdministrativeArea(
                id="adm_gulshan",
                division="Dhaka",
                division_bn="ঢাকা",
                district="Dhaka",
                district_bn="ঢাকা",
                upazila="Gulshan",
                upazila_bn="গুলশান",
                mouza="Gulshan Model Town",
                mouza_bn="গুলশান মডেল টাউন",
                jl_no="205",
                jl_no_bn="২০৫",
            ),
            AdministrativeArea(
                id="adm_dhanmondi",
                division="Dhaka",
                division_bn="ঢাকা",
                district="Dhaka",
                district_bn="ঢাকা",
                upazila="Dhanmondi",
                upazila_bn="ধানমন্ডি",
                mouza="Dhanmondi R/A",
                mouza_bn="ধানমন্ডি আ/এ",
                jl_no="220",
                jl_no_bn="২২০",
            ),
            AdministrativeArea(
                id="adm_mirpur",
                division="Dhaka",
                division_bn="ঢাকা",
                district="Dhaka",
                district_bn="ঢাকা",
                upazila="Mirpur",
                upazila_bn="মিরপুর",
                mouza="Paikpara",
                mouza_bn="পাইকপাড়া",
                jl_no="180",
                jl_no_bn="১৮০",
            ),
            AdministrativeArea(
                id="adm_savar",
                division="Dhaka",
                division_bn="ঢাকা",
                district="Dhaka",
                district_bn="ঢাকা",
                upazila="Savar",
                upazila_bn="সাভার",
                mouza="Birulia",
                mouza_bn="বিরুলিয়া",
                jl_no="112",
                jl_no_bn="১১২",
            ),
        ]
        db.add_all(areas)

        # 3. Seed Synthetic Owners (Fictional Demo Identifiers)
        owners = [
            Owner(
                id="own_01",
                name="Abdur Rahim",
                name_bn="আব্দুর রহিম",
                father_name="Late Kashem Ali",
                father_name_bn="মৃত কাশেম আলী",
                synthetic_nid="DEMO-1965-00101",
                address_bn="তেজগাঁও, ঢাকা",
            ),
            Owner(
                id="own_02",
                name="Kamal Hossain",
                name_bn="কামাল হোসেন",
                father_name="Abdur Rahim",
                father_name_bn="আব্দুর রহিম",
                synthetic_nid="DEMO-1988-00102",
                address_bn="তেজগাঁও, ঢাকা",
            ),
            Owner(
                id="own_03",
                name="Selim Ahmed",
                name_bn="সেলিম আহমেদ",
                father_name="Mofiz Uddin",
                father_name_bn="মফিজ উদ্দিন",
                synthetic_nid="DEMO-1979-00103",
                address_bn="গুলশান, ঢাকা",
            ),
            Owner(
                id="own_04",
                name="Mrs. Jahanara Begum",
                name_bn="মোসাঃ জাহানারা বেগম",
                father_name="Nurul Islam",
                father_name_bn="নুরুল ইসলাম",
                synthetic_nid="DEMO-1982-00104",
                address_bn="ধানমন্ডি, ঢাকা",
            ),
            Owner(
                id="own_05",
                name="Tanvir Rahman",
                name_bn="তানভীর রহমান",
                father_name="Selim Ahmed",
                father_name_bn="সেলিম আহমেদ",
                synthetic_nid="DEMO-1994-00105",
                address_bn="গুলশান, ঢাকা",
            ),
            Owner(
                id="own_06",
                name="Buyer Alpha (Conflicted)",
                name_bn="ক্রেতা আলফা (দ্বন্দ্বপূর্ণ)",
                father_name="Abdul Karim",
                father_name_bn="আব্দুল করিম",
                synthetic_nid="DEMO-1990-00106",
                address_bn="উত্তরা, ঢাকা",
            ),
            Owner(
                id="own_07",
                name="Buyer Beta (Conflicted)",
                name_bn="ক্রেতা বিটা (দ্বন্দ্বপূর্ণ)",
                father_name="Rafiqul Alam",
                father_name_bn="রফিকুল আলম",
                synthetic_nid="DEMO-1992-00107",
                address_bn="মিরপুর, ঢাকা",
            ),
            Owner(
                id="own_08",
                name="Heir One",
                name_bn="ওয়ারিশ এক (হাসান)",
                father_name="Late Anowar Hossain",
                father_name_bn="মৃত আনোয়ার হোসেন",
                synthetic_nid="DEMO-1985-00108",
                address_bn="ধানমন্ডি, ঢাকা",
            ),
            Owner(
                id="own_09",
                name="Heir Two",
                name_bn="ওয়ারিশ দুই (হোসেন)",
                father_name="Late Anowar Hossain",
                father_name_bn="মৃত আনোয়ার হোসেন",
                synthetic_nid="DEMO-1987-00109",
                address_bn="ধানমন্ডি, ঢাকা",
            ),
            Owner(
                id="own_10",
                name="Heir Three",
                name_bn="ওয়ারিশ তিন (ফাতিমা)",
                father_name="Late Anowar Hossain",
                father_name_bn="মৃত আনোয়ার হোসেন",
                synthetic_nid="DEMO-1990-00110",
                address_bn="ধানমন্ডি, ঢাকা",
            ),
        ]
        db.add_all(owners)
        db.flush()

        # Helper function for hash
        def dummy_hash(text: str) -> str:
            return hashlib.sha256(text.encode("utf-8")).hexdigest()

        # =========================================================================
        # 4. Seed the 12 Scenarios
        # =========================================================================

        # SCENARIO 1: Clean Chain of Title (LOW RISK)
        # Parcel PCL-DH-101: CS 101 -> SA 205 -> RS 410 -> BS 815
        p1 = LandParcel(
            id="PCL-DH-101",
            administrative_area_id="adm_tejgaon",
            dag_no="815",
            dag_no_bn="৮১৫",
            cs_dag="101",
            sa_dag="205",
            rs_dag="410",
            bs_dag="815",
            total_area=10.0,
            area_unit="decimal",
            land_class="Homestead",
            land_class_bn="বাস্তু/ভিটি",
        )
        db.add(p1)
        db.flush()

        # Khatians for Scenario 1
        k_cs = KhatianRecord(id="KHT-101-CS", parcel_id=p1.id, survey_type="CS", khatian_no="45", khatian_no_bn="৪৫", survey_year=1925)
        db.add(k_cs)
        db.flush()
        db.add(KhatianOwner(id="KO-101-CS", khatian_id=k_cs.id, owner_id="own_01", share_fraction=1.0, share_ana="১৬ আনা", area_owned=10.0))

        k_sa = KhatianRecord(id="KHT-101-SA", parcel_id=p1.id, survey_type="SA", khatian_no="82", khatian_no_bn="৮২", survey_year=1956, predecessor_khatian_id=k_cs.id)
        db.add(k_sa)
        db.flush()
        db.add(KhatianOwner(id="KO-101-SA", khatian_id=k_sa.id, owner_id="own_01", share_fraction=1.0, share_ana="১৬ আনা", area_owned=10.0))

        k_rs = KhatianRecord(id="KHT-101-RS", parcel_id=p1.id, survey_type="RS", khatian_no="140", khatian_no_bn="১৪০", survey_year=1978, predecessor_khatian_id=k_sa.id)
        db.add(k_rs)
        db.flush()
        db.add(KhatianOwner(id="KO-101-RS", khatian_id=k_rs.id, owner_id="own_02", share_fraction=1.0, share_ana="১৬ আনা", area_owned=10.0))

        k_bs = KhatianRecord(id="KHT-101-BS", parcel_id=p1.id, survey_type="BS", khatian_no="320", khatian_no_bn="৩২০", survey_year=2008, predecessor_khatian_id=k_rs.id)
        db.add(k_bs)
        db.flush()
        db.add(KhatianOwner(id="KO-101-BS", khatian_id=k_bs.id, owner_id="own_02", share_fraction=1.0, share_ana="১৬ আনা", area_owned=10.0))

        # Document and Receipt for Scenario 1
        doc1 = Document(
            id="DOC-101-01",
            original_filename="synthetic_clean_deed_101.pdf",
            storage_key="synthetic/doc_101.pdf",
            mime_type="application/pdf",
            file_size_bytes=342150,
            sha256_hash=dummy_hash("deed-101-clean-bytes-v1"),
            status="APPROVED",
        )
        db.add(doc1)
        db.flush()

        deed1 = Deed(
            id="DEED-101-01",
            deed_no="1452/2012",
            deed_no_bn="১৪৫২/২০১২",
            registration_office="Tejgaon Sub-Registry",
            registration_office_bn="তেজগাঁও সাব-রেজিস্ট্রি অফিস",
            registration_date=datetime(2012, 5, 10),
            parcel_id=p1.id,
            transferred_area=10.0,
            transferred_share=1.0,
            status="APPROVED",
            document_id=doc1.id,
        )
        db.add(deed1)
        db.flush()

        db.add(Transaction(id="TX-101-01", deed_id=deed1.id, seller_id="own_01", buyer_id="own_02", share_transferred=1.0, area_transferred=10.0, effective_date=datetime(2012, 5, 10)))
        db.add(OwnershipHistory(id="OH-101-01", parcel_id=p1.id, owner_id="own_02", deed_id=deed1.id, khatian_id=k_bs.id, share_fraction=1.0, area=10.0, effective_from=datetime(2012, 5, 10), is_current=True))

        receipt1 = VerificationReceipt(
            id="RCP-101-01",
            opaque_id="receipt-uuid-clean-101",
            document_id=doc1.id,
            sha256_hash=doc1.sha256_hash,
            ed25519_signature="c349a78f102ba948f98c819d45e12836d8194cf98341b8a9cf29184df872149b1093a8",
            key_id="ed25519-jomitech-2026-v1",
            issued_at=datetime(2024, 1, 10),
            is_revoked=False,
        )
        db.add(receipt1)

        # Risk assessment for Scenario 1: Clean (Score 0)
        risk1 = RiskAssessment(
            id="RISK-PCL-101",
            parcel_id=p1.id,
            total_score=0,
            risk_level="LOW",
            summary_bn="মালিকানা শৃঙ্খল নিষ্কন্টক। CS থেকে BS পর্যন্ত ধারাবাহিক খতিয়ান ও অনুমোদিত দলিল বিদ্যমান। কোনো অসঙ্গতি পাওয়া যায়নি।",
            summary_en="Chain of title is clean and verified from CS to BS survey with uninterrupted single-owner lineage. No discrepancies detected.",
        )
        db.add(risk1)

        # -------------------------------------------------------------------------
        # SCENARIO 2: Possible Double-Sale (HIGH RISK, Score 65)
        # Parcel PCL-DH-502: Same parcel/share deeded to Buyer Alpha, then 15 days later to Buyer Beta
        p2 = LandParcel(
            id="PCL-DH-502",
            administrative_area_id="adm_gulshan",
            dag_no="502",
            dag_no_bn="৫০২",
            rs_dag="502",
            bs_dag="502",
            total_area=8.5,
            area_unit="decimal",
            land_class="Commercial",
            land_class_bn="বাণিজ্যিক প্লট",
        )
        db.add(p2)
        db.flush()

        k2_rs = KhatianRecord(id="KHT-502-RS", parcel_id=p2.id, survey_type="RS", khatian_no="550", khatian_no_bn="৫৫০", survey_year=1990)
        db.add(k2_rs)
        db.flush()
        db.add(KhatianOwner(id="KO-502-RS", khatian_id=k2_rs.id, owner_id="own_03", share_fraction=1.0, share_ana="১৬ আনা", area_owned=8.5))

        # Deed A: Selim Ahmed -> Buyer Alpha (2024-03-01)
        doc2_a = Document(
            id="DOC-502-A",
            original_filename="synthetic_deed_502_buyer_alpha.pdf",
            storage_key="synthetic/doc_502_a.pdf",
            mime_type="application/pdf",
            file_size_bytes=420100,
            sha256_hash=dummy_hash("deed-502-alpha-hash"),
            status="APPROVED",
        )
        db.add(doc2_a)
        db.flush()
        deed2_a = Deed(
            id="DEED-502-A",
            deed_no="2241/2024",
            deed_no_bn="২২৪১/২০২৪",
            registration_office="Gulshan Sub-Registry",
            registration_office_bn="গুলশান সাব-রেজিস্ট্রি অফিস",
            registration_date=datetime(2024, 3, 1),
            parcel_id=p2.id,
            transferred_area=8.5,
            transferred_share=1.0,
            status="APPROVED",
            document_id=doc2_a.id,
        )
        db.add(deed2_a)
        db.flush()
        db.add(Transaction(id="TX-502-A", deed_id=deed2_a.id, seller_id="own_03", buyer_id="own_06", share_transferred=1.0, area_transferred=8.5, effective_date=datetime(2024, 3, 1)))

        # Deed B: Same seller (Selim Ahmed) -> Buyer Beta (2024-03-15, only 14 days later!)
        doc2_b = Document(
            id="DOC-502-B",
            original_filename="synthetic_deed_502_buyer_beta.pdf",
            storage_key="synthetic/doc_502_b.pdf",
            mime_type="application/pdf",
            file_size_bytes=418900,
            sha256_hash=dummy_hash("deed-502-beta-hash"),
            status="APPROVED",
        )
        db.add(doc2_b)
        db.flush()
        deed2_b = Deed(
            id="DEED-502-B",
            deed_no="2399/2024",
            deed_no_bn="২৩৯৯/২০২৪",
            registration_office="Gulshan Sub-Registry",
            registration_office_bn="গুলশান সাব-রেজিস্ট্রি অফিস",
            registration_date=datetime(2024, 3, 15),
            parcel_id=p2.id,
            transferred_area=8.5,
            transferred_share=1.0,
            status="APPROVED",
            document_id=doc2_b.id,
        )
        db.add(deed2_b)
        db.flush()
        db.add(Transaction(id="TX-502-B", deed_id=deed2_b.id, seller_id="own_03", buyer_id="own_07", share_transferred=1.0, area_transferred=8.5, effective_date=datetime(2024, 3, 15)))

        # Risk assessment for Scenario 2: POSSIBLE_DOUBLE_SALE (Score 65)
        risk2 = RiskAssessment(
            id="RISK-PCL-502",
            parcel_id=p2.id,
            total_score=65,
            risk_level="HIGH",
            summary_bn="সম্ভাব্য দ্বৈত বিক্রয় সতর্কতা! একই দাগ ও অংশের জমি ১৪ দিনের ব্যবধানে দুই পৃথক ক্রেতার নিকট হস্তান্তরের রেকর্ড পাওয়া গেছে।",
            summary_en="Possible double-sale alert! Two active transfers for the identical 100% parcel share recorded within a 14-day window.",
        )
        db.add(risk2)
        db.flush()
        db.add(RiskFinding(
            id="FIND-502-01",
            assessment_id=risk2.id,
            rule_code="POSSIBLE_DOUBLE_SALE",
            severity="HIGH",
            score_contribution=65,
            title_bn="সম্ভাব্য দ্বৈত বিক্রয় / একই দাগে সমাপতিত হস্তান্তর",
            title_en="Possible Double-Sale / Overlapping Active Transfers",
            evidence_json=json.dumps({
                "conflicting_deeds": ["২২৪১/২০২৪ (Deed 2241/2024)", "২৩৯৯/২০২৪ (Deed 2399/2024)"],
                "seller": "সেলিম আহমেদ (Selim Ahmed)",
                "buyers": ["ক্রেতা আলফা (Buyer Alpha)", "ক্রেতা বিটা (Buyer Beta)"],
                "share_transferred": "১০০% (1.0) বনাম ১০০% (1.0)",
                "interval_days": 14,
            }, ensure_ascii=False),
            recommended_action_bn="উভয় দলিলের বালাম বই ও সংশ্লিষ্ট সাব-রেজিস্ট্রি ভলিউম স্বশরীরে তল্লাশি করুন। নামজারি আবেদন স্থগিত রেখে সংশ্লিষ্ট পক্ষগণকে শুনানিতে ডাকুন।",
            recommended_action_en="Physically inspect original Registry volumes and suspend ongoing mutations pending official hearing with both buyers.",
            limitation_notice_bn="এই সতর্কতা কোনো প্রতারণার আইনি রায় নয়; এটি কেবল রেজিস্ট্রেশন তথ্যের সরাসরি বৈপরীত্য নির্দেশ করে।",
            limitation_notice_en="This finding does not constitute a legal fraud ruling; it highlights direct conflict in deed registration dates.",
        ))

        # -------------------------------------------------------------------------
        # SCENARIO 3: Seller Mismatch (HIGH RISK, Score 55)
        # Parcel PCL-DH-703: Seller in deed does not match recorded khatian holder
        p3 = LandParcel(
            id="PCL-DH-703",
            administrative_area_id="adm_mirpur",
            dag_no="703",
            dag_no_bn="৭০৩",
            rs_dag="703",
            total_area=6.0,
            area_unit="decimal",
            land_class="Agricultural",
            land_class_bn="নাল",
        )
        db.add(p3)
        db.flush()
        k3_rs = KhatianRecord(id="KHT-703-RS", parcel_id=p3.id, survey_type="RS", khatian_no="881", khatian_no_bn="৮৮১", survey_year=1995)
        db.add(k3_rs)
        db.flush()
        # Recorded owner is Mrs. Jahanara Begum
        db.add(KhatianOwner(id="KO-703-RS", khatian_id=k3_rs.id, owner_id="own_04", share_fraction=1.0, share_ana="১৬ আনা", area_owned=6.0))

        # But deed claims seller is Tanvir Rahman
        deed3 = Deed(
            id="DEED-703-01",
            deed_no="4412/2023",
            deed_no_bn="৪৪১২/২০২৩",
            registration_office="Mirpur Sub-Registry",
            registration_office_bn="মিরপুর সাব-রেজিস্ট্রি অফিস",
            registration_date=datetime(2023, 8, 20),
            parcel_id=p3.id,
            transferred_area=6.0,
            transferred_share=1.0,
            status="APPROVED",
        )
        db.add(deed3)
        db.flush()
        db.add(Transaction(id="TX-703-01", deed_id=deed3.id, seller_id="own_05", buyer_id="own_01", share_transferred=1.0, area_transferred=6.0, effective_date=datetime(2023, 8, 20)))

        risk3 = RiskAssessment(
            id="RISK-PCL-703",
            parcel_id=p3.id,
            total_score=55,
            risk_level="HIGH",
            summary_bn="বিক্রেতার তথ্যে অসঙ্গতি! দলিলে উল্লেখিত বিক্রেতা সংশ্লিষ্ট আরএস খতিয়ানের রেকর্ডীয় মালিক নন। কোনো ওয়ারিশ সনদ বা পাওয়ার অব অ্যাটর্নি সংযুক্ত নেই।",
            summary_en="Seller mismatch! The vendor executing Deed 4412/2023 is not the recorded holder in RS Khatian 881.",
        )
        db.add(risk3)
        db.flush()
        db.add(RiskFinding(
            id="FIND-703-01",
            assessment_id=risk3.id,
            rule_code="SELLER_MISMATCH",
            severity="HIGH",
            score_contribution=55,
            title_bn="বিক্রেতা ও সর্বশেষ রেকর্ডীয় মালিকের তথ্যে অমিল",
            title_en="Seller Inconsistent with Latest Reviewed Recorded Holder",
            evidence_json=json.dumps({
                "recorded_holder": "মোসাঃ জাহানারা বেগম (Mrs. Jahanara Begum)",
                "deed_seller": "তানভীর রহমান (Tanvir Rahman)",
                "khatian_no": "৮৮১ (RS Khatian 881)",
                "deed_no": "৪৪১২/২০২৩ (Deed 4412/2023)",
            }, ensure_ascii=False),
            recommended_action_bn="রেকর্ডীয় মালিকের নিকট থেকে বিক্রেতার স্বত্ব অর্জনের ধারাবাহিক বায়ো দলিল বা ওয়ারিশ সনদ পরীক্ষা করুন।",
            recommended_action_en="Verify registered devolution documents, chain of inheritance, or registered power of attorney linking vendor to recorded holder.",
            limitation_notice_bn="বিক্রেতা নিবন্ধিত হেবা বা না-দাবি দলিলের সূত্রে মালিক হতে পারেন; যা এই ডেমো রেকর্ডে অনুপস্থিত।",
            limitation_notice_en="The vendor may hold title via unindexed gift or release deed not present in this synthetic demo dataset.",
        ))

        # -------------------------------------------------------------------------
        # SCENARIO 4: Duplicate Deed Reference / Exact Hash (HIGH RISK, Score 70)
        # Parcel PCL-DH-204
        p4 = LandParcel(id="PCL-DH-204", administrative_area_id="adm_tejgaon", dag_no="204", dag_no_bn="২০৪", rs_dag="204", total_area=5.0, area_unit="decimal")
        db.add(p4)
        db.flush()
        risk4 = RiskAssessment(id="RISK-PCL-204", parcel_id=p4.id, total_score=70, risk_level="HIGH", summary_bn="ডুপ্লিকেট দলিল নম্বর বা অভিন্ন ডিজিটাল হ্যাশ শনাক্ত হয়েছে।", summary_en="Duplicate deed reference or identical file hash detected in registry records.")
        db.add(risk4)
        db.flush()
        db.add(RiskFinding(id="FIND-204-01", assessment_id=risk4.id, rule_code="DUPLICATE_DEED", severity="HIGH", score_contribution=70, title_bn="একই দলিল নম্বর বা ফাইলের ডুপ্লিকেট নিবন্ধন রেকর্ড", title_en="Duplicate Deed Reference or Identical Hash Record", evidence_json=json.dumps({"deed_no": "1234/2024", "collision_type": "EXACT_REFERENCE_AND_HASH"}, ensure_ascii=False), recommended_action_bn="মূল বালাম বই তল্লাশি করে নিশ্চিত হোন কোন ভলিউমে আসল দলিল নিবন্ধিত হয়েছে।", recommended_action_en="Inspect volume registry to confirm genuine instrument origin.", limitation_notice_bn="সিরিয়াল নম্বর মুদ্রণজনিত অসঙ্গতি হতে পারে।", limitation_notice_en="May indicate registry numbering collision."))

        # -------------------------------------------------------------------------
        # SCENARIO 5: Area / Share Exceeded (HIGH RISK, Score 60)
        # Parcel PCL-DH-605: Owner has 25% share, but deeds 50%
        p5 = LandParcel(id="PCL-DH-605", administrative_area_id="adm_mirpur", dag_no="605", dag_no_bn="৬০৫", rs_dag="605", total_area=12.0, area_unit="decimal")
        db.add(p5)
        db.flush()
        risk5 = RiskAssessment(id="RISK-PCL-605", parcel_id=p5.id, total_score=60, risk_level="HIGH", summary_bn="মালিকের প্রাপ্ত অংশের অতিরিক্ত জমি হস্তান্তরের চেষ্টা শনাক্ত হয়েছে।", summary_en="Transfer instrument conveys share in excess of vendor's verified entitlement.")
        db.add(risk5)
        db.flush()
        db.add(RiskFinding(id="FIND-605-01", assessment_id=risk5.id, rule_code="AREA_OR_SHARE_EXCEEDED", severity="HIGH", score_contribution=60, title_bn="মালিকানাধীন অংশের অতিরিক্ত জমি হস্তান্তর", title_en="Transfer Exceeds Available Share or Parcel Area", evidence_json=json.dumps({"owned_share": "0.25 (25%)", "conveyed_share": "0.50 (50%)", "excess_fraction": "0.25"}, ensure_ascii=False), recommended_action_bn="সহ-শরিকদের হিস্যা পরীক্ষা করে অতিরিক্ত হস্তান্তর সংশোধন করান।", recommended_action_en="Audit co-sharer fractional allocations to rectify over-conveyance.", limitation_notice_bn="অন্য অংশীদারদের সাথে আপস বণ্টননামা বিদ্যমান থাকতে পারে।", limitation_notice_en="Unregistered amicable partition deed may exist."))

        # -------------------------------------------------------------------------
        # SCENARIO 6: Registered Not Mutated (MEDIUM RISK, Score 25)
        # Parcel PCL-DH-306
        p6 = LandParcel(id="PCL-DH-306", administrative_area_id="adm_savar", dag_no="306", dag_no_bn="৩০৬", rs_dag="306", total_area=15.0, area_unit="decimal")
        db.add(p6)
        db.flush()
        risk6 = RiskAssessment(id="RISK-PCL-306", parcel_id=p6.id, total_score=25, risk_level="MEDIUM", summary_bn="দলিল রেজিস্ট্রি হলেও ১৮ মাসেও নামজারি সম্পন্ন হয়নি।", summary_en="Deed registered 18 months ago without matching mutation record.")
        db.add(risk6)
        db.flush()
        db.add(RiskFinding(id="FIND-306-01", assessment_id=risk6.id, rule_code="REGISTERED_NOT_MUTATED", severity="MEDIUM", score_contribution=25, title_bn="দলিল রেজিস্ট্রি হলেও সময়মতো নামজারি হয়নি", title_en="Registered Deed with No Corresponding Mutation Record", evidence_json=json.dumps({"deed_date": "2023-01-15", "elapsed_months": 18}, ensure_ascii=False), recommended_action_bn="অবিলম্বে সহকারী কমিশনার (ভূমি) অফিসে নামজারির আবেদন করুন।", recommended_action_en="Apply for e-mutation at AC Land office prior to purchase.", limitation_notice_bn="নামজারি আবেদন প্রক্রিয়াধীন থাকতে পারে।", limitation_notice_en="Mutation case may be in progress in another circle."))

        # -------------------------------------------------------------------------
        # SCENARIO 7: Mutation Party Mismatch (MEDIUM RISK, Score 35)
        # Parcel PCL-DH-807
        p7 = LandParcel(id="PCL-DH-807", administrative_area_id="adm_tejgaon", dag_no="807", dag_no_bn="৮০৭", rs_dag="807", total_area=7.0, area_unit="decimal")
        db.add(p7)
        db.flush()
        risk7 = RiskAssessment(id="RISK-PCL-807", parcel_id=p7.id, total_score=35, risk_level="MEDIUM", summary_bn="নামজারি আবেদনকারী ও দলিলের গ্রহীতার নামে অমিল পাওয়া গেছে।", summary_en="Mutation applicant differs from buyer recorded in registered conveyance deed.")
        db.add(risk7)
        db.flush()
        db.add(RiskFinding(id="FIND-807-01", assessment_id=risk7.id, rule_code="MUTATION_PARTY_MISMATCH", severity="MEDIUM", score_contribution=35, title_bn="নামজারি আবেদনকারী ও দলিলের গ্রহীতার নাম অমিল", title_en="Mutation Applicant Differs from Deed Buyer", evidence_json=json.dumps({"applicant": "কামাল হোসেন (Kamal Hossain)", "deed_buyer": "আব্দুর রহিম (Abdur Rahim)", "case_no": "MUT-2024-9912"}, ensure_ascii=False), recommended_action_bn="আবেদনকারীর বৈধ আমমোক্তারনামা বা ওয়ারিশ প্রমাণের সনদ যাচাই করুন।", recommended_action_en="Demand registered power of attorney or legal heir certificate.", limitation_notice_bn="আবেদনকারী প্রকৃত ক্রেতার প্রতিনিধি হতে পারেন।", limitation_notice_en="Applicant may be authorized attorney."))

        # -------------------------------------------------------------------------
        # SCENARIO 8: Impossible Date or Invalid Syntax (MEDIUM RISK, Score 30)
        # Parcel PCL-DH-408
        p8 = LandParcel(id="PCL-DH-408", administrative_area_id="adm_gulshan", dag_no="408", dag_no_bn="৪০৮", rs_dag="408", total_area=4.5, area_unit="decimal")
        db.add(p8)
        db.flush()
        risk8 = RiskAssessment(id="RISK-PCL-408", parcel_id=p8.id, total_score=30, risk_level="MEDIUM", summary_bn="দলিলের তারিখ ও খতিয়ানের বছরের মধ্যে অসঙ্গতি বা ভবিষ্যৎ তারিখ পরিলক্ষিত।", summary_en="Chronological impossibility or syntax defect in deed reference.")
        db.add(risk8)
        db.flush()
        db.add(RiskFinding(id="FIND-408-01", assessment_id=risk8.id, rule_code="IMPOSSIBLE_DATE", severity="MEDIUM", score_contribution=30, title_bn="কালানুক্রমিক অসঙ্গতি বা ভবিষ্যৎ তারিখ", title_en="Chronological Impossibility or Future Date", evidence_json=json.dumps({"execution_date": "2030-01-01", "predecessor_survey_year": 1990}, ensure_ascii=False), recommended_action_bn="মূল দলিলের তারিখ সংশোধন বা কেরানীজনিত ত্রুটি যাচাই করুন।", recommended_action_en="Check registry records for clerical typographical error.", limitation_notice_bn="টাইপিং ত্রুটি হতে পারে।", limitation_notice_en="May be typographical error in registry index."))

        # -------------------------------------------------------------------------
        # SCENARIO 9: Khas / Vested / Acquisition Indicator (HIGH RISK, Score 80)
        # Parcel PCL-DH-909
        p9 = LandParcel(id="PCL-DH-909", administrative_area_id="adm_savar", dag_no="909", dag_no_bn="৯০৯", rs_dag="909", total_area=20.0, area_unit="decimal")
        db.add(p9)
        db.flush()
        db.add(EncumbranceIndicator(
            id="ENC-909-01",
            parcel_id=p9.id,
            indicator_type="KHAS",
            title_bn="সরকারি ১নং খাস খতিয়ানভুক্ত সম্পত্তি",
            title_en="Government Khas Land Schedule 1 Notice",
            description_bn="উপজেলা নির্বাহী কর্মকর্তা ও সহকারী কমিশনার (ভূমি) কার্যালয়ের বিজ্ঞপ্তিমতে সম্পত্তিটি ১নং খাস খতিয়ানভুক্ত।",
            description_en="Official circle gazette lists this parcel under Government Khas Land Schedule.",
            case_ref="KHAS-NOTICE-2021-41",
            provenance="Dhaka District Gazette 2021",
            is_active=True,
        ))
        risk9 = RiskAssessment(id="RISK-PCL-909", parcel_id=p9.id, total_score=80, risk_level="HIGH", summary_bn="উচ্চ ঝুঁকি! সম্পত্তিটি সরকারি খাস বা অধিগ্রহণ তালিকায় অন্তর্ভুক্ত রয়েছে। সাধারণ ক্রয়-বিক্রয় নিষিদ্ধ।", summary_en="High risk! Parcel is flagged under government khas or acquisition schedule.")
        db.add(risk9)
        db.flush()
        db.add(RiskFinding(id="FIND-909-01", assessment_id=risk9.id, rule_code="KHAS_INDICATOR", severity="HIGH", score_contribution=80, title_bn="সরকারি খাস বা অর্পিত সম্পত্তি নির্দেশক", title_en="Government Khas or Vested Property Flag", evidence_json=json.dumps({"case_ref": "KHAS-NOTICE-2021-41", "indicator": "GOVERNMENT_KHAS"}, ensure_ascii=False), recommended_action_bn="জেলা প্রশাসক কার্যালয়ের এলএ শাখা এবং এসিল্যান্ড কার্যালয়ে খাস তালিকার বর্তমান স্থিতি যাচাই করুন। ক্রয় থেকে বিরত থাকুন।", recommended_action_en="Refrain from purchase; verify status with DC Office Land Acquisition Branch and AC Land.", limitation_notice_bn="সরকারের ডিরিকুইজিশন আদেশ বা উচ্চ আদালতের নিষেধাজ্ঞা থাকতে পারে।", limitation_notice_en="Deregistration or stay order may exist."))

        # -------------------------------------------------------------------------
        # SCENARIO 10: Survey Chain Gap (MEDIUM RISK, Score 25)
        # Parcel PCL-DH-310: BS Survey exists without link to RS Survey
        p10 = LandParcel(id="PCL-DH-310", administrative_area_id="adm_mirpur", dag_no="310", dag_no_bn="৩১০", bs_dag="310", total_area=8.0, area_unit="decimal")
        db.add(p10)
        db.flush()
        k10_bs = KhatianRecord(id="KHT-310-BS", parcel_id=p10.id, survey_type="BS", khatian_no="912", khatian_no_bn="৯১২", survey_year=2015, predecessor_khatian_id=None)
        db.add(k10_bs)
        db.flush()
        risk10 = RiskAssessment(id="RISK-PCL-310", parcel_id=p10.id, total_score=25, risk_level="MEDIUM", summary_bn="খতিয়ানের ধারাবাহিকতায় বিচ্ছিন্নতা। বিএস খতিয়ানে পূর্ববর্তী আরএস খতিয়ানের সংযোগসূত্র নেই।", summary_en="Gap in survey chain. BS Khatian does not document predecessor RS lineage.")
        db.add(risk10)
        db.flush()
        db.add(RiskFinding(id="FIND-310-01", assessment_id=risk10.id, rule_code="SURVEY_CHAIN_GAP", severity="MEDIUM", score_contribution=25, title_bn="খতিয়ান ধারাবাহিকতায় বিচ্ছিন্নতা (Predecessor Link Gap)", title_en="Missing Predecessor Link in Survey Chain (Gap)", evidence_json=json.dumps({"current_survey": "BS Khatian 912", "predecessor_link": "NOT_RECORDED"}, ensure_ascii=False), recommended_action_bn="ভূমি রেকর্ড ও জরিপ অধিদপ্তর (ডিএলআরএস) থেকে মিস কেস বা আরএস-বিএস মিলতালি তল্লাশি করুন।", recommended_action_en="Obtain RS-BS survey correlation sheet from DLRS archive.", limitation_notice_bn="জরিপের সময় বাটোয়ারা বা নতুন নম্বর সৃজনের কারণে সংযোগসূত্র অপ্রদর্শিত থাকতে পারে।", limitation_notice_en="Survey partition may have generated new plot numbers."))

        # -------------------------------------------------------------------------
        # SCENARIO 11: Low OCR Confidence (MEDIUM RISK, Score 20)
        # Parcel PCL-DH-511: Automated extraction confidence below threshold
        p11 = LandParcel(id="PCL-DH-511", administrative_area_id="adm_tejgaon", dag_no="511", dag_no_bn="৫১১", rs_dag="511", total_area=9.0, area_unit="decimal")
        db.add(p11)
        db.flush()
        doc11 = Document(id="DOC-511", original_filename="blurry_synthetic_scan.png", storage_key="synthetic/blurry.png", mime_type="image/png", file_size_bytes=512000, sha256_hash=dummy_hash("blurry-bytes"), status="EXTRACTED")
        db.add(doc11)
        db.flush()
        job11 = ExtractionJob(id="JOB-511", document_id=doc11.id, status="PENDING_REVIEW", raw_ocr_text="... অস্পষ্ট দলিল ... খতিয়ান [??] ...", average_confidence=0.62)
        db.add(job11)
        db.flush()
        db.add(ExtractedField(id="FLD-511-01", job_id=job11.id, field_name="deed_no", raw_value="??৪৫", normalized_value="unknown", confidence=0.55, is_verified=False, is_critical=True))
        risk11 = RiskAssessment(id="RISK-PCL-511", parcel_id=p11.id, total_score=20, risk_level="MEDIUM", summary_bn="ওসিআর পাঠোদ্ধারে নিম্ন নির্ভুলতা (গড় কনফিডেন্স ৬২%)। কর্মকর্তার ম্যানুয়াল যাচাই ও অনুমোদন ব্যতিরেকে স্বয়ংক্রিয় পোস্টিং স্থগিত।", summary_en="Low OCR confidence (avg 62%). Automated posting blocked pending human review.")
        db.add(risk11)
        db.flush()
        db.add(RiskFinding(id="FIND-511-01", assessment_id=risk11.id, rule_code="LOW_OCR_CONFIDENCE", severity="MEDIUM", score_contribution=20, title_bn="ওসিআর পাঠোদ্ধারে নিম্ন নির্ভুলতা (স্বয়ংক্রিয় পোস্টিং স্থগিত)", title_en="Low OCR Field Confidence (Automatic Posting Blocked)", evidence_json=json.dumps({"average_confidence": 0.62, "job_id": "JOB-511", "status": "PENDING_REVIEW"}, ensure_ascii=False), recommended_action_bn="ওসিআর কিউতে গিয়ে মূল দলিলের স্ক্যান ছবির সাথে মিলিয়ে তথ্য সংশোধন ও অনুমোদন করুন।", recommended_action_en="Inspect document scan in Review Queue and manually verify critical fields.", limitation_notice_bn="নথির স্ক্যান রেজোলিউশন কম হওয়ায় এমনটি হয়েছে।", limitation_notice_en="Due to scan noise/resolution."))

        # -------------------------------------------------------------------------
        # SCENARIO 12: Valid Co-Ownership / Partial Share Transfer (LOW RISK, Score 0)
        # Parcel PCL-DH-901: 3 Heirs hold 0.3333 share each. Heir One sells 0.1666 share.
        # MUST NOT FALSELY TRIGGER DOUBLE-SALE OR SHARE EXCEEDED!
        p12 = LandParcel(
            id="PCL-DH-901",
            administrative_area_id="adm_dhanmondi",
            dag_no="901",
            dag_no_bn="৯০১",
            rs_dag="901",
            bs_dag="901",
            total_area=18.0,
            area_unit="decimal",
            land_class="Homestead",
            land_class_bn="বাস্তু",
        )
        db.add(p12)
        db.flush()

        k12_bs = KhatianRecord(id="KHT-901-BS", parcel_id=p12.id, survey_type="BS", khatian_no="770", khatian_no_bn="৭৭০", survey_year=2018)
        db.add(k12_bs)
        db.flush()
        # 3 Co-owners (0.3333 share each = 1.0 total)
        db.add(KhatianOwner(id="KO-901-H1", khatian_id=k12_bs.id, owner_id="own_08", share_fraction=0.3333, share_ana="৫.৩৩ আনা", area_owned=6.0))
        db.add(KhatianOwner(id="KO-901-H2", khatian_id=k12_bs.id, owner_id="own_09", share_fraction=0.3333, share_ana="৫.৩৩ আনা", area_owned=6.0))
        db.add(KhatianOwner(id="KO-901-H3", khatian_id=k12_bs.id, owner_id="own_10", share_fraction=0.3334, share_ana="৫.৩৪ আনা", area_owned=6.0))

        # Heir One sells 0.1666 share (3.0 decimal) to Md. Tareq Hasan (Citizen)
        doc12 = Document(id="DOC-901", original_filename="synthetic_partial_share_deed.pdf", storage_key="synthetic/doc_901.pdf", mime_type="application/pdf", file_size_bytes=380000, sha256_hash=dummy_hash("partial-share-bytes"), status="APPROVED")
        db.add(doc12)
        db.flush()
        deed12 = Deed(
            id="DEED-901-01",
            deed_no="5510/2023",
            deed_no_bn="৫৫১০/২০২৩",
            registration_office="Dhanmondi Sub-Registry",
            registration_office_bn="ধানমন্ডি সাব-রেজিস্ট্রি অফিস",
            registration_date=datetime(2023, 11, 12),
            parcel_id=p12.id,
            transferred_area=3.0,
            transferred_share=0.1666, # Valid fraction <= 0.3333
            status="APPROVED",
            document_id=doc12.id,
        )
        db.add(deed12)
        db.flush()
        db.add(Transaction(id="TX-901-01", deed_id=deed12.id, seller_id="own_08", buyer_id="own_01", share_transferred=0.1666, area_transferred=3.0, effective_date=datetime(2023, 11, 12)))

        risk12 = RiskAssessment(
            id="RISK-PCL-901",
            parcel_id=p12.id,
            total_score=0,
            risk_level="LOW",
            summary_bn="বৈধ সহ-মালিকানা ও আংশিক হস্তান্তর। বিক্রেতা তার বৈধ প্রাপ্ত অংশের (০.৩৩৩৩) মধ্য থেকে ০.১৬৬৬ অংশ হস্তান্তর করেছেন। কোনো স্বত্ব লঙ্ঘন বা দ্বৈত বিক্রয়ের অসঙ্গতি নেই।",
            summary_en="Valid co-ownership and fractional transfer. Vendor properly transferred 0.1666 share out of their verified 0.3333 entitlement. No double-sale or over-transfer.",
        )
        db.add(risk12)

        # -------------------------------------------------------------------------
        # Seed Simulated Mutation Cases for Testing & Demo
        # -------------------------------------------------------------------------
        mut_case_1 = MutationCase(
            id="MUT-CASE-01",
            case_no="MUT-2024-9912",
            case_no_bn="নামজারি-২০২৪-৯৯১২",
            opaque_reference="mut-ref-847291a9b",
            parcel_id=p1.id,
            deed_id=deed1.id,
            applicant_name="Md. Tareq Hasan",
            applicant_name_bn="মোঃ তারেক হাসান",
            applicant_nid="DEMO-1990-00101",
            status="OFFICER_REVIEW",
            office_name="Tejgaon Circle AC Land Office (Simulated)",
            office_name_bn="তেজগাঁও সার্কেল সহকারী কমিশনার (ভূমি) কার্যালয় (সিমুলেটেড)",
            remarks="দলিল ও মাঠ খসড়া যাচাই সমাপ্ত। আদেশ লিপিবদ্ধকরণের অপেক্ষায়।",
        )
        db.add(mut_case_1)
        db.flush()

        checklist_items = [
            MutationChecklistItem(id="MCL-01", case_id=mut_case_1.id, item_code="DEED_VERIFIED", label_bn="মূল দলিলের বালাম যাচাই ও সত্যতা নিশ্চিতকরণ", label_en="Original Registry volume checked and verified", is_checked=True, checked_by="Nazmul Haque", checked_at=datetime.utcnow()),
            MutationChecklistItem(id="MCL-02", case_id=mut_case_1.id, item_code="KHATIAN_CHAIN_CHECKED", label_bn="সিএস থেকে বিএস খতিয়ান শৃঙ্খল পরীক্ষা", label_en="CS to BS khatian lineage continuity verified", is_checked=True, checked_by="Nazmul Haque", checked_at=datetime.utcnow()),
            MutationChecklistItem(id="MCL-03", case_id=mut_case_1.id, item_code="FIELD_REPORT_RECEIVED", label_bn="ইউনিয়ন ভূমি উপ-সহকারীর দখল তদন্ত প্রতিবেদন প্রাপ্তি", label_en="Union land assistant field possession report received", is_checked=True, checked_by="Nazmul Haque", checked_at=datetime.utcnow()),
            MutationChecklistItem(id="MCL-04", case_id=mut_case_1.id, item_code="NOTICE_SERVED", label_bn="সহ-শরিক ও স্বার্থসংশ্লিষ্ট পক্ষগণকে নোটিশ জারি", label_en="Notice served to co-sharers and interested parties", is_checked=True, checked_by="Nazmul Haque", checked_at=datetime.utcnow()),
            MutationChecklistItem(id="MCL-05", case_id=mut_case_1.id, item_code="NO_ACQUISITION_FLAG", label_bn="সম্পত্তি সরকারি খাস বা অধিগ্রহণমুক্ত মর্মে প্রত্যয়ন", label_en="Clear of government khas or acquisition notices", is_checked=True, checked_by="Nazmul Haque", checked_at=datetime.utcnow()),
        ]
        db.add_all(checklist_items)

        db.add(MutationEvent(
            id="ME-01",
            case_id=mut_case_1.id,
            from_stage="DRAFT",
            to_stage="SUBMITTED",
            actor_name="Md. Tareq Hasan",
            notes="অনলাইনে প্রাথমিক আবেদন দাখিল করা হয়েছে।",
            created_at=datetime.utcnow() - timedelta(days=12),
        ))
        db.add(MutationEvent(
            id="ME-02",
            case_id=mut_case_1.id,
            from_stage="SUBMITTED",
            to_stage="DOCUMENT_CHECK",
            actor_name="Farzana Akter",
            notes="নথিপত্র গ্রহণ ও দাখিলা যাচাই সম্পন্ন।",
            created_at=datetime.utcnow() - timedelta(days=7),
        ))
        db.add(MutationEvent(
            id="ME-03",
            case_id=mut_case_1.id,
            from_stage="DOCUMENT_CHECK",
            to_stage="OFFICER_REVIEW",
            actor_name="Nazmul Haque",
            notes="মাঠ প্রতিবেদন ইতিবাচক, সহকারী কমিশনারের নথিজাতকরণ সম্পন্ন।",
            created_at=datetime.utcnow() - timedelta(days=2),
        ))

        # -------------------------------------------------------------------------
        # Seed Initial Audit Log
        # -------------------------------------------------------------------------
        db.add(AuditLog(
            id="AUD-SEED-01",
            actor_id="usr_admin_01",
            actor_name="System Admin",
            actor_role="admin",
            action="DATABASE_SEEDED_12_SCENARIOS",
            entity_type="Database",
            entity_id="ALL",
            request_ip="127.0.0.1",
            metadata_json=json.dumps({"scenarios_count": 12, "status": "SUCCESS"}, ensure_ascii=False),
        ))

        db.commit()
        print("Database seeded successfully with 12 deterministic scenarios!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
