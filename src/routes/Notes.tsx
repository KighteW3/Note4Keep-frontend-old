import { useEffect, useState } from "react";
import CreateNote from "../components/CreateNote";
import { useAppDispatch, useAppSelector } from "../hooks/store";
import { refreshCount, refreshLog } from "../store/refreshNotes";
import { host } from "../components/host";

interface Note {
  note_id: string;
  title: string;
  priority: number;
  text: string;
}

export default function Notes() {
  const refresh = useAppSelector((state) => state.refreshNotes.refresh);
  const dispatch = useAppDispatch();
  const [notesList, setNotesList] = useState<JSX.Element | null>(null);

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
      <CreateNote />
      <button
        onClick={() => {
          dispatch(refreshCount(refresh + 1));
        }}
      >
        Actualizar
      </button>
      {notesList}
    </>
  );
}
