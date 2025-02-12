import React, { Component } from 'react';
import { FaLock, FaEye, FaEyeSlash, FaRegCheckCircle, FaRegTimesCircle } from 'react-icons/fa';
import { withRouter } from 'react-router-dom';  // Import `withRouter` for class-based components
import './index.css';

class SignUp extends Component {
  state = {
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    mobile_number: '',
    showPassword: false,
    error: false,
    errorMsg: '',
    loading: false,
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  togglePasswordVisibility = () => {
    this.setState((prevState) => ({ showPassword: !prevState.showPassword }));
  };

  handleSignUpSubmit = async (event) => {
    event.preventDefault();
    const { email, password, confirmPassword, name, mobile_number } = this.state;

    if (password !== confirmPassword) {
      this.setState({ error: true, errorMsg: 'Passwords do not match.' });
      return;
    }

    if (!email || !password || !name || !mobile_number) {
      this.setState({ error: true, errorMsg: 'All fields are required.' });
      return;
    }

    this.setState({ loading: true, error: false, errorMsg: '' });

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, mobile_number }),
      });

      const data = await response.json();

      if (response.ok) {
        this.setState({
          email: '',
          password: '',
          confirmPassword: '',
          name: '',
          mobile_number: '',
          error: false,
          errorMsg: '',
        });
        if (this.props.onSuccess) {
          this.props.onSuccess();
        }

        // Redirect to login page after successful sign-up
        this.props.history.push('/login');
      } else {
        this.setState({ error: true, errorMsg: data.error || 'Sign-up failed.' });
      }
    } catch (error) {
      this.setState({ error: true, errorMsg: 'Something went wrong. Please try again.' });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const {
      email,
      password,
      confirmPassword,
      name,
      mobile_number,
      showPassword,
      error,
      errorMsg,
      loading,
    } = this.state;

    const isPasswordMatched = confirmPassword && password === confirmPassword;

    return (
      <div className="signup-background">
      <form onSubmit={this.handleSignUpSubmit} className="form">
        <h2>Sign Up</h2>

        <div className="form-group">
          <div className="input-container">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={this.handleChange}
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Mobile Number:</label>
          <input
            type="number"
            name="mobile_number"
            value={mobile_number}
            onChange={this.handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={this.handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>
            <FaLock /> Password:
          </label>
          <div className="input-container">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={password}
              onChange={this.handleChange}
              required
              disabled={loading}
              placeholder="Enter your password"
            />
            <span
              className="toggle-icon"
              onClick={this.togglePasswordVisibility}
              role="button"
              tabIndex={0}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        <div className="form-group">
          <label>
            <FaLock /> Confirm Password:
          </label>
          <div className="input-container">
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={this.handleChange}
              required
              disabled={loading}
              placeholder="Confirm your password"
            />
            {confirmPassword && (
              <span className={`validation-icon ${isPasswordMatched ? 'valid' : 'invalid'}`}>
                {isPasswordMatched ? <FaRegCheckCircle /> : <FaRegTimesCircle />}
              </span>
            )}
          </div>
        </div>

        <button type="submit" className="signup-btn" disabled={loading}>
          {loading ? <div className="spinner"></div> : 'Sign Up'}
        </button>

        {error && <p className="error">{errorMsg}</p>}

        <div className="redirect-container">
          <p>Already have an account?</p>
          <button
            type="button"
            className="redirect-login-btn"
            onClick={() => this.props.history.push('/login')}
          >
            Go to Login
          </button>
        </div>
      </form>
      </div>
    );
  }
}

// Wrap withRouter to use `history.push()` for redirection
export default withRouter(SignUp);
