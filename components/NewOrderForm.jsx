import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from 'react-redux';
import styles from './NewOrderForm.module.css';
import {
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
} from '../redux/cart.slice';

async function handle_form(cart, data) {
  
    alert(JSON.stringify(data) + "\n" + JSON.stringify(cart));
    const staticFormData = {
      "Name": "Marvin Mednick",
      "Address": "2135 Abbey Lane, Campbell, CA 95008",
      "Email": "marvinmednick@gmail.com",
      "Phone": "556-123-4567",
      "Items": [
        {
          "ID": "20",
          "Description": "Product 20 a slime",
          "Price": 1.99
        },
        {
          "ID": "21",
          "Description": "Product 21 a crunchy slime",
          "Price": 1.99
        },
        {
          "ID": "22",
          "Description": "Product 23 more slime",
          "Price": 1.99
        }
      ]
    }


    try {
      // Send a POST request to the external URL using fetch
     const url = ' https://9ddb7dp853.execute-api.us-west-2.amazonaws.com/default/SlimeProductOrder'
     //   const url = 'http://localhost:8080'

      const response = await fetch( url,
          { 
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(staticFormData),
          }
      );

      console.log("Fetch complete")

      // Handle the response if needed
      //let data = await response.json();
      //console.log("## DATA")
      //console.log(data);

      // Reset the form
      //setName('');
      //setAddress('');
      //setEmail('');
      //setPhone('');
    } catch (error) {
      console.log("Error during fetch")
      // Handle the error
      console.error(error);
    }
}


export default function NewOrderForm(cart) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const onSubmit = data => handle_form(cart, data);
  const dispatch = useDispatch();

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form onSubmit={handleSubmit(onSubmit)}>
      <label className={styles.label}>Name: </label>
      {/* register your input into the hook by invoking the "register" function */}
      <input className={styles.input} type="text" defaultValue="Your Name" {...register("name", {required: true})} />
      {/* errors will return when field validation fails  */}
      {errors.name && <span className={styles.error} >This field is required</span>}
      <br /> 
      <label className={styles.label}>Mailing Address: </label>
      {/* include validation with required or other standard HTML validation rules */}
      <input className={styles.input} type="text" defaultValue="Your Mailing Address"{...register("address", { required: true })} />
      {/* errors will return when field validation fails  */}
      {errors.address && <span className={styles.error} >This field is required</span>}
      <br /> 

      <label className={styles.label}>Email Address: </label>
      {/* include validation with required or other standard HTML validation rules */}
      <input className={styles.input} type="text" defaultValue="Your Email address"{...register("email", { required: true })} />
      {/* errors will return when field validation fails  */}
      {errors.email && <span className={styles.error} >This field is required</span>}
      <br /> 
      <label className={styles.label}>Phone Number: </label>
      {/* include validation with required or other standard HTML validation rules */}
      <input className={styles.input} type="text" defaultValue="Your Phone number"{...register("phone", { required: true })} />
      {/* errors will return when field validation fails  */}
      {errors.phone && <span className={styles.error} >This field is required</span>}
      <br /> 
      <input type="submit" />
    </form>
  );
}
