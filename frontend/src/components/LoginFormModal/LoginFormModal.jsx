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
    navigate('/')
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
    <>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && (
          <p>{errors.credential}</p>
        )}
        <button type="submit" disabled={Object.keys(validationErrors).length}>Log In</button>
      </form>
      <button onClick={loginDemo}>Log in as Demo User</button>
    </>
  );
}

export default LoginFormModal;
