import "../styles/Home.css";
import { useAppDispatch, useAppSelector } from "../hooks/store";
import { useEffect, useState } from "react";
import { useLocation, useNavigation } from "react-router-dom";
import NotePreview from "../components/NotePreview";
import { hostB } from "../components/host";

interface resultInfo {
  ok: boolean;
  userInfo: {
    username: string;
    email: string;
  };
}

interface notes {
  note_id: string;
  title: string;
  priority: number;
  text: string;
}

const defaultNote = {
  note_id: "id-example",
  title: "title-example",
  priority: 5,
  text: "text-example",
};

export default function Home() {
  const logged: resultInfo = useAppSelector((state) => state.userInfo);
  const refresh = useAppSelector((state) => state.refreshNotes.refresh);
  const dispatch = useAppDispatch();
  const [notesList, setNotesList] = useState<notes[] | null>([defaultNote]);

  const location = useLocation();
  const render = location.state?.shouldRender;

  useEffect(() => {
    const token = window.localStorage.getItem("SESSION_ID");

    if (token) {
      (async () => {
        const tokenDecoded = await JSON.parse(token);
        const URL = `http://${hostB}:5722/api/notes`;

        const data = {
          method: "GET",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${tokenDecoded.token}`,
          },
        };

        try {
          const response = await fetch(URL, data);
          const res = await response.json();

          if (response.ok) {
            setNotesList(res.result);
          } else {
            setNotesList([defaultNote]);
          }
        } catch (e) {
          console.error(e);
        }
      })();
    } else {
      setNotesList(null);
    }
  }, [refresh, logged, dispatch, render]);

  return (
    <div className="home">
      <div className="home-welcome">
        {logged.ok ? (
          <h1>Welcome {logged.userInfo.username} !</h1>
        ) : (
          <h1>Welcome anonymous !</h1>
        )}
      </div>
      <div className="home-notes-preview">
        {notesList !== null ? (
          <div className="home-notes-preview__container">
            <div className="home-notes-preview__container__title">
              <h2>Notes preview</h2>
            </div>
            <div className="home-notes-preview__container__content">
              {notesList.map((result) => {
                return (
                  <NotePreview
                    note_id={result.note_id}
                    title={result.title}
                    priority={result.priority}
                    text={result.text}
                  />
                );
              })}
            </div>
          </div>
        ) : (
          <div className="home-notes-preview__alert">
            <p>
              No user provided, so no online notes stored. Try making an account
              or login into one and create some notes.
            </p>
          </div>
        )}
      </div>
      <div></div>
    </div>
  );
}
