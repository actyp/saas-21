import React, {useState, useContext, createContext} from "react";
import {useHistory} from "react-router-dom";
import {apiInstance} from './api';

const authContext = createContext({});

/*
 * hook for child components to get the auth
 * object and re-render when it changes
 */
export const useAuth = () => {
  return useContext(authContext);
}

/*
 * Provider hook that creates auth object
 * and provides auth functions
 */
function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const history = useHistory();

  const signin = (username, password) => {
    return apiInstance()
      .post('login', {username, password})
      .then(resp => {
        const username = resp.data['username'].split('@')[0];
        setUser({username: username});
        setToken(resp.data['access_token']);
        const waitTime = resp.data['access_token_expiry'] - new Date().getTime() - 1000;
        setTimeout(refreshToken, waitTime);
        return true;
      }).catch(err => {
        //log err if possible
        return null;
      });
  };

  const signup = (username, password) => {
    return apiInstance()
      .post('signup', {username, password})
      .then(() => true)
      .catch(err => {
        //log err if possible
        return null;
      });
  };

  const signout = () => {
    return apiInstance()
      .post('logout', {})
      .then(() => {
        setToken(null);
        setUser(null);
        return true;
      }).catch(err => {
        //log err if possible
        return null;
      });
  };

  const refreshToken = () => {
    return apiInstance()
      .get('refresh')
      .then(resp => {
        setToken(resp.data['access_token']);
        const waitTime = resp.data['access_token_expiry'] - new Date().getTime() - 1000;
        setTimeout(refreshToken, waitTime);
        return resp.data.token;
      }).catch(err => {
        //log err if possible
        return null;
      });
  };

  const resetAuth = () => {
    setUser(null);
    setToken(null);
    history.push('/');
  };

  return {
    user,
    tokenObj: {token, resetAuth},
    signin,
    signup,
    signout
  };
}

/*
 * Provider wrapper component that makes auth object
 * available to child component that calls useAuth()
 */
export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return (
    <authContext.Provider value={auth}>
      {children}
    </authContext.Provider>
  );
}

