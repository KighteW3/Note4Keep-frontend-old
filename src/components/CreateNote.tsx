import { FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/store";
import { refreshCount, refreshLog } from "../store/refreshNotes";
import { host, port } from "./host";

interface Form {
  title: { value: string };
  priority: { value: number };
  text: { value: string };
}

export default function CreateNote() {
  const refresh = useAppSelector((state) => state.refreshNotes.refresh);
  const dispatch = useAppDispatch();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const form = event.target as typeof event.target & Form;

    const title = form.title.value;
    const priority = form.priority.value;
    const text = form.text.value;

    const token = window.localStorage.getItem("SESSION_ID");

    if (token) {
      console.log(token);
      const tokenDecoded = JSON.parse(token);
      console.log(tokenDecoded);

      const data = {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${tokenDecoded.token}`,
        },
        body: JSON.stringify({
          title: title,
          priority: priority,
          text: text,
        }),
      };

      const URL = `http://${host}:${port}/api/notes/create-note`;

      (async () => {
        const response = await fetch(URL, data);
        const resParsed = await response.json();

        if (response.ok) {
          console.log(resParsed.response);
          dispatch(refreshCount(refresh + 1));
          dispatch(refreshLog("Note created"));
        } else {
          console.error(resParsed.error);
        }
      })();
    } else {
      window.open(`http://${host}:${port}/`);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="title" />
        <select placeholder="5" name="priority">
          <option hidden value={5}>
            Select an option
          </option>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
          <option value={6}>6</option>
          <option value={7}>7</option>
          <option value={8}>8</option>
          <option value={9}>9</option>
          <option value={10}>10</option>
        </select>
        <input type="text" name="text" placeholder="Text" />
        <input type="submit" value="Enviar" />
      </form>
    </>
  );
}
