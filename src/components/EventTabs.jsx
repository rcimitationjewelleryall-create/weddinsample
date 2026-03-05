import styles from './EventTabs.module.css';

export default function EventTabs({ sections, activeSection, onSelect }) {
  if (!sections || sections.length <= 1) return null;

  return (
    <section className={styles.sectionWrap}>
      <div className={styles.header}>
        <div className={styles.ornamentLine} />
        <span className={styles.headerLabel}>Browse by Event</span>
        <div className={styles.ornamentLine} />
      </div>

      <div className={styles.cardStrip}>
        {/* "All" card */}
        <button
          className={`${styles.card} ${!activeSection ? styles.active : ''}`}
          onClick={() => onSelect(null)}
        >
          <span className={styles.cardIcon}>✦</span>
          <span className={styles.cardName}>All Events</span>
          <span className={styles.cardCount}>
            {sections.reduce((s, x) => s + (x.photo_count ?? 0), 0)}
          </span>
        </button>

        {sections.map(sec => (
          <button
            key={sec.id}
            className={`${styles.card} ${activeSection === sec.id ? styles.active : ''}`}
            onClick={() => onSelect(activeSection === sec.id ? null : sec.id)}
          >
            <span className={styles.cardIcon}>{sec.icon || '📷'}</span>
            <span className={styles.cardName}>{sec.label}</span>
            <span className={styles.cardCount}>{sec.photo_count ?? 0}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
