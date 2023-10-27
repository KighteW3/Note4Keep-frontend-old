import { useParams } from "react-router-dom";
import "../styles/SpecificNote.css";
import { MaterialSymbolsUndoRounded } from "../assets/Icons";
import { URLFrontend } from "../assets/URLs";
import { NavLink } from "../components/NavLink";

export default function SpecificNote() {
  const { noteId } = useParams();
  console.log(history);

  return (
    <div className="specific-note">
      <div className="specific-note__util-bar">
        <div className="specific-note__util-bar__back">
          <NavLink to={`${URLFrontend}${history.state.usr}`}>
            <MaterialSymbolsUndoRounded />
          </NavLink>
        </div>
        <div className="specific-note__util-bar__buttons"></div>
      </div>
      <div className="specific-note__box">{noteId}</div>
    </div>
  );
}
