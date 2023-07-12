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
  const [notePageOrd, setNotePageOrd] = useState<Note[][]>();

  const URL = `http://${host}:5722/api/notes/some-note`;

  const token = window.localStorage.getItem("SESSION_ID");

  useEffect(() => {
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
          console.log(res);
          setNotesList(res.result);
        } catch (e) {
          console.error(e);
        }
      }
    })();

    const notesPages = [];
    const numPageInt = numPage ? parseInt(numPage) : null;

    if (numPageInt) {
      for (let i = 0; i < numPageInt; i++) {
        if (i > 0) {
          const a = 28 * numPageInt;
          const b = a + 28;

          const c = [];

          for (let j = a; j < b; j++) {
            c.push(notesList[j]);
          }

          notesPages.push(c);
        } else {
          const a = [];
          for (let j = 0; j < 28; j++) {
            a.push(notesList[j]);
          }

          notesPages.push(a);
        }
      }
    }

    setNotePageOrd(notesPages);
  }, [URL, token, searchQuery, notesList, numPage]);

  return (
    <div className="search-notes">
      <div className="search-notes__content">
        {notesList.map((result) => {
          return (
            <>
              <div key={result.note_id}>
                <p>{result.title}</p>
              </div>
            </>
          );
        })}
        {<>{notesList[0].title}</>}
      </div>
      <div className="search-notes__pages-count"></div>
    </div>
  );
}
