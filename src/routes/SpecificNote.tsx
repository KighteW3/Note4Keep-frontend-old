import { useParams } from "react-router-dom";
import "../styles/SpecificNote.css";

export default function SpecificNote() {
  const { noteId } = useParams();

  return (
    <div className="specific-note">
      <div className="specific-note__box">{noteId}</div>
    </div>
  );
}
