import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { URLFrontend, URLbackend } from "../assets/URLs";

export default function Register() {
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const form = event.target as typeof event.target & {
      username: { value: string };
      password: { value: string };
    };

    const username = form.username.value;
    const password = form.password.value;

    const data = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    };

    (async () => {
      try {
        const url = `${URLbackend}/api/users/login`;
        const res = await fetch(url, data);
        const result = await res.json();

        if (res.ok) {
          window.localStorage.setItem(`SESSION_ID`, JSON.stringify(result));
          navigate("/", { state: { shouldRender: true } });
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
      <input type="submit" value="Enviar" />
    </form>
  );
}
