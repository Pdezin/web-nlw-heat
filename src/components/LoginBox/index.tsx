import React, { useContext } from 'react';
import styles from './styles.module.scss';
import { VscGithubInverted } from 'react-icons/vsc';
import { AuthContext } from '../../contexts/auth';

const LoginBox: React.FC = () => {
  const { signInUrl, whiteMode } = useContext(AuthContext);
  return (
    <div
      className={`${styles.loginBoxWrapper} ${
        whiteMode ? styles.loginBoxWhite : ''
      }`}
    >
      <strong>Compartilhe sua mensagem</strong>
      <a href={signInUrl} className={styles.signInWithGithub}>
        <VscGithubInverted size="24" /> Entrar com Github
      </a>
    </div>
  );
};

export default LoginBox;
