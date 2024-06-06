import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <nav id="navBar">
      <ul>
        <li id="navBar-left">
          <NavLink to="/"><img src="/geekbnblogo.png" /></NavLink>
        </li>
        <div id='navBar-right'>
        {sessionUser && (
          <li>
            <NavLink to="/spots/new">Create a New Spot</NavLink>
          </li>
        )}
        {isLoaded && (
          <li>
            <ProfileButton user={sessionUser} />
          </li>
        )}
        </div>
      </ ul>
    </nav>
  );
}

export default Navigation;
