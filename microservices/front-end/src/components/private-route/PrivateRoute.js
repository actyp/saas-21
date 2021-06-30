import {useAuth} from "../../services/auth";
import { Redirect } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const auth = useAuth();
  return (
    auth.user ? children : <Redirect to="/" />
  );
}