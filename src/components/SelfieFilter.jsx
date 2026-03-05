/**
 * SelfieFilter — ArcFace-based selfie matching
 *
 * How it works:
 *  1. User uploads a selfie.
 *  2. We POST it to the local API (localhost:8000/extract) which runs ArcFace
 *     (the same model used by main.py to build data.json).
 *  3. We compare the returned 512-dim embedding against the pre-computed
 *     face_embeddings stored in each photo object (from data.json).
 *  4. Photos where ANY stored face is within THRESHOLD are shown.
 *
 * No face-api.js needed — both sides use the same embedding space.
 */
import { useState, useRef } from 'react';
import styles from './SelfieFilter.module.css';

// ── Config ────────────────────────────────────────────────────────────────────
const API_URL   = 'https://daksh0907-photo-recognition-api.hf.space/extract';
// ArcFace cosine-similarity threshold (1 = identical, 0 = unrelated)
// 0.68 gives a good balance for the same person across varied shots.
const THRESHOLD = 0.35;

// ── Math helpers ──────────────────────────────────────────────────────────────
/** Cosine similarity between two Float32Array / plain arrays */
function cosineSim(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na  += a[i] * a[i];
    nb  += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-8);
}

/** Returns true if the selfie embedding matches ANY face in the photo */
function photoMatchesSelfie(selfieEmb, photo) {
  const stored = photo.face_embeddings; // array of 512-dim arrays from data.json
  if (!stored || stored.length === 0) return false;
  return stored.some(emb => cosineSim(selfieEmb, emb) >= THRESHOLD);
}

// ── API call ──────────────────────────────────────────────────────────────────
/**
 * POST the selfie File to the local ArcFace API.
 * Returns a Float32Array (512-dim) or throws on failure.
 */
async function extractEmbedding(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(API_URL, { method: 'POST', body: formData });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API error ${res.status}: ${text || res.statusText}`);
  }

  const data = await res.json();
  if (!data.embedding) throw new Error('API response missing "embedding" field.');

  return new Float32Array(data.embedding);
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function SelfieFilter({ allPhotos, onResult, onLoadingChange, isActive, matchCount }) {
  const [phase,    setPhase]    = useState('idle'); // idle|loading|done|error
  const [errorMsg, setErrorMsg] = useState('');
  const [preview,  setPreview]  = useState(null);
  const inputRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objUrl = URL.createObjectURL(file);
    setPreview(objUrl);
    setPhase('loading');
    setErrorMsg('');
    onLoadingChange?.(true);

    try {
      // 1. Get ArcFace embedding for the selfie via local API
      const selfieEmb = await extractEmbedding(file);

      // 2. Compare against pre-stored embeddings in data.json (instant — no network)
      const matched = allPhotos
        .filter(photo => photoMatchesSelfie(selfieEmb, photo))
        .map(photo => photo.id);

      setPhase('done');
      onResult(matched);
      onLoadingChange?.(false);
    } catch (err) {
      setPhase('error');
      // Give the user a helpful message if the API is not running
        const isNetwork = err.message.includes('fetch') || err.message.includes('Failed to fetch');
      setErrorMsg(
        isNetwork
          ? 'Cannot reach the face recognition API — check your internet connection and try again.'
          : err.message || 'Something went wrong.'
      );
      onResult(null);
      onLoadingChange?.(false);
    }
  };

  const handleClear = () => {
    setPhase('idle');
    setPreview(null);
    setErrorMsg('');
    onResult(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <input
          ref={inputRef}
          id="selfieInput"
          type="file"
          accept="image/*"
          capture="user"
          className={styles.hiddenInput}
          onChange={handleFile}
          disabled={phase === 'loading'}
        />

        {/* Idle */}
        {phase === 'idle' && !isActive && (
          <label htmlFor="selfieInput" className={styles.uploadBtn}>
            <span>📸</span> Find My Photos
          </label>
        )}

        {/* Loading (API call) */}
        {phase === 'loading' && (
          <span className={styles.status}>
            <span className={styles.spinner} /> Detecting your face…
          </span>
        )}

        {/* Done */}
        {phase === 'done' && isActive && (
          <div className={styles.activeRow}>
            {preview && <img src={preview} alt="Your selfie" className={styles.thumb} />}
            <span className={styles.found}>
              ✓ {matchCount} photo{matchCount !== 1 ? 's' : ''} found with you
            </span>
            <button className={styles.clearBtn} onClick={handleClear}>✕ Clear</button>
          </div>
        )}

        {/* Error */}
        {phase === 'error' && (
          <div className={styles.activeRow}>
            {preview && <img src={preview} alt="Your selfie" className={styles.thumb} />}
            <span className={styles.err}>⚠ {errorMsg}</span>
            <button className={styles.clearBtn} onClick={handleClear}>✕ Try Again</button>
          </div>
        )}
      </div>

      {phase === 'idle' && (
        <p className={styles.hint}>Upload a selfie to instantly find all your photos</p>
      )}
    </div>
  );
}
