import React, { useContext } from 'react';
import styles from './App.module.scss';
import LoginBox from './components/LoginBox';
import MessageList from './components/MessageList';
import SendMessageForm from './components/SendMessageForm';
import { AuthContext } from './contexts/auth';

export const App: React.FC = () => {
  const { user, whiteMode } = useContext(AuthContext);

  return (
    <main className={`${styles.main} ${whiteMode ? styles.whiteTheme : ''}`}>
      <div
        className={`${styles.contentWrapper} ${
          !!user ? styles.contentSigned : ''
        }`}
      >
        <MessageList />
        {!!user ? <SendMessageForm /> : <LoginBox />}
      </div>
    </main>
  );
};
