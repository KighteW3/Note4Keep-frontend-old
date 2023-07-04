import "../styles/Home.css";
import { useAppDispatch, useAppSelector } from "../hooks/store";
import { useEffect, useState } from "react";
import { host } from "../components/host";

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

export default function Home() {
  const logged: resultInfo = useAppSelector((state) => state.userInfo);
  const refresh = useAppSelector((state) => state.refreshNotes.refresh);
  const dispatch = useAppDispatch();
  const [notesList, setNotesList] = useState<notes[] | null>(null);

  useEffect(() => {
    if (logged.ok) {
      const token = window.localStorage.getItem("SESSION_ID");

      if (token) {
        const tokenDecoded = JSON.parse(token);
        const URL = `http://${host}:5722/api/notes`;

        const data = {
          method: "GET",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${tokenDecoded.token}`,
          },
        };

        (async () => {
          try {
            const response = await fetch(URL, data);
            const res = await response.json();

            if (response.ok) {
              setNotesList(res.result);
              /* dispatch(refreshCount(refresh + 1));
              dispatch(refreshLog("Automatic refresh")); */
              console.log("ok");
            } else {
              setNotesList([]);
            }
          } catch (e) {
            console.error(e);
          }
        })();
      } else {
        setNotesList(null);
      }
    } else {
      setNotesList(null);
    }
  }, [refresh, logged, dispatch]);

  return (
    <div className="home">
      <div className="home-welcome">
        {logged.ok ? <h1>Welcome {logged.userInfo.username} !</h1> : <h1>Welcome anonymous !</h1>}
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
                  <div
                    className="home-notes-preview__container__content__note"
                    key={result.note_id}
                  >
                    <div className="home-notes-preview__container__content__note__id-priority">
                      <div className="home-notes-preview__container__content__note__id-priority__id">
                        <p>
                          ID: <span>{result.note_id}</span>
                        </p>
                      </div>
                      <div className="home-notes-preview__container__content__note__id-priority__priority">
                        <p>{result.priority}</p>
                      </div>
                    </div>
                    <div className="home-notes-preview__container__content__note__title">
                      <h3>{result.title}</h3>
                    </div>
                    <div className="home-notes-preview__container__content__note__id-priority__text">
                      <p>{result.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="home-notes-preview__alert">
            <p>No user provided, so no online notes stored. Try making an account or login into one and create some notes.</p>
          </div>
        )}
      </div>
      <div></div>
    </div>
  );
}
