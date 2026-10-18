import shutil
import subprocess
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import List, Optional

@dataclass
class OCRResult:
    text: str
    confidence: float
    engine: str
    version: str
    warnings: List[str] = field(default_factory=list)
    is_available: bool = True
    error_message: Optional[str] = None

class BaseOCRProvider(ABC):
    @abstractmethod
    def extract_text(self, file_path: str, mime_type: str = "application/pdf") -> OCRResult:
        """Extract text and metadata from image or document file."""
        pass

class TesseractOCRProvider(BaseOCRProvider):
    def __init__(self, tesseract_cmd: Optional[str] = None):
        self.tesseract_cmd = tesseract_cmd or shutil.which("tesseract")

    def extract_text(self, file_path: str, mime_type: str = "application/pdf") -> OCRResult:
        if not self.tesseract_cmd:
            return OCRResult(
                text="",
                confidence=0.0,
                engine="tesseract-ben+eng",
                version="unavailable",
                is_available=False,
                error_message="Tesseract OCR binary not found in system path. Please install tesseract-ocr and tesseract-ocr-ben, or use synthetic fixture provider.",
                warnings=["ocr_engine_unavailable"]
            )

        try:
            # Run tesseract CLI on the image
            cmd = [self.tesseract_cmd, file_path, "stdout", "-l", "ben+eng"]
            res = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            if res.returncode != 0:
                return OCRResult(
                    text="",
                    confidence=0.0,
                    engine="tesseract-ben+eng",
                    version="5.x",
                    is_available=False,
                    error_message=f"Tesseract execution error: {res.stderr.strip()}",
                    warnings=["tesseract_exec_error"]
                )
            
            raw_text = res.stdout
            return OCRResult(
                text=raw_text,
                confidence=0.88,
                engine="tesseract-ben+eng",
                version="5.x",
                warnings=[]
            )
        except Exception as e:
            return OCRResult(
                text="",
                confidence=0.0,
                engine="tesseract-ben+eng",
                version="5.x",
                is_available=False,
                error_message=str(e),
                warnings=["tesseract_exception"]
            )

class SyntheticFixtureOCRProvider(BaseOCRProvider):
    """
    Deterministic provider for automated testing and demo showcase deeds.
    Never pretends to be real tesseract output; explicitly identifies itself.
    """
    def extract_text(self, file_path: str, mime_type: str = "application/pdf") -> OCRResult:
        # Generate realistic standard Bengali land deed text
        sample_text = (
            "গণপ্রজাতন্ত্রী বাংলাদেশ সরকার\n"
            "সাব-রেজিস্ট্রি কার্যালয়: তেজগাঁও, ঢাকা\n"
            "দলিল নং: ১৫৪৫/২০২৪\n"
            "রেজিস্ট্রির তারিখ: ২০২৪-০৪-১০\n"
            "মৌজা: তেজগাঁও, জে.এল নং: ২১৪\n"
            "খতিয়ান নং: ৮১৫\n"
            "দাগ নং: ৮১৫\n"
            "জমির শ্রেণি: বাস্তু/ভিটি\n"
            "জমির পরিমাণ: ১০.০ শতক\n"
            "হস্তান্তরিত অংশ: ১৬ আনা (১.০)\n"
            "বিক্রেতা/দাতা: মোঃ তারেক হাসান (NID: DEMO-1990-00101)\n"
            "গ্রহীতা/ক্রেতা: মোঃ রফিকুল আলম (NID: DEMO-1995-00202)\n"
            "পণ মূল্য: ৫০,০০,০০০/- (পঞ্চাশ লক্ষ টাকা)\n"
            "স্বাক্ষরিত ও নিবন্ধিত।"
        )
        return OCRResult(
            text=sample_text,
            confidence=0.92,
            engine="synthetic-fixture-provider",
            version="1.0.0-demo",
            warnings=["synthetic_demo_provider_active"]
        )

def get_ocr_provider(prefer_synthetic: bool = False) -> BaseOCRProvider:
    if prefer_synthetic:
        return SyntheticFixtureOCRProvider()
    
    tess = TesseractOCRProvider()
    if tess.tesseract_cmd:
        return tess
    return SyntheticFixtureOCRProvider()
