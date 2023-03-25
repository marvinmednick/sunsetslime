import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/CategoryCard.module.css';
import {getCategoryDescription} from '../pages/api/products/index.js'

const CategoryCard = ({ image, name }) => {
  return (
    <div className={styles.card}>
      <Image className={styles.image} src={image} height={300} width={400} />
      <Link href={`/category/${name.toLowerCase()}`}>
        <div className={styles.info}>
          <h3>{getCategoryDescription(name)}</h3>
          <p>SHOP NOW!</p>
        </div>
      </Link>
    </div>
  );
};

export default CategoryCard;
