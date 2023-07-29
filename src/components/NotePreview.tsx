import "../styles/NotePreview.css";
import createRandomString from "./createRandomString";

interface Note {
  note_id: string;
  title: string;
  priority: number;
  text: string;
}

export default function NotePreview(props: Note) {
  return (
    <div
      className="note-preview"
      key={props.note_id || createRandomString(20, false)}
    >
      <div className="note-preview__id-priority">
        <div className="note-preview__id-priority__id">
          <p>
            ID: <span>{props.note_id}</span>
          </p>
        </div>
        <div className="note-preview__id-priority__priority">
          <p>{props.priority}</p>
        </div>
      </div>
      <div className="note-preview__title">
        <h3>{props.title}</h3>
      </div>
      <div className="note-preview__text">
        <p>{props.text}</p>
      </div>
    </div>
  );
}
