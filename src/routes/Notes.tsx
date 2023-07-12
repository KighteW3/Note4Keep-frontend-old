import { useEffect, useState } from "react";
import CreateNote from "../components/CreateNote";
import { useAppDispatch, useAppSelector } from "../hooks/store";
import { refreshCount, refreshLog } from "../store/refreshNotes";
import { host } from "../components/host";
import "../styles/Notes.css";
import { Outlet } from "react-router-dom";

interface Note {
  note_id: string;
  title: string;
  priority: number;
  text: string;
}

export default function Notes() {
  const refresh = useAppSelector((state) => state.refreshNotes.refresh);
  const dispatch = useAppDispatch();
  const [notesList, setNotesList] = useState<React.JSX.Element | null>(null);

  useEffect(() => {
    const URL = `http://${host}:5722/api/notes`;
    const authRaw = window.localStorage.getItem("SESSION_ID");

    const noteHandleClick = (noteId: string) => {
      const token = window.localStorage.getItem("SESSION_ID");

      if (token) {
        const tokenDecoded = JSON.parse(token);

        const URL = `http://${host}:5722/api/notes/delete-note`;

        const data = {
          method: "DELETE",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${tokenDecoded.token}`,
          },
          body: JSON.stringify({
            note_id: noteId,
          }),
        };

        (async () => {
          const response = await fetch(URL, data);
          const resParsed = await response.json();

          if (response.ok) {
            console.log("note deleted");
            dispatch(refreshCount(refresh + 1));
            dispatch(refreshLog("Note deleted"));
          } else {
            console.log(resParsed.error);
          }
        })();
      }
    };

    if (authRaw) {
      (async () => {
        const auth = JSON.parse(authRaw);

        try {
          const result = await fetch(URL, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${auth.token}`,
            },
          });
          const data = await result.json();

          if (result.ok) {
            setNotesList(
              <>
                {data.result.map((note: Note) => (
                  <div key={note.note_id}>
                    <span>ID: {note.note_id}</span>
                    <span>Title: {note.title}</span>
                    <span>Priority: {note.priority}</span>
                    <span>Body: {note.text}</span>
                    <button onClick={() => noteHandleClick(note.note_id)}>
                      Delete
                    </button>
                  </div>
                ))}
              </>
            );
          } else {
            setNotesList(<div>Not found</div>);
          }
        } catch (e) {
          console.error(e);
        }
      })();
    } else {
      console.error("No auth provided");
    }
  }, [refresh, dispatch]);

  return (
    <>
      {/* <CreateNote />
      <button
        onClick={() => {
          dispatch(refreshCount(refresh + 1));
        }}
      >
        Actualizar
      </button>
      {notesList} */}

      <div className="notes-main">
        <nav className="notes-nav">
          <div className="notes-nav__bar">
            <form className="notes-nav__bar__form">
              <input
                id="notes-nav__bar__form__search"
                type="search"
                placeholder="awdadsawdad"
              />
              <button>
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
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>

                <input
                  id="notes-nav__bar__form__submit"
                  type="submit"
                  value=""
                />
              </button>
            </form>
            <div className="notes-nav__bar__buttons">
              <div className="notes-nav__bar__buttons__button notes-nav__bar__buttons__delete">
                <button>
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
                      d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                    />
                  </svg>
                </button>
              </div>
              <div className="notes-nav__bar__buttons__button notes-nav__bar__buttons__filters">
                <button>
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
                      d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
                    />
                  </svg>
                </button>
              </div>
              <div className="notes-nav__bar__buttons__button notes-nav__bar__buttons__write">
                <button>
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
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </nav>
        <Outlet />
      </div>
    </>
  );
}
