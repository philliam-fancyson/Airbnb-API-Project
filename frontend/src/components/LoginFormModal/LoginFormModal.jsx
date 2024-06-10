import { useState, useEffect } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const [validationErrors, setValidationErrors] = useState({})

  useEffect(() => {
    const errors = {};
    if (credential.length < 4) errors.credential = true
    if (password.length < 6) errors.password = true;

    setValidationErrors(errors);
  }, [credential, password])

  const loginDemo = (e) => {
    e.preventDefault();
    dispatch(sessionActions.login({credential: "Demoman", password: "kaboom"}));
    closeModal();
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  return (
    <div id="login">
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            placeholder="Username or Email"
            required
          />
        </label>
        <label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </label>
        {errors.credential && (
          <p>{errors.credential}</p>
        )}
        <button  id="login-button" type="submit" disabled={Object.keys(validationErrors).length}>Log In</button>
      </form>
      <p id="demo-user" onClick={loginDemo}>Demo User</p>
    </div>
  );
}

export default LoginFormModal;
