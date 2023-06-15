import { useState } from 'react'
import { useRouter } from 'next/router'
import { signUp } from 'next-auth/react'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSignUp = async (e) => {
    e.preventDefault()
    const result = await signUp('email', { email, password })
    if (result.error) {
      // Handle error
      console.log('Sign up error:', result.error)
    } else {
      // Redirect to verification request page
      router.push('/auth/verify-request')
    }
  }

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSignUp}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  )
}

