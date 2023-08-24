import { useEffect, useState } from "react";
import "../styles/NavBar.css";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { hostF } from "./host";
import RegisterIcon, {
  HomeIcon,
  LoginIcon,
  NotesIcon,
  ProfileIcon,
} from "../assets/Icons";

export default function NavBar() {
  const [userMenuDesktop, setUserMenuDesktop] = useState(<></>);
  const [userMenuMobile, setUserMenuMobile] = useState(<></>);
  const authData = useAuth();

  const handleClick = () => {
    window.localStorage.removeItem("SESSION_ID");
    window.open(`http://${hostF}:5173/`, "_self");
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
              <ProfileIcon />
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
              <LoginIcon />
            </Link>
          </li>
          <li className="nav-bar-mobile__menu__list__register">
            <Link to="/users/register">
              <RegisterIcon />
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
              <Link to="/" aria-label="Home">
                <HomeIcon />
              </Link>
            </li>
            <li className="nav-bar-mobile__menu__list__notes">
              <Link to="/notes">
                <NotesIcon />
              </Link>
            </li>
            {userMenuMobile}
          </ul>
        </div>
      </nav>
    </>
  );
}
