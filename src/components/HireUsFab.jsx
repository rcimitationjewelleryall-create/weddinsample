import { useState } from 'react';
import styles from './HireUsFab.module.css';

export default function HireUsFab({ photographer }) {
  const [open, setOpen] = useState(false);

  const phone = photographer?.phone || photographer?.whatsapp || '';
  const whatsappUrl = phone
    ? `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hi! I saw your gallery and would love to hire you for my event.')}`
    : '#';

  return (
    <>
      {/* Dark backdrop */}
      {open && <div className={styles.backdrop} onClick={() => setOpen(false)} />}

      {/* Expanded card */}
      {open && (
        <div className={styles.card}>
          <button className={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Close">✕</button>

          {/* Photographer logo / avatar */}
          {photographer?.logo_url ? (
            <img src={photographer.logo_url} alt="" className={styles.avatar} />
          ) : (
            <div className={styles.avatarPlaceholder}>📸</div>
          )}

          <h3 className={styles.studioName}>{photographer?.name || 'Our Studio'}</h3>

          {photographer?.tagline && (
            <p className={styles.tagline}>{photographer.tagline}</p>
          )}

          <div className={styles.divider} />

          {/* Info items */}
          <div className={styles.infoList}>
            {photographer?.phone && (
              <div className={styles.infoItem}>
                <span className={styles.infoIcon}>📞</span>
                <span>{photographer.phone}</span>
              </div>
            )}
            {photographer?.instagram && (
              <a href={`https://instagram.com/${photographer.instagram}`} target="_blank" rel="noopener noreferrer" className={styles.infoItem}>
                <span className={styles.infoIcon}>📷</span>
                <span>@{photographer.instagram}</span>
              </a>
            )}
            {photographer?.facebook && (
              <a href={photographer.facebook} target="_blank" rel="noopener noreferrer" className={styles.infoItem}>
                <span className={styles.infoIcon}>👤</span>
                <span>Facebook</span>
              </a>
            )}
          </div>

          {/* CTA — Message on WhatsApp */}
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={styles.messageBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.11.546 4.093 1.502 5.814L0 24l6.336-1.456A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818c-1.94 0-3.766-.527-5.33-1.445l-.38-.226-3.955.91.96-3.854-.25-.394A9.787 9.787 0 012.182 12c0-5.424 4.394-9.818 9.818-9.818S21.818 6.576 21.818 12 17.424 21.818 12 21.818z"/>
            </svg>
            Message Us
          </a>

          {photographer?.cta_text && (
            <p className={styles.ctaNote}>{photographer.cta_text}</p>
          )}
        </div>
      )}

      {/* FAB — round button */}
      {!open && (
        <button className={styles.fab} onClick={() => setOpen(true)} aria-label="Hire Us">
          <span className={styles.fabText}>Hire Us</span>
        </button>
      )}
    </>
  );
}
