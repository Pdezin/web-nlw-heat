import React, { useEffect, useState, useContext } from 'react';
import styles from './styles.module.scss';
import LogoImg from '../../assets/logo.svg';
import LogoWhite from '../../assets/logoWhite.svg';
import { api } from '../../services/api';
import io from 'socket.io-client';
import { MdLightMode, MdModeNight } from 'react-icons/md';
import { AuthContext } from '../../contexts/auth';

type Message = {
  id: string;
  text: string;
  user: {
    name: string;
    avatar_url: string;
  };
};

let messagesQueue: Message[] = [];

const socket = io('http://localhost:4000');

socket.on('new_message', newMessage => {
  messagesQueue.push(newMessage);
});

const MessageList: React.FC = () => {
  const { whiteMode, toggleTheme } = useContext(AuthContext);

  const [messages, setMessages] = useState<Message[]>([]);
  useEffect(() => {
    const timer = setInterval(() => {
      if (messagesQueue.length > 0) {
        setMessages(prevState =>
          [messagesQueue[0], prevState[0], prevState[1]].filter(Boolean)
        );
        messagesQueue.shift();
      }
    }, 3000);
  }, []);

  useEffect(() => {
    api
      .get<Message[]>('messages/last3')
      .then(response => setMessages(response.data));
  }, []);

  return (
    <div className={styles.messageListWrapper}>
      <div className={styles.header}>
        <img src={whiteMode ? LogoWhite : LogoImg} alt="DoWhile 2021" />
        <div style={{ cursor: 'pointer' }} onClick={toggleTheme}>
          {whiteMode ? (
            <MdModeNight size={40} color="#000" />
          ) : (
            <MdLightMode size={40} />
          )}
        </div>
      </div>

      <ul className={styles.messageList}>
        {messages.map(message => (
          <li className={styles.message} key={message.id}>
            <p className={styles.messageContent}>{message.text}</p>
            <div className={styles.messageUser}>
              <div className={styles.userImage}>
                <img src={message.user.avatar_url} alt={message.user.name} />
              </div>
              <span>{message.user.name}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessageList;
