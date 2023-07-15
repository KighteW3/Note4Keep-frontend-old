import { useEffect, useState } from "react";
import { host } from "../components/host";
import "../styles/Notes.css";
import { Outlet, useParams } from "react-router-dom";
import NotesNavBar from "../components/NotesNavBar";
import NotePreview from "../components/NotePreview";

interface Note {
  note_id: string;
  title: string;
  priority: number;
  text: string;
}

const noteExample = {
  note_id: "id example",
  title: "title example",
  priority: 0,
  text: "text example",
};

export default function Notes() {
  const [notesList, setNotesList] = useState<Note[]>([noteExample]);
  const [notePageOrd, setNotePageOrd] = useState<Note[][]>([[noteExample]]);
  const [isRoot, setIsRoot] = useState<boolean>(true);
  const { numPage } = useParams();
  const [numPageToUse, setNumPageToUse] = useState<number>(0);

  const URL = `http://${host}:5722/api/notes`;

  // useEffect para el funcionamiento del componente
  useEffect(() => {
    const authRaw = window.localStorage.getItem("SESSION_ID");

    if (authRaw) {
      (async () => {
        const auth = JSON.parse(authRaw);

        const data = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${auth.token}`,
          },
        };

        try {
          const result = await fetch(URL, data);
          const res = await result.json();
          setNotesList(res.result);
        } catch (e) {
          console.error(e);
        }
      })();
    } else {
      console.error("No auth provided");
    }
  }, [URL]);

  // useEffect para la gestión de las páginas
  useEffect(() => {
    const numOfPages =
      notesList && notesList.length > 0
        ? Math.ceil(notesList.length / 28)
        : null;

    const notesPages = [];

    if (numOfPages) {
      for (let i = 0; i < numOfPages; i++) {
        if (i > 0) {
          const a = 28 * i;
          const b = a + 28;

          const c = [];

          for (let j = a; j < b; j++) {
            if (notesList[j]) {
              c.push(notesList[j]);
            }
          }

          notesPages.push(c);
        } else {
          const a = [];
          for (let j = 0; j < 28; j++) {
            if (notesList[j]) {
              a.push(notesList[j]);
            }
          }

          notesPages.push(a);
        }
      }
    }

    setNotePageOrd(notesPages);
  }, [notesList]);

  useEffect(() => {
    const a = numPage ? parseInt(numPage) - 1 : 0;
    setNumPageToUse(a);

    setIsRoot(
      window.location.pathname.startsWith("/notes") &&
        !window.location.pathname.includes("search" || "id")
        ? true
        : false
    );
  }, [numPage]);

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
        <NotesNavBar />
        <Outlet />
        {isRoot && notePageOrd[numPageToUse] ? (
          <div className="notes-main__notes-container">
            {notePageOrd[numPageToUse].map((result) => {
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
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
