import { Link } from 'react-router-dom';
import styles from './DataCard.module.css';

/**
 * DataCard — reusable sub-event card
 *
 * Props:
 *   to       – route to navigate (e.g. "/event/haldi")
 *   image    – cover image URL (Google Drive lh3 thumbnail)
 *   label    – event name
 *   count    – photo count
 *   icon     – optional emoji icon
 *   delay    – optional animation delay in seconds
 */
export default function DataCard({ to, image, label, count, icon, delay = 0 }) {
  return (
    <Link
      to={to}
      className={styles.card}
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Image */}
      <div className={styles.imageWrap}>
        {image ? (
          <img
            src={image}
            alt={label}
            className={styles.image}
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className={styles.placeholder}>
            <span>{icon || '📷'}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className={styles.info}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <h3 className={styles.name}>{label}</h3>
        <p className={styles.count}>{count ?? 0} photos</p>
      </div>
    </Link>
  );
}
