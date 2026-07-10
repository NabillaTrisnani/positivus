'use client'

import styles from './css/InfiniteScroll.module.css'

interface InfiniteScrollProps {
    items: React.ReactNode[]
    speed?: 'slow' | 'normal' | 'fast'
    scrollDirection?: 'left' | 'right'
}

export default function InfiniteScroll({
    items,
    speed = 'normal',
    scrollDirection = 'left',
}: InfiniteScrollProps) {
    const duration = {
        slow: '40s',
        normal: '20s',
        fast: '10s',
    }[speed]

    return (
        <div className={styles.wrapper}>
            <div className={styles.fadeLeft} />
            <div className={styles.fadeRight} />

            <div
                className={`${styles.track} ${scrollDirection === "left" ? styles.scrollLeft : styles.scrollRight}`}
                style={{
                    animationDuration: duration,
                    animationPlayState: undefined, // biar hover CSS yang handle
                }}
            >
                {/* set 1 */}
                <div className={styles.group}>
                    {items.map((item, i) => (
                        <div key={`a-${i}`} className={styles.item}>
                            {item}
                        </div>
                    ))}
                </div>
                {/* set 2 (duplikat, wajib biar looping mulus) */}
                <div className={styles.group} aria-hidden="true">
                    {items.map((item, i) => (
                        <div key={`b-${i}`} className={styles.item}>
                            {item}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}