import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: [],
  reducers: {
    addToCart: (state, action) => {
      const itemExists = state.find((item) => item.id === action.payload.id);
      if (itemExists) {
        itemExists.quantity++;
      } else {
        state.push({ ...action.payload, quantity: 1 });
      }
    },
    incrementQuantity: (state, action) => {
      const item = state.find((item) => item.id === action.payload);
      item.quantity++;
    },
    decrementQuantity: (state, action) => {
      const item = state.find((item) => item.id === action.payload);
      if (item.quantity === 1) {
        const index = state.findIndex((item) => item.id === action.payload);
        state.splice(index, 1);
      } else {
        item.quantity--;
      }
    },
    removeFromCart: (state, action) => {
      const index = state.findIndex((item) => item.id === action.payload);
      state.splice(index, 1);
    },
    reloadCart:  (state, action) => {
        console.log("Action: : " + JSON.stringify(action) );
        if (action.payload !== undefined && action.payload.hasOwnProperty('cart') )  { 
            console.log("State: " + JSON.stringify(state), 
                "Action: : " + JSON.stringify(action) + "len: " + action.payload.cart.length);

            if (action.payload.cart.length > 0 && state.length === 0) {
                state.push(...action.payload.cart);
                console.log("After push " + JSON.stringify(state));
            }
        }
    }
  },
});

export const cartReducer = cartSlice.reducer;

export const {
  addToCart,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  reloadCart,
} = cartSlice.actions;
