import React, { FormEvent, useContext, useState } from 'react';
import { VscGithubInverted, VscSignOut } from 'react-icons/vsc';
import { AuthContext } from '../../contexts/auth';
import { api } from '../../services/api';
import styles from './styles.module.scss';

const SendMessageForm: React.FC = () => {
  const { user, signOut } = useContext(AuthContext);
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
    <div className={styles.sendMessageWrapper}>
      <button onClick={signOut} className={styles.signOutButton}>
        <VscSignOut size={32} />
      </button>

      <header className={styles.userInformation}>
        <div className={styles.userImage}>
          <img src={user?.avatar_url} alt={user?.name} />
        </div>
        <strong className={styles.userName}>{user?.name}</strong>
        <span className={styles.userGithub}>
          <VscGithubInverted size={16} />
          {user?.login}
        </span>
      </header>

      <form onSubmit={handleSendMessage} className={styles.sendMessageForm}>
        <label htmlFor="message">Mensagem</label>
        <textarea
          name="message"
          id="message"
          placeholder="Qual a sua expectativa para o evento?"
          onChange={({ target }) => setMessage(target.value)}
        />

        <button type="submit">Enviar mensagem</button>
      </form>
    </div>
  );
};

export default SendMessageForm;
