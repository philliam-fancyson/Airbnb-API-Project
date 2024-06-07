import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';

function SignupFormModal() {
    const dispatch = useDispatch();
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("")
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [errors, setErrors] = useState({});
    const [validationErrors, setValidationErrors] = useState({})
    const { closeModal } = useModal();

    useEffect(() => {
        const errors = {};
        if (!username) errors.username = true;
        if (username.length < 4) errors.usernameLength = true;
        if (password.length < 6) errors.passwordLength = true;
        if (!confirmPassword) errors.confirmPassword  = true;
        if (!firstName) errors.firstName = true;
        if (!lastName) errors.lastName = true;
        if (!email) errors.email = true;
        setValidationErrors(errors)
    }, [username, password, confirmPassword, firstName, lastName, email])

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
          setErrors({});
          return dispatch(
            sessionActions.signup({
              email,
              username,
              firstName,
              lastName,
              password
            })
          )
          .then(closeModal)
          .catch(async (res) => {
            const data = await res.json();
            if (data?.errors) {
              setErrors(data.errors);
            }
          });
        }
        return setErrors({
          confirmPassword: "Confirm Password field must be the same as the Password field"
        });
      };

    return (
        <>
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
            <label>
                Username
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                >
                </input>
            </label>
            {errors.username && <p style={{color: 'red'}}>Username must be unique</p>}
            <label>
                Email
                <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                >
                </input>
            </label>
            {errors.email && <p style={{color: 'red'}}>{errors.email}</p>}
            <label>
                Password
                <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                >
                </input>
            </label>
            {errors.password && <p style={{color: 'red'}}>{errors.password}</p>}
            <label>
                Confirm Password
                <input
                    type="text"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                >
                </input>
            </label>
            {errors.confirmPassword && <p style={{color: 'red'}}>{errors.confirmPassword}</p>}
            <label>
                First Name
                <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                >
                </input>
            </label>
            {errors.firstName && <p style={{color: 'red'}}>{errors.firstName}</p>}
            <label>
                Last Name
                <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                >
                </input>
            </label>
            {errors.lastName && <p style={{color: 'red'}}>{errors.lastName}</p>}
            <button type="submit" disabled={Object.keys(validationErrors).length}>Sign Up</button>
        </form>
        </>
    )

}


export default SignupFormModal;
