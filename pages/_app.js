import { Provider } from 'react-redux';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import store from '../redux/store';
import '../styles/globals.css';
import { SessionProvider } from "next-auth/react"

function MyApp({
    Component,
    pageProps: { session, ...pageProps }
) {

  return (
    <SessionProvider session={sesion}>
    <Provider store={store}>
      <div className="wrapper">
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </div>
    </Provider>
    <SessionProvider session={sesion}>
  );
}

export default MyApp;
