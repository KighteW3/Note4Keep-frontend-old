import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { host } from "../components/host";

import "../styles/SearchNotes.css";

interface Note {
  note_id: string;
  title: string;
  priority: number;
  text: string;
}

export default function SearchNotes() {
  const { searchQuery, numPage } = useParams();
  const [notesList, setNotesList] = useState<Note[]>([
    {
      note_id: "id example",
      title: "title example",
      priority: 0,
      text: "text example",
    },
  ]);
  const [notePageOrd, setNotePageOrd] = useState<Note[][]>([
    [
      {
        note_id: "id example",
        title: "title example",
        priority: 0,
        text: "text example",
      },
    ],
  ]);
  const [numPageToUse, setNumPageToUse] = useState<number>(0);

  const URL = `http://${host}:5722/api/notes/some-note`;

  useEffect(() => {
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
  }, [URL, searchQuery]);

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
  }, [notesList]);

  useEffect(() => {
    const a = numPage ? parseInt(numPage) - 1 : 0;

    setNumPageToUse(a);
  }, [numPage, notePageOrd]);

  return (
    <div className="search-notes">
      <div className="search-notes__content">
        {notePageOrd[numPageToUse] ? (
          notePageOrd[numPageToUse].map((result) => {
            return (
              <div key={result.note_id}>
                <p>Title: {result.title}</p>
              </div>
            );
          })
        ) : (
          <></>
        )}
      </div>
      <div className="search-notes__pages-count"></div>
    </div>
  );
}
