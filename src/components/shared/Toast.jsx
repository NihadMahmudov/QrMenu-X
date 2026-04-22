import styles from './Toast.module.css';

export default function Toast({ message, visible }) {
    return (
        <div className={`${styles.toast} ${visible ? styles.show : ''}`}>
            {message}
        </div>
    );
}
