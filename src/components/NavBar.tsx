import { useEffect, useState } from "react";
import "../styles/NavBar.css";
import { Link } from "react-router-dom";
import { host } from "./host";
import { useAuth } from "../hooks/useAuth";

export default function NavBar() {
  const [userMenuDesktop, setUserMenuDesktop] = useState(<></>);
  const [userMenuMobile, setUserMenuMobile] = useState(<></>);
  const authData = useAuth();

  const handleClick = () => {
    window.localStorage.removeItem("SESSION_ID");
    window.open(`http://${host}:5173/`, "_self");
  };

  useEffect(() => {
    if (authData.ok) {
      setUserMenuDesktop(
        <>
          <button onClick={handleClick}>Log out</button>
        </>
      );
      setUserMenuMobile(
        <>
          <li className="nav-bar-mobile__menu__list__profile">
            <Link to="/profile">
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
                  d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </Link>
          </li>
        </>
      );
    } else {
      setUserMenuDesktop(
        <>
          <div>
            <Link to="/users/login">Login</Link>
          </div>
          <div>
            <Link to="/users/register">Register</Link>
          </div>
        </>
      );
      setUserMenuMobile(
        <>
          <li className="nav-bar-mobile__menu__list__profile">
            <Link to="/users/login">
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
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                />
              </svg>
            </Link>
          </li>
          <li className="nav-bar-mobile__menu__list__register">
            <Link to="/users/register">
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
                  d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                />
              </svg>
            </Link>
          </li>
        </>
      );
    }
  }, [authData]);

  return (
    <>
      <nav className="nav-bar-desktop">
        <ul className="nav-bar-desktop__list">
          <li className="nav-bar-desktop__list__home">
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/notes" state={{ refreshNow: true }}>
              Notes
            </Link>
          </li>
          <li>{userMenuDesktop}</li>
        </ul>
        <div className="nav-bar-desktop__toggler"></div>
      </nav>

      <nav className="nav-bar-mobile">
        <div className="nav-bar-mobile__menu">
          <ul className="nav-bar-mobile__menu__list">
            <li className="nav-bar-mobile__menu__list__home">
              <Link to="/">
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
                    d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg>
              </Link>
            </li>
            <li className="nav-bar-mobile__menu__list__notes">
              <Link to="/notes">
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
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
              </Link>
            </li>
            {userMenuMobile}
          </ul>
        </div>
      </nav>
    </>
  );
}
