import { useState, useContext } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import generateHash from "random-hash";
import firebase from "../firebaseConfig";
import { useRouter } from "next/router";
import { ChatContext } from "../contexts/chatContext.js";

export default function Home() {
  const { username, changeUsername } = useContext(ChatContext);
  const [rid, setRid] = useState("");
  const [roomName, setRoomName] = useState("");
  const [name, setName] = useState(username);
  const router = useRouter();

  const handleRid = (e) => {
    setRid(e.target.value);
  };

  const handleRoomName = (e) => {
    setRoomName(e.target.value);
  };

  const handleUsername = (e) => {
    setName(e.target.value);
  };

  const createRoom = () => {
    if (name === "" || roomName === "") return;

    changeUsername(name);

    const newRoomID = generateHash();

    firebase
      .database()
      .ref(newRoomID)
      .set({ name: roomName })
      .then(() => console.log("Room created!"));

    router.push(`/room/${newRoomID}`);
  };

  const enterRoom = () => {
    if (name === "" || rid === "") return;

    changeUsername(name);

    firebase
      .database()
      .ref(rid)
      .once("value")
      .then((snapshot) => {
        if (snapshot.exists()) {
          router.push(`/room/${rid}`);
        } else {
          console.log("Room does not exist");
        }
      });
  };

  return (
    <>
      <Head>
        <title>Socket App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Chat App</h1>
        <label className={styles.label} htmlFor="usernameInput">
          Enter your username
        </label>
        <input
          id="usernameInput"
          type="text"
          placeholder="Frank Ocean"
          value={name}
          onChange={handleUsername}
        />
        <div className={styles.splitContainer}>
          <div className={styles.splitCol}>
            <h2 className={styles.subtitle}>Join Room</h2>
            <label className={styles.label} htmlFor="roomInput">
              Enter room ID
            </label>
            <input
              id="roomInput"
              type="text"
              placeholder="123"
              value={rid}
              onChange={handleRid}
            />
            <button className={styles.button} onClick={enterRoom}>
              Enter Room
            </button>
          </div>
          <div className={styles.splitCol}>
            <h2 className={styles.subtitle}>Create Room</h2>
            <label className={styles.label} htmlFor="roomName">
              Name your room
            </label>
            <input
              id="roomName"
              type="text"
              placeholder="cool room"
              value={roomName}
              onChange={handleRoomName}
            />
            <button className={styles.button} onClick={createRoom}>
              Create Room
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
