import {useRouter} from 'next/router';

export default function SignInButton() {
  const router = useRouter()

const handleSignIn = (e) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <>
      Not signed in <br />
      <button onClick={handleSignIn}>Log in</button>
    </>
  )
}
