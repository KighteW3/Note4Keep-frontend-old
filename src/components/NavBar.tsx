import { useEffect, useState } from "react";
import "../styles/NavBar.css";
import { useAuth } from "../hooks/useAuth";
import RegisterIcon, {
  DoubleArrowIcon,
  HomeIcon,
  LoginIcon,
  NotesIcon,
  ProfileIcon,
} from "../assets/Icons";
import { NavLink } from "./NavLink";

interface ArrowAnimation {
  name: string;
  duration: string;
  direction: string;
  fillMode: string;
}

export default function NavBar() {
  const [userMenuDesktop, setUserMenuDesktop] = useState(<></>);
  const [userMenuMobile, setUserMenuMobile] = useState(<></>);
  const authData = useAuth();
  const [navBarHidden, setNavBarHidden] = useState(false);
  const [arrowAnimation, setArrowAnimation] = useState<ArrowAnimation>({
    name: "rotate",
    duration: "0.5s",
    direction: "normal",
    fillMode: "forwards",
  });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScrollY(window.scrollY);
    });
  }, []);

  useEffect(() => {
    if (authData.ok) {
      setUserMenuDesktop(
        <NavLink to="/profile">
          <ProfileIcon />
        </NavLink>
      );
      setUserMenuMobile(
        <li className="nav-bar-mobile__menu__list__profile">
          <NavLink to="/profile">
            <ProfileIcon />
          </NavLink>
        </li>
      );
    } else {
      setUserMenuDesktop(
        <>
          <div className="nav-bar-login-button">
            <NavLink to="/users/login">Login</NavLink>
          </div>
          <div className="nav-bar-register-button">
            <NavLink to="/users/register">Register</NavLink>
          </div>
        </>
      );
      setUserMenuMobile(
        <>
          <li className="nav-bar-mobile__menu__list__profile">
            <NavLink to="/users/login">
              <LoginIcon />
            </NavLink>
          </li>
          <li className="nav-bar-mobile__menu__list__register">
            <NavLink to="/users/register">
              <RegisterIcon />
            </NavLink>
          </li>
        </>
      );
    }
  }, [authData]);

  useEffect(() => {
    let props = {
      name: "rotate",
      duration: "0.5s",
      direction: "normal",
      fillMode: "forwards",
    };

    if (!navBarHidden) {
      props = {
        name: "rotateReverse",
        duration: "0.5s",
        direction: "normal",
        fillMode: "forwards",
      };
    }

    setArrowAnimation(props);
  }, [navBarHidden]);

  const toggleNavBar = () => {
    if (navBarHidden) {
      setNavBarHidden(false);
    } else {
      setNavBarHidden(true);
    }
  };

  return (
    <>
      <nav className="nav-bar-desktop">
        <ul
          style={{
            display: navBarHidden ? "none" : "flex",
          }}
          className="nav-bar-desktop__list"
        >
          <li className="nav-bar-desktop__list__home">
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/notes">Notes</NavLink>
          </li>
          <li>{userMenuDesktop}</li>
        </ul>
        <div onClick={toggleNavBar} className="nav-bar-desktop__toggler">
          <DoubleArrowIcon
            style={{
              animationName: arrowAnimation.name,
              animationDuration: arrowAnimation.duration,
              animationDirection: arrowAnimation.direction,
              animationFillMode: arrowAnimation.fillMode,
            }}
          />
        </div>
      </nav>

      <nav className="nav-bar-mobile">
        <div className="nav-bar-mobile__menu">
          <ul className="nav-bar-mobile__menu__list">
            <li className="nav-bar-mobile__menu__list__home">
              <NavLink to="/" aria-label="Home">
                <HomeIcon />
              </NavLink>
            </li>
            <li className="nav-bar-mobile__menu__list__notes">
              <NavLink to="/notes">
                <NotesIcon />
              </NavLink>
            </li>
            {userMenuMobile}
          </ul>
        </div>
      </nav>
    </>
  );
}
