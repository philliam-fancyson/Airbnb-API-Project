import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <nav id="navBar">
        <div id="navBar-left">
          <NavLink to="/"><img src="/geekbnblogo.png" /></NavLink>
        </ div>
        <div id='navBar-right'>
        {sessionUser && (
          <div id="spot-create">
            <NavLink to="/spots/new" style={{"paddingRight": "10px"}}>Create a New Spot</NavLink>
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
