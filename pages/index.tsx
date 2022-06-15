import Head from "next/head";
import App from "../Components/App";

export default function Home() {
  return (
    <>
      <Head>
        <title>Deep Time Explorer</title>
        <meta
          name="description"
          content="Exploring deep time stories and data"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <App />

      <footer></footer>
    </>
  );
}
