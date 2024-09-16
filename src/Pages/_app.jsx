// src/pages/_app.jsx
import '../styles/globals.css';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Screen & Video Recorder</title>
        <meta
          name="description"
          content="A production-ready screen and video recorder application built with Next.js."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;