import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton';
import * as sessionActions from '../../store/session';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  return (
    <nav id="navBar">
        <div id="navBar-left">
          <NavLink to="/"><img src="/geekbnblogo.png" /></NavLink>
        </ div>
        <div id='navBar-right'>
        {sessionUser && (
          <div>
            <NavLink to="/spots/new">Create a New Spot</NavLink>
          </ div>
        )}
        {isLoaded && (
          <div>
            <ProfileButton user={sessionUser} />
          </ div>
        )}
        </div>
    </nav>
  );
}

export default Navigation;
