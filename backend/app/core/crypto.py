import os
import base64
from datetime import datetime
from typing import Tuple, Optional
from cryptography.hazmat.primitives.asymmetric import ed25519
from cryptography.hazmat.primitives import serialization
from backend.app.core.config import settings

# Dedicated Ed25519 key manager
_private_key: Optional[ed25519.Ed25519PrivateKey] = None
_public_key: Optional[ed25519.Ed25519PublicKey] = None

def get_or_create_keypair() -> Tuple[ed25519.Ed25519PrivateKey, ed25519.Ed25519PublicKey]:
    """
    Retrieve or initialize the active Ed25519 server-side signing keypair.
    Private key stays securely in server environment/memory, never in Git or frontend.
    """
    global _private_key, _public_key
    if _private_key is not None and _public_key is not None:
        return _private_key, _public_key

    # Check environment variable for private key hex/bytes or generate deterministic dev key
    key_seed = os.getenv("ED25519_PRIVATE_KEY_SEED")
    if key_seed:
        seed_bytes = bytes.fromhex(key_seed)
        _private_key = ed25519.Ed25519PrivateKey.from_private_bytes(seed_bytes)
    else:
        # Generate stable in-memory key for this runtime
        _private_key = ed25519.Ed25519PrivateKey.generate()

    _public_key = _private_key.public_key()
    return _private_key, _public_key

def sign_receipt_payload(opaque_id: str, sha256_hash: str, issued_at: datetime, key_id: str) -> str:
    """
    Create Ed25519 signature over canonical receipt payload:
    payload = "key_id:{key_id}|opaque_id:{opaque_id}|sha256:{sha256_hash}|issued_at:{iso}"
    """
    private_key, _ = get_or_create_keypair()
    canonical_payload = (
        f"key_id:{key_id}|opaque_id:{opaque_id}|sha256:{sha256_hash}|issued_at:{issued_at.isoformat()}"
    )
    signature_bytes = private_key.sign(canonical_payload.encode("utf-8"))
    return signature_bytes.hex()

def verify_receipt_signature(
    opaque_id: str,
    sha256_hash: str,
    issued_at: datetime,
    key_id: str,
    signature_hex: str,
) -> bool:
    """
    Verify Ed25519 signature against canonical receipt payload.
    """
    try:
        _, public_key = get_or_create_keypair()
        canonical_payload = (
            f"key_id:{key_id}|opaque_id:{opaque_id}|sha256:{sha256_hash}|issued_at:{issued_at.isoformat()}"
        )
        signature_bytes = bytes.fromhex(signature_hex)
        public_key.verify(signature_bytes, canonical_payload.encode("utf-8"))
        return True
    except Exception:
        return False

def get_public_key_hex() -> str:
    _, public_key = get_or_create_keypair()
    public_bytes = public_key.public_bytes(
        encoding=serialization.Encoding.Raw,
        format=serialization.PublicFormat.Raw,
    )
    return public_bytes.hex()
