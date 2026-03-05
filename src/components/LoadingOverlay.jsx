import styles from './LoadingOverlay.module.css';

export default function LoadingOverlay({ visible }) {
  if (!visible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <div className={styles.spinner} />
        <p className={styles.text}>Finding your photos...</p>
        <p className={styles.subtext}>Please wait while we scan all photos</p>
      </div>
    </div>
  );
}
