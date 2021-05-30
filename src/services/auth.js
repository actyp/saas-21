import React, {useState, useContext, createContext, useEffect} from "react";
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
        localStorage.setItem('user', JSON.stringify({username: username}));
        const waitTime = resp.data['access_token_expiry'] - new Date().getTime() - 1000;
        setTimeout(refreshToken, waitTime);
        return true;
      })
      .catch(err => {
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
      .catch(err => {
        //log err if possible
      })
      .then(() => {
        //always sign out
        setToken(null);
        setUser(null);
        localStorage.removeItem('user');
        return true;
      });
  };

  const refreshToken = () => {
    return apiInstance()
      .get('refresh')
      .then(resp => {
        setToken(resp.data['access_token']);
        const waitTime = resp.data['access_token_expiry'] - new Date().getTime() - 1000;
        setTimeout(refreshToken, waitTime);
        return true;
      })
      .catch(err => {
        //log err if possible
        return null;
      });
  };

  const resetAuth = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    history.push('/');
  };

  // check for previous sign in and if so, refresh and on error resetAuth
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if(user) {
      refreshToken().then(resp => {
        resp ? setUser(user) : resetAuth();
        });
    }
  }, []);

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

