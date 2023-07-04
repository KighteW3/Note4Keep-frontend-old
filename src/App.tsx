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
import { useAppDispatch } from "./hooks/store";
import { updateLoginInfo } from "./store/userInfo";

export default function App() {
  const dispatch = useAppDispatch();
  const authData = useAuth();

  useEffect(() => {
    dispatch(updateLoginInfo(authData));
  }, [dispatch, authData]);

  return (
    <main>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="notes" element={<Notes />} />
        <Route path="notes/:noteId" element={<SpecificNote />} />
        <Route path="users/login" element={<Login />} />
        <Route path="users/register" element={<Register />} />
        <Route path="*" element={<>Not found</>} />
      </Routes>
    </main>
  );
}
