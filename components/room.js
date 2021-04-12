import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import firebase from "../firebaseConfig";
import Head from "next/head";
import styles from "../styles/Room.module.css";
import useChat from "../hooks/useChat";
import { ChatContext } from "../contexts/chatContext";

const RoomComponent = ({ rid, users, roomName }) => {
  const { userID, username } = useContext(ChatContext);
  const [userData, setUserData] = useState(users);

  useEffect(() => {
    firebase
      .database()
      .ref(`${rid}/users`)
      .on("value", (snapshot) => {
        setUserData(snapshot.val());
      });
  }, []);

  const { messages, sendMessage } = useChat(rid, userID, username);
  const [newMessage, setNewMessage] = useState("");

  const handleNewMessageChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleSendMessage = () => {
    sendMessage(newMessage);
    console.log(newMessage);
    setNewMessage("");
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>{roomName}</h1>
      <div className={styles.messages}>
        {messages.map((message, i) => {
          return (
            <p
              key={`message-${i}`}
              className={`${styles.message} ${
                message.senderID === userID ? styles.ownMessage : ""
              }`}
            >
              {userData[message.senderID] &&
                userData[message.senderID].username}
              : {message.message}
            </p>
          );
        })}
      </div>
      <label className={styles.label} htmlFor="message">
        Enter a message
      </label>
      <input
        id="message"
        type="text"
        placeholder="Hey"
        value={newMessage}
        onChange={handleNewMessageChange}
      />
      <button onClick={handleSendMessage} className={styles.button}>
        Send Message
      </button>
    </main>
  );
};

export default RoomComponent;
