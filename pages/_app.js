import { Provider } from 'react-redux';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import store from '../redux/store';
import '../styles/globals.css';
import { SessionProvider } from "next-auth/react"
import { Authenticator } from '@aws-amplify/ui-react';

import { Amplify } from "aws-amplify";
import awsExports from "../aws-exports";

import "@aws-amplify/ui-react/styles.css";
import "../styles/globals.css";

Amplify.configure({ ...awsExports, ssr: true });

function MyApp({
    Component,
    pageProps: { session, ...pageProps },
} ) {

  return (
    <Authenticator.Provider>
    <SessionProvider session={session}>
    <Provider store={store}>
      <div className="wrapper">
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </div>
    </Provider>
    </SessionProvider>
    </Authenticator.Provider>
  );
}

export default MyApp;
