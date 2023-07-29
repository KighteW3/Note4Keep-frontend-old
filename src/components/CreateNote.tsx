import { FormEvent, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/store";
import { refreshCount, refreshLog } from "../store/refreshNotes";
import { hostB, hostF, portB, portF } from "./host";
import "../styles/CreateNote.css";

interface Form {
  title: { value: string };
  priority: { value: number };
  text: { value: string };
}

export default function CreateNote() {
  const refresh = useAppSelector((state) => state.refreshNotes.refresh);
  const dispatch = useAppDispatch();
  const [optionsList, setOptionsList] = useState([<></>]);

  useEffect(() => {
    const x = [];

    for (let i = 0; i < 5; i++) {
      const a = i + 1;
      x.push(<option value={a}>{a}</option>);
    }

    setOptionsList(x);
  }, []);

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

      const URL = `http://${hostB}:${portB}/api/notes/create-note`;

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
      window.open(`http://${hostF}:${portF}/`);
    }
  };

  return (
    /* <>
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
    </> */

    <div className="create-note-container">
      <div className="create-note">
        <div className="create-note__note-bar">
          <h2 className="create-note__note-bar__title">Crear nota</h2>
          <div className="create-note__note-bar__exit">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>
        <form className="create-note__note-content">
          <div className="create-note__note-content__structure">
            <div className="create-note__note-content__structure__headers">
              <input
                type="text"
                placeholder="Insert here the title of the note"
                name="title"
              />
              <select placeholder="5" name="priority">
                <option hidden value={2}>
                  Priority (default: 5)
                </option>
                {optionsList.map((result) => {
                  return <>{result}</>;
                })}
              </select>
            </div>
            <div className="create-note__note-content__structure__body">
              <textarea></textarea>
            </div>
            <input type="submit" value="Submit" />
          </div>
        </form>
      </div>
    </div>
  );
}
