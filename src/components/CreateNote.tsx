import { FormEvent, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/store";
import { refreshCount, refreshLog } from "../store/refreshNotes";
import "../styles/CreateNote.css";
import DialogsBar from "./DialogsBar";
import { URLFrontend, URLbackend } from "../assets/URLs";

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

    for (let i = 1; i < 5; i++) {
      i === 2
        ? x.push(
            <option selected value={i}>
              {i} {"(Default)"}
            </option>
          )
        : x.push(<option value={i}>{i}</option>);
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
      //console.log(token);
      const tokenDecoded = JSON.parse(token);
      //console.log(tokenDecoded);

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

      const URL = `${URLbackend}/api/notes/create-note`;

      (async () => {
        const response = await fetch(URL, data);
        const resParsed = await response.json();

        if (response.ok) {
          //console.log(resParsed.response);
          dispatch(refreshLog("Note created"));
          dispatch(refreshCount(refresh + 1));
          window.scrollTo(0, 0);
        } else {
          console.error(resParsed.error);
        }
      })();
    } else {
      window.open(`${URLFrontend}/`);
    }
  };

  return (
    <div className="create-note-container">
      <div className="create-note">
        <DialogsBar title="Create note" />
        <form onSubmit={handleSubmit} className="create-note__content">
          <div className="create-note__content__structure">
            <div className="create-note__content__structure__headers">
              <input
                className="create-note__content__structure__headers__items"
                type="text"
                placeholder="Insert here the title of the note"
                name="title"
                required
              />
              <select
                className="create-note__content__structure__headers__items"
                name="priority"
              >
                {optionsList.map((result) => {
                  return result;
                })}
              </select>
            </div>
            <div className="create-note__content__structure__body">
              <pre>
                <textarea
                  name="text"
                  required
                  placeholder="Type your note content"
                ></textarea>
              </pre>
            </div>
            <input type="submit" value="Submit" />
          </div>
        </form>
      </div>
    </div>
  );
}
