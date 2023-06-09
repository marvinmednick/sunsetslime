import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import {
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  reloadCart,
} from '../redux/cart.slice';

import styles from '../styles/CartPage.module.css';
import OrderForm from '../components/OrderForm'
import NewOrderForm from '../components/NewOrderForm'
import { useEffect } from 'react';


// load string from localStarage and convert into an Object
// invalid output must be undefined
function loadFromLocalStorage() {

      if  (typeof window === "undefined") {
          return undefined
      }
      try {
        const serialisedState = localStorage.getItem("persistantState");
        if (serialisedState === null) return undefined;
        return JSON.parse(serialisedState);
      } catch (e) {
        console.warn(e);
        return undefined;
      }
}


const CartPage = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const getTotalPrice = () => {
    return cart.reduce(
      (accumulator, item) => accumulator + item.quantity * item.price,
      0
    );
  };

    /*
  let localInfo = undefined;
  useEffect(() => {
      localInfo = loadFromLocalStorage();
      console.log("While in useEffect" + JSON.stringify(localInfo));
      dispatch(reloadCart(localInfo) );
  }, []);

  console.log("After useEffect: " + JSON.stringify(localInfo));
  if (localInfo !== undefined ){
      console.log("Dispatch Reload Cart");
      dispatch(reloadCart, localInfo);
  }
  */

  return (
    <div className={styles.container}>
      {cart.length === 0 ? (
        <h1>Your Cart is Empty!</h1>
      ) : (
        <>
          <div className={styles.header}>
            <div>Image</div>
            <div>Product</div>
            <div>Price</div>
            <div>Quantity</div>
            <div>Actions</div>
            <div>Total Price</div>
          </div>
          {cart.map((item) => (
            <div className={styles.body}>
              <div className={styles.image}>
                <Image src={item.image} height="90" width="65" />
              </div>
              <p>{item.product}</p>
              <p>$ {item.price}</p>
              <p>{item.quantity}</p>
              <div className={styles.buttons}>
                <button onClick={() => dispatch(incrementQuantity(item.id))}>
                  +
                </button>
                <button onClick={() => dispatch(decrementQuantity(item.id))}>
                  -
                </button>
                <button onClick={() => dispatch(removeFromCart(item.id))}>
                  x
                </button>
              </div>
              <p>$ {(item.quantity * item.price).toFixed(2)}</p>
            </div>
          ))}
          <h2>Grand Total: $ {getTotalPrice().toFixed(2)}</h2>
          <div>
              <NewOrderForm cart={cart}/>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
