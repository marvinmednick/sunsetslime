import { useState } from 'react'
import { useRouter } from 'next/router'
import { signIn, signUp } from 'next-auth/react'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSignIn = async (e) => {
    e.preventDefault()
    const result = await signIn('credentials', { email, password })
    if (result.error) {
      // Handle sign-in error
      console.log('Sign in error:', result.error)
    } else {
      // Redirect to desired page after successful sign-in
      router.push('/dashboard')
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    const result = await signUp('credentials', { email, password })
    if (result.error) {
      // Handle sign-up error
      console.log('Sign up error:', result.error)
    } else {
      // Redirect to desired page after successful sign-up
      router.push('/dashboard')
    }
  }

  return (
    <div>
      <h1>Sign In</h1>
      <form onSubmit={handleSignIn}>
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
        <button type="submit">Sign In</button>
      </form>
      <p>Don't have an account? Sign up below:</p>
      <form onSubmit={handleSignUp}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input type="password"
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

