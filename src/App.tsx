import "./styles/App.css";
import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Register from "./routes/Register";
import Login from "./routes/Login";
import Home from "./routes/Home";
import { useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import Notes from "./routes/Notes";
import SpecificNote from "./routes/SpecificNote";
import { useAppDispatch, useAppSelector } from "./hooks/store";
import { updateLoginInfo } from "./store/userInfo";
import SearchNotes from "./routes/SearchNotes";

interface resultInfo {
  ok: boolean;
  userInfo: {
    username: string;
    email: string;
  };
}

export default function App() {
  const turnDialog = useAppSelector((state) => state.dialogDisplay.turn);
  const dialogContent = useAppSelector((state) => state.dialogDisplay.content);
  const dispatch = useAppDispatch();
  const authData: resultInfo = useAuth();

  useEffect(() => {
    dispatch(updateLoginInfo(authData));
  }, [dispatch, authData]);

  return (
    <main>
      <div
        className="modal-display"
        style={{ display: turnDialog ? "flex" : "none" }}
      >
        <div className="modal-display__box">{dialogContent || <></>}</div>
      </div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="notes" element={<Notes />}>
          <Route path="search/:searchQuery" element={<SearchNotes />} />
          <Route
            path="search/:numPage/:searchQuery"
            element={<SearchNotes />}
          />
        </Route>
        <Route path="notes/:numPage" element={<Notes />} />
        <Route path="notes/id/:noteId" element={<SpecificNote />} />
        <Route path="users/login" element={<Login />} />
        <Route path="users/register" element={<Register />} />
        <Route path="*" element={<>Not found</>} />
      </Routes>
      <div style={{ height: "300px" }}></div>
    </main>
  );
}
