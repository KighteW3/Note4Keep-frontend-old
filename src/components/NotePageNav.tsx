import "../styles/NotePageNav.css";
import type { Note } from "../routes/Notes";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface PageNavProps {
  numPageInt: number;
  notesList: Note[];
  toUrl: string;
}

export default function NotePageNav({ numPageInt, notesList, toUrl }: PageNavProps) {
  const [numOfPages, setNumOfPages] = useState<number>(0);
  const numPage = numPageInt + 1;
  const notesListLength = notesList.length;

  useEffect(() => {
    if (notesList && notesList.length > 0 && notesListLength) {
      const totalPages = Math.ceil(notesListLength / 28);
      setNumOfPages(totalPages);
    }
  }, [notesList, notesListLength]);

  return (
    <>
      <div className="note-page-nav-container">
        <nav className="note-page-nav">
          <Link to={toUrl && toUrl.includes("search") ? `/notes/search/${numPageInt}`} >Anterior</Link>
          <div></div>
          <Link>Siguiente</Link>
        </nav>
      </div>
    </>
  );
}
