import re
from dataclasses import dataclass
from typing import List, Dict, Optional, Any

@dataclass
class ExtractedFieldResult:
    field_name: str
    raw_value: Optional[str]
    normalized_value: Optional[str]
    confidence: float
    is_critical: bool = True
    is_verified: bool = False

def convert_bn_digits_to_en(text: str) -> str:
    bn_to_en = str.maketrans("০১২৩৪৫৬৭৮৯", "0123456789")
    return text.translate(bn_to_en)

class DeterministicExtractor:
    """
    Deterministic rule-based extractor parsing structured land documents
    from raw OCR text in Bengali and English.
    """
    def extract_fields(self, raw_text: str) -> List[ExtractedFieldResult]:
        fields: List[ExtractedFieldResult] = []

        # 1. Deed Number (দলিল নং)
        deed_no_match = re.search(r'(?:দলিল\s*নং|Deed\s*No)[\s:]*([০-৯0-9/]+)', raw_text, re.IGNORECASE)
        if deed_no_match:
            raw_val = deed_no_match.group(1).strip()
            norm_val = convert_bn_digits_to_en(raw_val)
            fields.append(ExtractedFieldResult(
                field_name="deed_no",
                raw_value=raw_val,
                normalized_value=norm_val,
                confidence=0.94,
                is_critical=True,
            ))
        else:
            fields.append(ExtractedFieldResult(
                field_name="deed_no",
                raw_value=None,
                normalized_value="unknown",
                confidence=0.0,
                is_critical=True,
            ))

        # 2. Registration Date (রেজিস্ট্রির তারিখ)
        date_match = re.search(r'(?:তারিখ|Date)[\s:]*([০-৯0-9\-/\.]+)', raw_text, re.IGNORECASE)
        if date_match:
            raw_val = date_match.group(1).strip()
            norm_val = convert_bn_digits_to_en(raw_val).replace("/", "-").replace(".", "-")
            fields.append(ExtractedFieldResult(
                field_name="registration_date",
                raw_value=raw_val,
                normalized_value=norm_val,
                confidence=0.92,
                is_critical=True,
            ))
        else:
            fields.append(ExtractedFieldResult(
                field_name="registration_date",
                raw_value=None,
                normalized_value="unknown",
                confidence=0.0,
                is_critical=True,
            ))

        # 3. Dag Number (দাগ নং)
        dag_match = re.search(r'(?:দাগ\s*নং|Dag\s*No|Plot\s*No)[\s:]*([০-৯0-9]+)', raw_text, re.IGNORECASE)
        if dag_match:
            raw_val = dag_match.group(1).strip()
            norm_val = convert_bn_digits_to_en(raw_val)
            fields.append(ExtractedFieldResult(
                field_name="dag_no",
                raw_value=raw_val,
                normalized_value=norm_val,
                confidence=0.95,
                is_critical=True,
            ))
        else:
            fields.append(ExtractedFieldResult(
                field_name="dag_no",
                raw_value=None,
                normalized_value="unknown",
                confidence=0.0,
                is_critical=True,
            ))

        # 4. Khatian Number (খতিয়ান নং)
        kht_match = re.search(r'(?:খতিয়ান\s*নং|Khatian\s*No)[\s:]*([০-৯0-9]+)', raw_text, re.IGNORECASE)
        if kht_match:
            raw_val = kht_match.group(1).strip()
            norm_val = convert_bn_digits_to_en(raw_val)
            fields.append(ExtractedFieldResult(
                field_name="khatian_no",
                raw_value=raw_val,
                normalized_value=norm_val,
                confidence=0.93,
                is_critical=True,
            ))
        else:
            fields.append(ExtractedFieldResult(
                field_name="khatian_no",
                raw_value=None,
                normalized_value="unknown",
                confidence=0.0,
                is_critical=True,
            ))

        # 5. Land Area (জমির পরিমাণ)
        area_match = re.search(r'(?:জমির\s*পরিমাণ|Area)[\s:]*([০-৯0-9\.]+)\s*(?:শতক|decimal|একর|acre)?', raw_text, re.IGNORECASE)
        if area_match:
            raw_val = area_match.group(1).strip()
            norm_val = convert_bn_digits_to_en(raw_val)
            fields.append(ExtractedFieldResult(
                field_name="transferred_area",
                raw_value=raw_val,
                normalized_value=norm_val,
                confidence=0.91,
                is_critical=True,
            ))
        else:
            fields.append(ExtractedFieldResult(
                field_name="transferred_area",
                raw_value=None,
                normalized_value="unknown",
                confidence=0.0,
                is_critical=True,
            ))

        # 6. Seller Name (বিক্রেতা/দাতা)
        seller_match = re.search(r'(?:বিক্রেতা|দাতা|Vendor)[\s:/]*([^\n(]+)', raw_text, re.IGNORECASE)
        if seller_match:
            raw_val = seller_match.group(1).strip()
            fields.append(ExtractedFieldResult(
                field_name="seller_name",
                raw_value=raw_val,
                normalized_value=raw_val,
                confidence=0.89,
                is_critical=True,
            ))
        else:
            fields.append(ExtractedFieldResult(
                field_name="seller_name",
                raw_value=None,
                normalized_value="unknown",
                confidence=0.0,
                is_critical=True,
            ))

        # 7. Buyer Name (গ্রহীতা/ক্রেতা)
        buyer_match = re.search(r'(?:গ্রহীতা|ক্রেতা|Purchaser|Buyer)[\s:/]*([^\n(]+)', raw_text, re.IGNORECASE)
        if buyer_match:
            raw_val = buyer_match.group(1).strip()
            fields.append(ExtractedFieldResult(
                field_name="buyer_name",
                raw_value=raw_val,
                normalized_value=raw_val,
                confidence=0.90,
                is_critical=True,
            ))
        else:
            fields.append(ExtractedFieldResult(
                field_name="buyer_name",
                raw_value=None,
                normalized_value="unknown",
                confidence=0.0,
                is_critical=True,
            ))

        return fields
