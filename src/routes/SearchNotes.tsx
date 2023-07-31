import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NotePreview from "../components/NotePreview";
import type { Note } from "./Notes";

import "../styles/SearchNotes.css";
import NotePageNav from "../components/NotePageNav";
import { hostB } from "../components/host";
import { useAppSelector } from "../hooks/store";

const noteExample = {
  note_id: "id example",
  title: "title example",
  priority: 0,
  text: "text example",
};

export default function SearchNotes() {
  const { searchQuery, numPage } = useParams();
  const [notesList, setNotesList] = useState<Note[]>([noteExample]);
  const [notePageOrd, setNotePageOrd] = useState<Note[][]>([[noteExample]]);
  const [numPageToUse, setNumPageToUse] = useState<number>(0);
  const navigate = useNavigate();
  const refresh = useAppSelector((state) => state.refreshNotes.refresh);

  const URL = `http://${hostB}:5722/api/notes/some-note`;

  useEffect(() => {
    if (searchQuery === "" || window.location.pathname === "/notes/search/") {
      navigate(`../notes/`, { replace: true });
    }

    const token = window.localStorage.getItem("SESSION_ID");

    (async () => {
      if (token) {
        const tokenDecoded = JSON.parse(token);

        const data = {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${tokenDecoded.token}`,
          },
          body: JSON.stringify({
            note_phrase: searchQuery,
          }),
        };

        try {
          const result = await fetch(URL, data);
          const res = await result.json();
          setNotesList(res.result);
        } catch (e) {
          console.error(e);
        }
      }
    })();
  }, [URL, searchQuery, navigate, refresh]);

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

    if (notesList) {
      setNotePageOrd(notesPages);
    }
  }, [notesList, refresh]);

  useEffect(() => {
    const a = numPage ? parseInt(numPage) - 1 : 0;

    setNumPageToUse(a);
  }, [numPage, notePageOrd, refresh]);

  return (
    <div className="search-notes">
      <div className="search-notes__content">
        {notesList && notePageOrd[numPageToUse] ? (
          notePageOrd[numPageToUse].map((result) => {
            return (
              <NotePreview
                note_id={result.note_id}
                title={result.title}
                priority={result.priority}
                text={result.text}
              />
            );
          })
        ) : (
          <></>
        )}
        <NotePageNav
          numPageInt={numPageToUse}
          notesList={notesList || [noteExample]}
          toUrl={[
            "search",
            window.location.pathname.toString(),
            searchQuery || "",
          ]}
        />
      </div>
    </div>
  );
}
