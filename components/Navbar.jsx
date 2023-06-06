import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import styles from '../styles/Navbar.module.css';
import LoginButton from './login-btn.jsx'
import SignInButton from './login-cognito-btn.jsx'
import { reloadCart, } from '../redux/cart.slice';
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

const Navbar = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const getItemsCount = () => {
    return cart.reduce((accumulator, item) => accumulator + item.quantity, 0);
  };

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


  return (
    <nav className={styles.navbar}>
      <h6 className={styles.logo}>Galaxy Slimes</h6>
      <ul className={styles.links}>
        <li className={styles.navlink}>
          <LoginButton />
          <SignInButton />
        </li>
        <li className={styles.navlink}>
          <Link href="/">Home</Link>
        </li>
        <li className={styles.navlink}>
          <Link href="/shop">Shop</Link>
        </li>
        <li className={styles.navlink}>
          <Link href="/cart">
            Cart ({getItemsCount()})
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
