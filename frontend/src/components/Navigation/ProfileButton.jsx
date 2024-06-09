import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './ProfileButton.css'
import { CgProfile } from "react-icons/cg";
import { Link, useNavigate } from 'react-router-dom';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    navigate('/')
  };

  const ulClassName = "profile-dropdown" + (showMenu ? " isActive" : " hidden");

  return (
    <>
        <CgProfile
            onClick={toggleMenu}
            className="dropdown-icon"
            style={{"color": "#FF5A5F"}}
        />
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <li>Hello {user.firstName}</li>
            <li>{user.email}</li>
            <li><Link to='/spots/manage'><button onClick={closeMenu}>Manage Spots</button></Link></li>
            <li>
              <button onClick={logout}>Log Out</button>
            </li>
          </>
        ) : (
          <>
              <OpenModalMenuItem
                itemText="Log In"
                onButtonClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
              <OpenModalMenuItem
                itemText="Sign Up"
                onButtonClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
          </>
        )}
      </ul>

    </ >
  );
}

export default ProfileButton;
