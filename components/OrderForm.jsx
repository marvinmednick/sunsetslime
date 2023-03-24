function handleSubmit(e) {
    alert("Submitted")
    e.preventDefault();
}


export default function OrderForm() {
  return (
    <form action="/api/form" method="post">
      <label htmlFor="first">First Name</label>
      <input type="text" id="first" name="first" required />

      <label htmlFor="last">Last Name</label>
      <input type="text" id="last" name="last" required />

      <button type="submit" onClick={handleSubmit}>Submit</button>
    </form>
  )
}
