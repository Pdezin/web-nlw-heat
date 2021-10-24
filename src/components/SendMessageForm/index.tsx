import React, { FormEvent, useContext, useState } from 'react';
import { VscGithubInverted, VscSignOut } from 'react-icons/vsc';
import { AuthContext } from '../../contexts/auth';
import { api } from '../../services/api';
import styles from './styles.module.scss';

const SendMessageForm: React.FC = () => {
  const { user, signOut, whiteMode } = useContext(AuthContext);
  const [message, setMessage] = useState('');

  async function handleSendMessage(e: FormEvent) {
    e.preventDefault();
    if (!message.trim()) {
      return;
    }
    const token = localStorage.getItem('@dowhile:token');
    if (token) {
      api.defaults.headers.common.authorization = `Bearer ${token}`;
      await api.post('messages', { message });
      setMessage('');
    }
  }

  return (
    <div
      className={`${styles.sendMessageWrapper} ${
        whiteMode ? styles.sendMessageWhite : ''
      }`}
    >
      <button
        onClick={signOut}
        className={styles.signOutButton}
        style={whiteMode ? { color: '#232323' } : {}}
      >
        <VscSignOut size={32} />
      </button>

      <header className={styles.userInformation}>
        <div className={styles.userImage}>
          <img src={user?.avatar_url} alt={user?.name} />
        </div>
        <strong className={styles.userName}>{user?.name}</strong>
        <span
          className={styles.userGithub}
          style={whiteMode ? { color: '#232323' } : {}}
        >
          <VscGithubInverted size={16} />
          {user?.login}
        </span>
      </header>

      <form
        onSubmit={handleSendMessage}
        className={`${styles.sendMessageForm} ${
          whiteMode ? styles.sendMessageFormWhite : ''
        }`}
      >
        <label htmlFor="message">Mensagem</label>
        <textarea
          name="message"
          id="message"
          placeholder="Qual a sua expectativa para o evento?"
          onChange={({ target }) => setMessage(target.value)}
          value={message}
        />

        <button type="submit">Enviar mensagem</button>
      </form>
    </div>
  );
};

export default SendMessageForm;
