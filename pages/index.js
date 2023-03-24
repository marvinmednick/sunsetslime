import CategoryCard from '../components/CategoryCard';
import styles from '../styles/Home.module.css';

const HomePage = () => {
  return (
    <main className={styles.container}>
      <div className={styles.small}>
        <CategoryCard image="/images/test.jpg" name="Crunchy" />
        <CategoryCard image="/images/glitter-slime-04288-800x1200.jpg" name="Glitter Slime" />
        <CategoryCard image="https://imgur.com/3Y1DLYC.png" name="PS5" />
        <CategoryCard image="https://imgur.com/Dm212HS.png" name="Switch" />
      </div>
    </main>
  );
};

export default HomePage;
