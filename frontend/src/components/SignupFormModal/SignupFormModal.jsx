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
        <div id="sign-up">
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
            {errors.firstName && <p style={{color: 'red'}}>{errors.firstName}</p>}
            {errors.password && <p style={{color: 'red'}}>{errors.password}</p>}
            {errors.confirmPassword && <p style={{color: 'red'}}>{errors.confirmPassword}</p>}
            {errors.email && <p style={{color: 'red'}}>{errors.email}</p>}
            {errors.username && <p style={{color: 'red'}}>Username must be unique</p>}
            <label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Username"
                >
                </input>
            </label>
            <label>
                <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Email"
                >
                </input>
            </label>
            <label>
                <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Password"
                >
                </input>
            </label>
            <label>
                <input
                    type="text"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm Password"
                >
                </input>
            </label>

            <label>
                <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    placeholder="First Name"
                >
                </input>
            </label>

            <label>

                <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    placeholder="Last Name"
                >
                </input>
            </label>
            {errors.lastName && <p style={{color: 'red'}}>{errors.lastName}</p>}
            <button id="sign-up-button" type="submit" disabled={Object.keys(validationErrors).length}>Sign Up</button>
        </form>
        </div>
    )

}


export default SignupFormModal;
