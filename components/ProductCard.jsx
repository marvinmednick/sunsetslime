import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cart.slice';
import styles from '../styles/ProductCard.module.css';
import { getCategoryDescription } from '../pages/api/products/index.js'

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  return (
    <div className={styles.card}>
      <Image src={product.image} height={100} width={70} />
      <h4 className={styles.title}>{product.product}</h4>
      <h5 className={styles.category}>{getCategoryDescription(product.category)}</h5>
      <p>$ {product.price}</p>
      <button
        onClick={() => dispatch(addToCart(product))}
        className={styles.button}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
