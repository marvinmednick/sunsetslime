import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from 'react-redux';
import {
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
} from '../redux/cart.slice';

function handle_form(cart, data) {
  alert(JSON.stringify(data) + "\n" + JSON.stringify(cart));
}

export default function NewOrderForm(cart) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const onSubmit = data => handle_form(cart, data);
  const dispatch = useDispatch();

  console.log(watch("example")); // watch input value by passing the name of it

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>Name</label>
      {/* register your input into the hook by invoking the "register" function */}
      <input defaultValue="First" {...register("firstName", {required: true})} />
      {/* errors will return when field validation fails  */}
      {errors.firstName && <span>This field is required</span>}
      <br /> 
      {/* include validation with required or other standard HTML validation rules */}
      <input defaultValue="Last"{...register("lastName", { required: true })} />
      {/* errors will return when field validation fails  */}
      {errors.lastName && <span>This field is required</span>}
      <br /> 
      <input type="submit" />
    </form>
  );
}
