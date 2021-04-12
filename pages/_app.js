import "../styles/globals.css";
import Head from "next/head";
import { ChatProvider } from "../contexts/chatContext";

function MyApp({ Component, pageProps }) {
  return (
    <ChatProvider>
      <Head>
        <title>Socket Chat</title>
      </Head>
      <Component {...pageProps} />
    </ChatProvider>
  );
}

export default MyApp;
