import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import firebase from "../../firebaseConfig";
import Head from "next/head";
import styles from "../../styles/Room.module.css";
import { ChatContext } from "../../contexts/chatContext.js";
import RoomComponent from "../../components/room";

const Room = ({ data }) => {
  const router = useRouter();
  const { rid } = router.query;
  const { username, changeUsername } = useContext(ChatContext);

  const [name, setName] = useState("");

  const handleName = (e) => {
    setName(e.target.value);
  };

  const submitName = () => {
    changeUsername(name);
  };

  return (
    <>
      <Head>
        <title>{data.name}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        {username !== "" ? (
          <RoomComponent rid={rid} users={data.users} roomName={data.name} />
        ) : (
          <div className={styles.nameContainer}>
            <label className={styles.label} htmlFor="name">
              Enter a message
            </label>
            <input
              id="name"
              type="text"
              placeholder="name"
              value={name}
              onChange={handleName}
            />
            <button onClick={submitName} className={styles.button}>
              Submit Name
            </button>
          </div>
        )}
      </>
    </>
  );
};

export default Room;

export async function getServerSideProps(context) {
  // Fetch data from external API

  return firebase
    .database()
    .ref(context.params.rid)
    .once("value")
    .then((snapshot) => {
      return { props: { data: snapshot.val() } };
    })
    .catch((err) => {
      console.log(err);
      return { props: { data: false } };
    });
}
