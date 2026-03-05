import { useEffect, useRef } from 'react';
import styles from './PhotographerBanner.module.css';


/* ── Component ──────────────────────────────────────────────── */
export default function PhotographerBanner({ photographer, gallery, onYourPhotos }) {
  const containerRef = useRef(null);

  const groomName = gallery?.groom_name || 'Groom';
  const brideName = gallery?.bride_name || 'Bride';
  const eventDate = gallery?.event_date
    ? (() => {
        const d = new Date(gallery.event_date);
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yy = String(d.getFullYear()).slice(2);
        return `${dd} / ${mm} / ${yy}`;
      })()
    : '';

  // Staggered reveal — assign data-delay and trigger via IntersectionObserver
  useEffect(() => {
    const els = containerRef.current?.querySelectorAll('[data-reveal]') ?? [];
    els.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(18px)';
    });
    const timer = setTimeout(() => {
      els.forEach((el, i) => {
        const delay = parseFloat(el.dataset.reveal ?? i * 0.18);
        el.style.transition = `opacity 0.9s cubic-bezier(0.25,0.1,0.25,1) ${delay}s, transform 0.9s cubic-bezier(0.25,0.1,0.25,1) ${delay}s`;
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    }, 80); // slight delay so page paint completes first
    return () => clearTimeout(timer);
  }, []);

  return (
    <header className={styles.hero} ref={containerRef}>
      {/* Damask pattern overlay */}
      <div className={styles.damaskLayer} aria-hidden="true" />
      {/* Vignette */}
      <div className={styles.vignette} aria-hidden="true" />

      <div className={styles.center}>
        {/* Sanskrit blessing */}
        <div data-reveal="0.1" className={styles.ganeshWrap}>
          <p className={styles.sanskritText}>ॐ श्री गणेशाय नमः</p>
        </div>

        {/* Lines above names */}
        <div data-reveal="0.35" className={styles.ornamentWrap}>
          <img src="/lines.svg" alt="" className={styles.linesImg} />
        </div>

        {/* Groom name */}
        <h1 data-reveal="0.55" className={styles.groomName}>{groomName}</h1>

        {/* "weds" script */}
        <p data-reveal="0.7" className={styles.wedsScript}>weds</p>

        {/* Bride name */}
        <h1 data-reveal="0.85" className={styles.brideName}>{brideName}</h1>

        {/* Date */}
        {eventDate && (
          <p data-reveal="1.0" className={styles.dateText}>{eventDate}</p>
        )}

        {/* Lines below names */}
        <div data-reveal="1.15" className={styles.ornamentWrap}>
          <img src="/lines.svg" alt="" className={`${styles.linesImg} ${styles.linesFlip}`} />
        </div>

        {/* Photographer line */}
        {photographer?.name && (
          <p data-reveal="1.35" className={styles.photographerLine}>
            Photography by&nbsp;<strong>{photographer.name}</strong>
          </p>
        )}
      </div>

      {/* Scroll down */}
      <button
        data-reveal="1.5"
        className={styles.scrollDown}
        onClick={onYourPhotos}
        aria-label="Scroll to gallery"
      >
        Scroll down
        <span className={styles.scrollArrow}>↓</span>
      </button>
    </header>
  );
}
