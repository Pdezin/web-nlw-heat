import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { api } from '../services/api';

export const AuthContext = createContext({} as AuthContextData);

type AuthResponse = {
  token: string;
  user: {
    avatar_url: string;
    id: string;
    login: string;
    name: string;
  };
};

type User = {
  id: string;
  name: string;
  login: string;
  avatar_url: string;
};

type AuthContextData = {
  user: User | null;
  signInUrl: string;
  signOut: () => void;
  whiteMode: boolean;
  toggleTheme: () => void;
};

type TAuthProvider = {
  children: ReactNode;
};

export const AuthProvider = (props: TAuthProvider) => {
  const [user, setUser] = useState<User | null>(null);
  const [whiteMode, setWhiteMode] = useState(false);

  const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=ff7a3beb094c53cc70ce`;

  function toggleTheme() {
    setWhiteMode(prev => !prev);
  }

  async function signIn(githubCode: string) {
    const response = await api.post<AuthResponse>('authenticate', {
      code: githubCode,
    });
    const { token, user } = response.data;
    localStorage.setItem('@dowhile:token', token);
    api.defaults.headers.common.authorization = `Bearer ${token}`;
    setUser(user);
  }

  function signOut() {
    setUser(null);
    localStorage.removeItem('@dowhile:token');
  }

  useEffect(() => {
    const token = localStorage.getItem('@dowhile:token');

    if (token) {
      api.defaults.headers.common.authorization = `Bearer ${token}`;
      api.get<User>('profile').then(response => console.log(response.data));
    }
  }, []);

  useEffect(() => {
    const url = window.location.href;
    const hasGithubCode = url.includes('?code=');
    if (hasGithubCode) {
      const [urlWithoutCode, gitHubCode] = url.split('?code=');
      console.log({ urlWithoutCode, gitHubCode });

      window.history.pushState({}, '', urlWithoutCode);
      signIn(gitHubCode);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ signInUrl, user, signOut, whiteMode, toggleTheme }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
