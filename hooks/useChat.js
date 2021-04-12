import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import firebase from "../firebaseConfig";

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage"; // Name of the event
const SOCKET_SERVER_URL = "http://localhost:4000";

const useChat = (rid, userID, username) => {
  const [messages, setMessages] = useState([]); // Sent and received messages
  const socketRef = useRef();

  useEffect(() => {
    firebase
      .database()
      .ref(rid)
      .once("value")
      .then((snapshot) => {
        let pastMessages = [];
        for (const mssg in snapshot.val().messages) {
          pastMessages.push(snapshot.val().messages[mssg]);
        }
        console.log(pastMessages);
        setMessages((messages) => [...messages, ...pastMessages]);
      });
  }, []);

  useEffect(() => {
    // Creates a WebSocket connection
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      query: { rid, userID, username },
    });

    console.log(socketRef.current);

    // Listens for incoming messages
    socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message) => {
      const incomingMessage = {
        ...message,
        ownedByCurrentUser: message.senderId === socketRef.current.id,
      };
      setMessages((messages) => [
        ...messages,
        {
          message: incomingMessage.body,
          senderID: incomingMessage.senderUserID,
        },
      ]);
    });

    // Destroys the socket reference
    // when the connection is closed
    return () => {
      socketRef.current.disconnect();
    };
  }, [rid]);

  // Sends a message to the server that
  // forwards it to all users in the same room
  const sendMessage = (messageBody) => {
    console.log(messageBody);
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
      body: messageBody,
      senderId: socketRef.current.id,
      senderUserID: userID,
    });
  };

  return { messages, sendMessage };
};

export default useChat;
