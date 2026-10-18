export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== 'undefined' ? '/api/v1' : 'http://127.0.0.1:8000/api/v1');

export interface AdministrativeArea {
  id: string;
  division: string;
  division_bn: string;
  district: string;
  district_bn: string;
  upazila: string;
  upazila_bn: string;
  mouza: string;
  mouza_bn: string;
  jl_no?: string;
  jl_no_bn?: string;
}

export interface OwnerShare {
  owner_id: string;
  name: string;
  name_bn: string;
  father_name?: string;
  father_name_bn?: string;
  share_fraction: number;
  share_ana?: string;
  area_owned?: number;
}

export interface Encumbrance {
  id: string;
  indicator_type: string;
  title_bn: string;
  title_en: string;
  description_bn: string;
  description_en: string;
  case_ref?: string;
  is_active: boolean;
}

export interface ParcelSummary {
  id: string;
  dag_no: string;
  dag_no_bn: string;
  cs_dag?: string;
  sa_dag?: string;
  rs_dag?: string;
  bs_dag?: string;
  total_area: number;
  area_unit: string;
  land_class: string;
  land_class_bn: string;
  administrative_area: AdministrativeArea;
  current_owners: OwnerShare[];
  risk_score: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface KhatianTimeline {
  id: string;
  survey_type: string;
  khatian_no: string;
  khatian_no_bn: string;
  survey_year?: number;
  predecessor_khatian_id?: string;
  owners: OwnerShare[];
  remarks?: string;
}

export interface TransferTimeline {
  id: string;
  deed_no: string;
  deed_no_bn: string;
  registration_office_bn: string;
  registration_date: string;
  transferred_area: number;
  transferred_share: number;
  seller_name_bn: string;
  buyer_name_bn: string;
  status: string;
}

export interface ParcelDetail extends ParcelSummary {
  polygon_geojson?: string;
  encumbrances: Encumbrance[];
  khatians: KhatianTimeline[];
  transfers: TransferTimeline[];
  mutation_status?: string;
  mutation_case_no?: string;
  risk_summary_bn?: string;
  risk_summary_en?: string;
}

export interface RiskFinding {
  id: string;
  rule_code: string;
  severity: string;
  score_contribution: number;
  title_bn: string;
  title_en: string;
  evidence_data: Record<string, any>;
  recommended_action_bn: string;
  recommended_action_en: string;
  limitation_notice_bn: string;
  limitation_notice_en: string;
}

export interface RiskAssessment {
  id: string;
  parcel_id: string;
  total_score: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  rule_version: string;
  assessed_at: string;
  summary_bn?: string;
  summary_en?: string;
  findings: RiskFinding[];
}

export async function fetchParcels(params?: {
  q?: string;
  division?: string;
  district?: string;
  upazila?: string;
  mouza?: string;
  dag_no?: string;
  khatian_no?: string;
  survey_type?: string;
}): Promise<ParcelSummary[]> {
  const query = new URLSearchParams();
  if (params?.q) query.set('q', params.q);
  if (params?.division) query.set('division', params.division);
  if (params?.district) query.set('district', params.district);
  if (params?.upazila) query.set('upazila', params.upazila);
  if (params?.mouza) query.set('mouza', params.mouza);
  if (params?.dag_no) query.set('dag_no', params.dag_no);
  if (params?.khatian_no) query.set('khatian_no', params.khatian_no);
  if (params?.survey_type) query.set('survey_type', params.survey_type);

  try {
    const res = await fetch(`${API_BASE_URL}/parcels?${query.toString()}`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch parcels');
    return await res.json();
  } catch (err) {
    console.error('API Error:', err);
    return [];
  }
}

export async function fetchParcelDetail(id: string): Promise<ParcelDetail | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/parcels/${id}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error(`API Error for parcel ${id}:`, err);
    return null;
  }
}

export async function fetchParcelRisk(id: string): Promise<RiskAssessment | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/parcels/${id}/risk`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error(`API Error for risk ${id}:`, err);
    return null;
  }
}

export interface DocumentItem {
  id: string;
  original_filename: string;
  mime_type: string;
  file_size_bytes: number;
  sha256_hash: string;
  status: string;
  source: string;
  uploaded_at: string;
}

export interface ExtractedFieldItem {
  id: string;
  job_id: string;
  field_name: string;
  raw_value?: string;
  normalized_value?: string;
  confidence: number;
  source_page: number;
  reviewer_value?: string;
  is_verified: boolean;
  is_critical: boolean;
}

export interface ExtractionJobItem {
  id: string;
  document_id: string;
  ocr_engine: string;
  ocr_version: string;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  raw_ocr_text?: string;
  average_confidence: number;
  rejection_reason?: string;
  reviewer_id?: string;
  reviewed_at?: string;
  created_at: string;
  document: DocumentItem;
  fields: ExtractedFieldItem[];
}

export async function uploadDocumentFile(formData: FormData): Promise<DocumentItem | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/documents`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Upload failed');
    return await res.json();
  } catch (err) {
    console.error('Upload Error:', err);
    return null;
  }
}

export async function triggerExtractionJob(docId: string): Promise<ExtractionJobItem | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/documents/${docId}/extract`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Extraction trigger failed');
    return await res.json();
  } catch (err) {
    console.error('Extraction Error:', err);
    return null;
  }
}

export async function fetchReviewQueue(): Promise<ExtractionJobItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/review-queue`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch review queue');
    return await res.json();
  } catch (err) {
    console.error('Queue Error:', err);
    return [];
  }
}

export async function updateExtractionFieldCorrections(
  jobId: string,
  corrections: { field_name: string; reviewer_value: string }[]
): Promise<ExtractionJobItem | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/extractions/${jobId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corrections),
    });
    if (!res.ok) throw new Error('Failed to update fields');
    return await res.json();
  } catch (err) {
    console.error('Correction Error:', err);
    return null;
  }
}

export async function approveExtractionJob(jobId: string): Promise<ExtractionJobItem | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/extractions/${jobId}/approve`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Approval failed');
    return await res.json();
  } catch (err) {
    console.error('Approve Error:', err);
    return null;
  }
}

export async function rejectExtractionJob(jobId: string, reason: string): Promise<ExtractionJobItem | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/extractions/${jobId}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    if (!res.ok) throw new Error('Rejection failed');
    return await res.json();
  } catch (err) {
    console.error('Reject Error:', err);
    return null;
  }
}

export interface PublicVerifyData {
  opaque_id: string;
  status: 'VALID' | 'TAMPERED' | 'REVOKED' | 'EXPIRED' | 'UNKNOWN';
  sha256_match: boolean;
  signature_valid: boolean;
  document_sha256?: string;
  key_id?: string;
  issued_at?: string;
  synthetic_reference_id?: string;
  civic_explanation: string;
  civic_explanation_bn: string;
  contains_pii: boolean;
}

export async function verifyReceiptPublic(opaqueId: string): Promise<PublicVerifyData | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/public/verify/${opaqueId}`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Verification request failed');
    return await res.json();
  } catch (err) {
    console.error('Verify Error:', err);
    return null;
  }
}

export async function verifyCandidateCopy(docId: string, formData: FormData): Promise<any> {
  try {
    const res = await fetch(`${API_BASE_URL}/documents/${docId}/verify-copy`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Verify copy failed');
    return await res.json();
  } catch (err) {
    console.error('Verify Copy Error:', err);
    return null;
  }
}
