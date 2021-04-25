import React, {useState, useContext, createContext} from "react";
import {baseInstance} from './api';

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
 * and handles state changes
 */
function useProvideAuth() {
  const [user, setUser] = useState(null);

  const signin = (email, password) => {
    return baseInstance
      .post('api/login', {email, password})
      .then(resp => {
        setUser({...resp.data, username:'actyp@home.gr', id: 1});
        return resp.data;})
      .catch(err => {
        console.log(err);
        return null;
      });
  };

  const signup = (email, password) => {
    return baseInstance
      .post('api/register', {email, password})
      .then(resp => resp.data)
      .catch(err => {
        console.log(err);
        return null;
      });
  };

  const signout = () => {
    setUser(null);
    return true;
  };

  return {
    user,
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

