import { configureStore } from '@reduxjs/toolkit';
import { cartReducer } from './cart.slice';
//
// convert object to string and store in localStorage
function saveToLocalStorage(state) {

      try {
        const serialisedState = JSON.stringify(state);
        localStorage.setItem("persistantState", serialisedState);
      } catch (e) {
        console.warn(e);
      }
}


const reducer = {
  cart: cartReducer,
};

const store = configureStore({
    reducer: reducer,
});


if  (typeof window !== "undefined") {
// listen for store changes and use saveToLocalStorage to
// save them to localStorage
    store.subscribe(() => saveToLocalStorage(store.getState()));
}
export default store;
