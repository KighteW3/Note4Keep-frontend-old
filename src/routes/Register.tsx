import { FormEvent } from "react";
import { useAuth } from "../hooks/useAuth";
import { useAppDispatch } from "../hooks/store";
import { updateLoginInfo } from "../store/userInfo";
import { URLFrontend, URLbackend } from "../assets/URLs";
import "../styles/Register.css";

export default function Register() {
  const dispatch = useAppDispatch();
  const authData = useAuth();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const form = event.target as typeof event.target & {
      username: { value: string };
      password: { value: string };
      email: { value: string };
    };

    const username = form.username.value;
    const password = form.password.value;
    const email = form.email.value;

    const data = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
        email: email,
      }),
    };

    (async () => {
      try {
        const url = `${URLbackend}/api/users/create-user`;
        const res = await fetch(url, data);
        const result = await res.json();

        if (res.ok) {
          window.localStorage.setItem("SESSION_ID", JSON.stringify(result));
          dispatch(updateLoginInfo(authData));
          window.open(`${URLFrontend}/`, "_self");
        } else {
          console.error(result.error);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="username" name="username" required />
      <input type="password" placeholder="password" name="password" required />
      <input type="mail" placeholder="email" name="email" />
      <input type="submit" value="Enviar" />
    </form>
  );
}
