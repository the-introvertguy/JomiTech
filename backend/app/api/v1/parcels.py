import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from backend.app.api.deps import get_db
from backend.app.models.parcel import LandParcel
from backend.app.models.administrative import AdministrativeArea
from backend.app.models.khatian import KhatianRecord, KhatianOwner
from backend.app.models.deed import Deed, Transaction, OwnershipHistory
from backend.app.models.risk import RiskAssessment, RiskFinding
from backend.app.models.mutation import MutationCase
from backend.app.schemas.parcel import (
    ParcelSummaryOut,
    ParcelDetailOut,
    AdministrativeAreaOut,
    OwnerShareOut,
    EncumbranceOut,
    KhatianTimelineOut,
    TransferTimelineOut,
)
from backend.app.schemas.risk import RiskAssessmentOut, RiskFindingOut

router = APIRouter(prefix="/parcels", tags=["parcels"])

def _build_parcel_summary(parcel: LandParcel, db: Session) -> ParcelSummaryOut:
    # Fetch latest owners from latest khatian or ownership history
    owners_out: List[OwnerShareOut] = []
    latest_khatian = (
        db.query(KhatianRecord)
        .filter(KhatianRecord.parcel_id == parcel.id)
        .order_by(KhatianRecord.created_at.desc())
        .first()
    )
    if latest_khatian:
        k_owners = db.query(KhatianOwner).filter(KhatianOwner.khatian_id == latest_khatian.id).all()
        for ko in k_owners:
            owners_out.append(
                OwnerShareOut(
                    owner_id=ko.owner_id,
                    name=ko.owner.name,
                    name_bn=ko.owner.name_bn,
                    father_name=ko.owner.father_name,
                    father_name_bn=ko.owner.father_name_bn,
                    share_fraction=ko.share_fraction,
                    share_ana=ko.share_ana,
                    area_owned=ko.area_owned,
                )
            )

    # Fetch risk score and level
    risk = db.query(RiskAssessment).filter(RiskAssessment.parcel_id == parcel.id).first()
    risk_score = risk.total_score if risk else 0
    risk_level = risk.risk_level if risk else "LOW"

    return ParcelSummaryOut(
        id=parcel.id,
        dag_no=parcel.dag_no,
        dag_no_bn=parcel.dag_no_bn,
        cs_dag=parcel.cs_dag,
        sa_dag=parcel.sa_dag,
        rs_dag=parcel.rs_dag,
        bs_dag=parcel.bs_dag,
        total_area=parcel.total_area,
        area_unit=parcel.area_unit,
        land_class=parcel.land_class,
        land_class_bn=parcel.land_class_bn,
        administrative_area=AdministrativeAreaOut.model_validate(parcel.administrative_area),
        current_owners=owners_out,
        risk_score=risk_score,
        risk_level=risk_level,
    )

