import { useParams } from "react-router-dom";
import "../styles/SpecificNote.css";
import { MaterialSymbolsUndoRounded } from "../assets/Icons";
import { URLFrontend, URLbackend } from "../assets/URLs";
import { NavLink } from "../components/NavLink";
import { useEffect, useState } from "react";
import { Note } from "./Notes";

const URL = `${URLbackend}/api/notes/spec-note`;

export default function SpecificNote() {
  const { noteId } = useParams();
  const [noteContent, setNoteContent] = useState<Note>();

  useEffect(() => {
    const authRaw = window.localStorage.getItem("SESSION_ID");

    if (authRaw) {
      const auth = JSON.parse(authRaw);

      (async () => {
        const data = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            authorization: `Bearer ${auth.token}`,
          },
          body: JSON.stringify({
            note_id: noteId,
          }),
        };

        try {
          const result = await fetch(URL, data);
          const res = await result.json();
          setNoteContent(res.result);
        } catch (e) {
          console.error(e);
        }
      })();
    } else {
      console.error("No login token");
    }
  }, [noteId]);

  function NoteContent() {
    return <h1>{noteContent?.note_id}</h1>;
  }

  return (
    <div className="specific-note">
      <div className="specific-note__util-bar">
        <div className="specific-note__util-bar__back">
          <NavLink to={`${URLFrontend}${history.state.usr}`}>
            <MaterialSymbolsUndoRounded />
          </NavLink>
        </div>
        <div className="specific-note__util-bar__buttons">
          <div></div>
        </div>
      </div>
      <div className="specific-note__box">
        <NoteContent />
      </div>
    </div>
  );
}
