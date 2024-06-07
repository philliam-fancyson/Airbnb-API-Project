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
    const [hasSubmitted, setHasSubmitted] = useState(false)
    const { closeModal } = useModal();

    useEffect(() => {
        const errors = {};
        if (username.length < 4) errors.usernameLength = "Username must be more than 4 characters"
        if (password.length < 6) errors.passwordLength = "Password must be more than 6 characeters"
        if (!confirmPassword) errors.confirmPassword  = "Confirm Password is required"
        if (!firstName) errors.firstName = "First name is required"
        if (!lastName) errors.lastName = "Last name is required"
        if (!username) errors.username = "Username is required"
        if (!email) errors.email = "Email is required"
        setValidationErrors(errors)
    }, [username, password, confirmPassword, firstName, lastName, username, email])

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
            <button type="submit" disabled={Object.keys(validationErrors).length}>Log In</button>
        </form>
        </>
    )

}


export default SignupFormModal;