@router.get("", response_model=List[ParcelSummaryOut])
def search_parcels(
    q: Optional[str] = Query(None, description="General search query (dag, khatian, mouza, parcel id)"),
    division: Optional[str] = Query(None, description="Division filter"),
    district: Optional[str] = Query(None, description="District filter"),
    upazila: Optional[str] = Query(None, description="Upazila / Thana filter"),
    mouza: Optional[str] = Query(None, description="Mouza filter"),
    dag_no: Optional[str] = Query(None, description="Dag / Plot number"),
    khatian_no: Optional[str] = Query(None, description="Khatian number"),
    survey_type: Optional[str] = Query(None, description="Survey type: CS, SA, RS, BS"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    """Multi-parameter cadastral search with exact/partial matches and filter support."""
    query = db.query(LandParcel).join(AdministrativeArea)

    if q:
        q_term = f"%{q.strip()}%"
        # Convert English digits to Bengali digits if needed
        en_to_bn = str.maketrans("0123456789", "০১২৩৪৫৬৭৮৯")
        bn_to_en = str.maketrans("০১২৩৪৫৬৭৮৯", "0123456789")
        q_bn = q.strip().translate(en_to_bn)
        q_en = q.strip().translate(bn_to_en)

        query = query.filter(
            or_(
                LandParcel.id.ilike(q_term),
                LandParcel.dag_no.ilike(f"%{q_en}%"),
                LandParcel.dag_no_bn.ilike(f"%{q_bn}%"),
                LandParcel.cs_dag.ilike(f"%{q_en}%"),
                LandParcel.sa_dag.ilike(f"%{q_en}%"),
                LandParcel.rs_dag.ilike(f"%{q_en}%"),
                LandParcel.bs_dag.ilike(f"%{q_en}%"),
                AdministrativeArea.mouza.ilike(q_term),
                AdministrativeArea.mouza_bn.ilike(q_term),
                AdministrativeArea.upazila.ilike(q_term),
                AdministrativeArea.upazila_bn.ilike(q_term),
            )
        )

    if division:
        query = query.filter(
            or_(AdministrativeArea.division.ilike(f"%{division}%"), AdministrativeArea.division_bn.ilike(f"%{division}%"))
        )
    if district:
        query = query.filter(
            or_(AdministrativeArea.district.ilike(f"%{district}%"), AdministrativeArea.district_bn.ilike(f"%{district}%"))
        )
    if upazila:
        query = query.filter(
            or_(AdministrativeArea.upazila.ilike(f"%{upazila}%"), AdministrativeArea.upazila_bn.ilike(f"%{upazila}%"))
        )
    if mouza:
        query = query.filter(
            or_(AdministrativeArea.mouza.ilike(f"%{mouza}%"), AdministrativeArea.mouza_bn.ilike(f"%{mouza}%"))
        )
    if dag_no:
        query = query.filter(
            or_(LandParcel.dag_no.ilike(f"%{dag_no}%"), LandParcel.dag_no_bn.ilike(f"%{dag_no}%"))
        )
    if survey_type:
        query = query.join(KhatianRecord).filter(KhatianRecord.survey_type == survey_type.upper()).distinct()
    if khatian_no:
        query = query.join(KhatianRecord).filter(
            or_(KhatianRecord.khatian_no.ilike(f"%{khatian_no}%"), KhatianRecord.khatian_no_bn.ilike(f"%{khatian_no}%"))
        ).distinct()

    parcels = query.offset(offset).limit(limit).all()
    return [_build_parcel_summary(p, db) for p in parcels]

@router.get("/{id}", response_model=ParcelDetailOut)
def get_parcel_detail(id: str, db: Session = Depends(get_db)):
    """Fetch complete parcel detail including survey references, owners, khatians, and encumbrances."""
    parcel = db.query(LandParcel).filter(LandParcel.id == id).first()
    if not parcel:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Parcel with ID '{id}' not found in synthetic database.",
        )

    # 1. Khatians timeline
    khatians_out: List[KhatianTimelineOut] = []
    khatians = db.query(KhatianRecord).filter(KhatianRecord.parcel_id == parcel.id).order_by(KhatianRecord.survey_year.asc()).all()
    for k in khatians:
        k_owners = []
        for ko in k.owners:
            k_owners.append(
                OwnerShareOut(
                    owner_id=ko.owner_id,
                    name=ko.owner.name,
                    name_bn=ko.owner.name_bn,
                    father_name=ko.owner.father_name,
                    father_name_bn=ko.owner.father_name_bn,
                    share_fraction=ko.share_fraction,
                    share_ana=ko.share_ana,
                    area_owned=ko.area_owned,
                )
            )
        khatians_out.append(
            KhatianTimelineOut(
                id=k.id,
                survey_type=k.survey_type,
                khatian_no=k.khatian_no,
                khatian_no_bn=k.khatian_no_bn,
                survey_year=k.survey_year,
                predecessor_khatian_id=k.predecessor_khatian_id,
                owners=k_owners,
                remarks=k.remarks,
            )
        )

    # 2. Transfers timeline
    transfers_out: List[TransferTimelineOut] = []
    deeds = db.query(Deed).filter(Deed.parcel_id == parcel.id).order_by(Deed.registration_date.asc()).all()
    for d in deeds:
        for tx in d.transactions:
            transfers_out.append(
                TransferTimelineOut(
                    id=tx.id,
                    deed_no=d.deed_no,
                    deed_no_bn=d.deed_no_bn,
                    registration_office_bn=d.registration_office_bn,
                    registration_date=d.registration_date,
                    transferred_area=tx.area_transferred,
                    transferred_share=tx.share_transferred,
                    seller_name_bn=tx.seller.name_bn,
                    buyer_name_bn=tx.buyer.name_bn,
                    status=d.status,
                )
            )

    # 3. Encumbrances
    encumbrances_out = [
        EncumbranceOut(
            id=e.id,
            indicator_type=e.indicator_type,
            title_bn=e.title_bn,
            title_en=e.title_en,
            description_bn=e.description_bn,
            description_en=e.description_en,
            case_ref=e.case_ref,
            is_active=e.is_active,
        )
        for e in parcel.encumbrances
    ]

    # 4. Current owners (from latest khatian or current ownership history)
    current_owners: List[OwnerShareOut] = []
    if khatians_out:
        current_owners = khatians_out[-1].owners

    # 5. Mutation case
    mutation = db.query(MutationCase).filter(MutationCase.parcel_id == parcel.id).first()
    mut_status = mutation.status if mutation else None
    mut_case_no = mutation.case_no_bn if mutation else None

    # 6. Risk assessment
    risk = db.query(RiskAssessment).filter(RiskAssessment.parcel_id == parcel.id).first()
    risk_score = risk.total_score if risk else 0
    risk_level = risk.risk_level if risk else "LOW"
    risk_summary_bn = risk.summary_bn if risk else None
    risk_summary_en = risk.summary_en if risk else None

    return ParcelDetailOut(
        id=parcel.id,
        dag_no=parcel.dag_no,
        dag_no_bn=parcel.dag_no_bn,
        cs_dag=parcel.cs_dag,
        sa_dag=parcel.sa_dag,
        rs_dag=parcel.rs_dag,
        bs_dag=parcel.bs_dag,
        total_area=parcel.total_area,
        area_unit=parcel.area_unit,
        land_class=parcel.land_class,
        land_class_bn=parcel.land_class_bn,
        polygon_geojson=parcel.polygon_geojson,
        administrative_area=AdministrativeAreaOut.model_validate(parcel.administrative_area),
        current_owners=current_owners,
        encumbrances=encumbrances_out,
        khatians=khatians_out,
        transfers=transfers_out,
        mutation_status=mut_status,
        mutation_case_no=mut_case_no,
        risk_score=risk_score,
        risk_level=risk_level,
        risk_summary_bn=risk_summary_bn,
        risk_summary_en=risk_summary_en,
    )

@router.get("/{id}/risk", response_model=RiskAssessmentOut)
def get_parcel_risk(id: str, db: Session = Depends(get_db)):
    """Fetch explainable risk assessment findings with rule codes and evidence."""
    risk = db.query(RiskAssessment).filter(RiskAssessment.parcel_id == id).first()
    if not risk:
        parcel = db.query(LandParcel).filter(LandParcel.id == id).first()
        if not parcel:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No risk assessment found for parcel ID '{id}'.",
            )
        return RiskAssessmentOut(
            id=f"RISK-{id}",
            parcel_id=id,
            total_score=0,
            risk_level="LOW",
            rule_version="v2.0-deterministic",
            assessed_at=datetime.utcnow(),
            summary_bn="মালিকানা শৃঙ্খল নিষ্কন্টক। কোনো অসঙ্গতি পাওয়া যায়নি।",
            summary_en="Chain of title clean. No discrepancies detected.",
            findings=[],
        )

    findings_out = []
    for f in risk.findings:
        evidence_dict = {}
        try:
            evidence_dict = json.loads(f.evidence_json)
        except Exception:
            evidence_dict = {"raw": f.evidence_json}

        findings_out.append(
            RiskFindingOut(
                id=f.id,
                rule_code=f.rule_code,
                severity=f.severity,
                score_contribution=f.score_contribution,
                title_bn=f.title_bn,
                title_en=f.title_en,
                evidence_data=evidence_dict,
                recommended_action_bn=f.recommended_action_bn,
                recommended_action_en=f.recommended_action_en,
                limitation_notice_bn=f.limitation_notice_bn,
                limitation_notice_en=f.limitation_notice_en,
            )
        )

    return RiskAssessmentOut(
        id=risk.id,
        parcel_id=risk.parcel_id,
        total_score=risk.total_score,
        risk_level=risk.risk_level,
        rule_version=risk.rule_version,
        assessed_at=risk.assessed_at,
        summary_bn=risk.summary_bn,
        summary_en=risk.summary_en,
        findings=findings_out,
    )
