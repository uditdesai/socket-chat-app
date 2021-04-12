import React, { createContext, useEffect, useState } from "react";
import generateHash from "random-hash";

const useSessionStorage = (key, defaultValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (err) {
      console.log(err);
      return defaultValue;
    }
  });

  const setValue = (value) => {
    try {
      const newValue = value instanceof Function ? value(storedValue) : value;
      const item = window.sessionStorage.getItem(key);
      if (!item) {
        setStoredValue(newValue);
        window.sessionStorage.setItem(key, JSON.stringify(newValue));
      }
    } catch (err) {
      console.log(err);
    }
  };

  return [storedValue, setValue];
};

export const ChatContext = createContext();

export function ChatProvider(props) {
  const [userID, setUserID] = useSessionStorage("userID", "");
  const [username, setUsername] = useSessionStorage("username", "");

  const applyUserID = () => {
    const newUserID = generateHash();
    setUserID(newUserID);
  };

  const changeUsername = (name) => {
    setUsername(name);
  };

  useEffect(() => {
    applyUserID();
  }, []);

  return (
    <ChatContext.Provider value={{ userID, username, changeUsername }}>
      {props.children}
    </ChatContext.Provider>
  );
}
