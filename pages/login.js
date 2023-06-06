// components/Login.js
import { useEffect } from "react";
import {useRouter} from 'next/router';

import { Authenticator, useAuthenticator, View } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

export default function Login() {
  const { route } = useAuthenticator((context) => [context.route]);
  const router = useRouter();
  const location = router.pathname
  console.log("Login location",location)
  let from = router.query.callbackUrl ?? '/';
  useEffect(() => {
    if (route === 'authenticated') {
       router.replace(from);
    }
  }, [route, router, from]);
  return (
    <View className="auth-wrapper">
      <Authenticator></Authenticator>
    </View>
  );
}
