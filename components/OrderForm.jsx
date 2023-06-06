import { useState } from 'react';

export default function OrderForm() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Combine the form data with the list of items
    const formData = {
      name,
      address,
      email,
      phone,
      items: ['item1', 'item2', 'item3'] // Replace with your actual list of items
    };
    const staticFormData = {
      "Name": "Marvin Mednick",
      "Address": "123 Main St, Anytown, USA",
      "Email": "marvinmednick@gmail.com",
      "Phone": "555-123-4567",
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

      // Handle the response if needed
      const data = await response.json();
      console.log(data);

      // Reset the form
      setName('');
      setAddress('');
      setEmail('');
      setPhone('');
    } catch (error) {
      console.log("Error during fetch")
      // Handle the error
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="tel"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

