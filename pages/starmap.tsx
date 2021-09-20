import Head from "next/head";
import Image from "next/image";
import StarMap from "../Components/StarMap";

export default function Home() {
  return (
    <>
      <Head>
        <title>Star Map - Deep Time Explorer</title>
        <meta name="description" content="A star map explorer tool." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <StarMap />

      <footer></footer>
    </>
  );
}
