import { useEffect, useState } from "react";
import "../styles/Notes.css";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import NotesNavBar from "../components/NotesNavBar";
import NotePreview from "../components/NotePreview";
import NotePageNav from "../components/NotePageNav";
import { useAppSelector } from "../hooks/store";
import { URLbackend } from "../assets/URLs";

export interface Note {
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
  const refresh = useAppSelector((state) => state.refreshNotes.refresh);
  const [notesList, setNotesList] = useState<Note[]>([noteExample]);
  const [notePageOrd, setNotePageOrd] = useState<Note[][]>([[noteExample]]);
  const [isRoot, setIsRoot] = useState<boolean>(true);
  const [numPageToUse, setNumPageToUse] = useState<number>(0);
  const { numPage } = useParams();
  const { state } = useLocation();
  const [returnNotes, setReturnNotes] = useState(<></>);

  const URL = `${URLbackend}/api/notes`;

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

    window.scrollTo(0, 0);
  }, [URL, refresh]);

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
  }, [notesList, refresh]);

  useEffect(() => {
    const a = numPage ? parseInt(numPage) - 1 : 0;
    setNumPageToUse(a);

    setIsRoot(
      window.location.pathname.startsWith("/notes") &&
        !window.location.pathname.includes("search" || "id")
        ? true
        : false
    );
  }, [numPage, state]);

  useEffect(() => {
    if (isRoot) {
      if (notePageOrd[numPageToUse]) {
        setReturnNotes(
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
            <NotePageNav
              numPageInt={numPageToUse}
              notesList={notesList || []}
              toUrl={["general", window.location.pathname.toString()]}
            />
          </div>
        );
      }
    } else {
      setReturnNotes(<Outlet />);
    }
  }, [isRoot, notePageOrd, notesList, numPageToUse, refresh]);

  return (
    <>
      <div className="notes-main">
        <NotesNavBar />
        {returnNotes}
      </div>
    </>
  );
}
