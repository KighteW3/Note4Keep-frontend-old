import React from "react";
import "../styles/NotesNavBar.css";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/store";
import { dialogToShow, turnDialog } from "../store/dialogDisplay";
import CreateNote from "./CreateNote";
import ConfirmDialog from "./ConfirmDialog";
import { refreshCount, refreshLog } from "../store/refreshNotes";
import { URLbackend } from "../assets/URLs";

interface FormStructure extends HTMLFormElement {
  search: { value: string };
}

export default function NotesNavBar() {
  const refresh = useAppSelector((state) => state.refreshNotes.refresh);
  const dispatch = useAppDispatch();
  const dialogTurn = useAppSelector((state) => state.dialogDisplay.turn);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<FormStructure>) => {
    e.preventDefault();

    const searchQuery = e.currentTarget.search.value;
    console.log(searchQuery);

    dispatch(refreshCount(refresh + 1));
    if (searchQuery == "" || !searchQuery) {
      navigate("../notes/", { replace: true });
    } else {
      navigate(`../notes/search/${searchQuery}`, { replace: true });
    }
  };

  const WriteNote = () => {
    if (!dialogTurn) {
      dispatch(turnDialog(true));
      dispatch(dialogToShow(<CreateNote />));
    }
  };

  const handleDelete = () => {
    const deleteNotes = async () => {
      const URL = `${URLbackend}/api/notes/delete-all-notes`;
      const authRaw = window.localStorage.getItem("SESSION_ID");

      if (authRaw) {
        const auth = JSON.parse(authRaw);

        const data = {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${auth.token}`,
          },
        };

        try {
          const result = await fetch(URL, data);
          const res = await result.json();

          if (res.ok) {
            console.log("notes deleted");
            dispatch(refreshCount(refresh + 1));
            dispatch(refreshLog("Notes deleted"));
          } else {
            console.error(res);
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        console.error("No auth b");
      }
    };

    if (!dialogTurn) {
      dispatch(turnDialog(true));
      dispatch(
        dialogToShow(
          <ConfirmDialog
            question="Are you sure about deleting all notes from account?"
            action={deleteNotes}
          />
        )
      );
    }
  };

  const handleRefresh = () => {
    dispatch(refreshCount(refresh + 1));
  };

  return (
    <nav className="notes-nav">
      <div className="notes-nav__bar">
        <form className="notes-nav__bar__form" onSubmit={handleSubmit}>
          <input
            id="notes-nav__bar__form__search"
            type="search"
            placeholder="Search for your notes here..."
            name="search"
          />
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>

            <input id="notes-nav__bar__form__submit" type="submit" value="" />
          </button>
        </form>

        <div className="notes-nav__bar__buttons">
          <div className="notes-nav__bar__buttons__button notes-nav__bar__buttons__refresh">
            <button onClick={handleRefresh}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            </button>
          </div>
          <div className="notes-nav__bar__buttons__button notes-nav__bar__buttons__delete">
            <button onClick={handleDelete}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                />
              </svg>
            </button>
          </div>
          <div className="notes-nav__bar__buttons__button notes-nav__bar__buttons__filters">
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
                />
              </svg>
            </button>
          </div>
          <div className="notes-nav__bar__buttons__button notes-nav__bar__buttons__write">
            <button onClick={WriteNote}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
