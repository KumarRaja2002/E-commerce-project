import React, { Component } from 'react';
import Cookies from 'js-cookie';
import { Redirect } from 'react-router-dom';
import './index.css';

class Login extends Component {
  state = {
    email: '',
    password: '',
    error: false,
    errorMsg: '',
    loading: false,
    buttonsDisabled: false,
    redirectForgotPassword: false,
    redirectSignUp: false,
    redirectToHome: false,
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
    console.log(`Changed field: ${name}, Value: ${value}`);
  };

  onSubmitSuccess = jwtToken => {
    console.log('Login successful. JWT Token:', jwtToken);
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
    })
    history.replace('/')
  }

  onSubmitFailure = (message) => {
    console.log('Login failed. Error message:', message);
    this.setState({
      error: true,
      errorMsg: message,
      loading: false,
      buttonsDisabled: false,
    });
  };

  handleLoginSubmit = async (event) => {
    event.preventDefault();
    const { email, password } = this.state;
    console.log('Login form submitted. Email:', email, 'Password:', password);

    // Simple validation
    if (!email || !password) {
      this.onSubmitFailure('Email and Password are required');
      return;
    }

    this.setState({ loading: true, buttonsDisabled: true });
    console.log('Sending login request...');

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/users/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      console.log('Access token:', data.data.access_token);
      if (response.ok === true) {
        this.onSubmitSuccess(data.data.access_token)
      } else {
        this.onSubmitFailure(data.data.message || 'Username or password is invalid')
      }
    } catch (error) {
      console.error('Login error:', error);
      this.onSubmitFailure('Something went wrong. Please try again.');
    }
  };

  handleForgotPasswordClick = () => {
    this.setState({ redirectForgotPassword: true });
    console.log('Redirecting to Forgot Password page...');
  };

  handleSignUpClick = () => {
    this.setState({ redirectSignUp: true });
    console.log('Redirecting to Sign Up page...');
  };

  render() {
    const {
      email,
      password,
      error,
      errorMsg,
      loading,
      buttonsDisabled,
      redirectForgotPassword,
      redirectSignUp,
      redirectToHome,
    } = this.state;

    console.log('Redirect state:', redirectForgotPassword, redirectSignUp, redirectToHome);

    if (redirectForgotPassword) {
      return <Redirect to="/forgot-password" />;
    }

    if (redirectSignUp) {
      return <Redirect to="/sign-up" />;
    }

    if (redirectToHome) {
      return <Redirect to="/" />;
    }

    return (
      <div className="login-background">
        <div className="login-container">
          <h1>Login</h1>

          <form onSubmit={this.handleLoginSubmit}>
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
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={this.handleChange}
                required
                disabled={loading}
              />
            </div>
            <button type="submit" className="signin-btn" disabled={loading}>
              {loading ? <div className="spinner-login"></div> : 'Login'}
            </button>

            <div className="form-container">
              <button
                type="button"
                className="link-btn"
                onClick={this.handleForgotPasswordClick}
                disabled={buttonsDisabled}
              >
                Forgot Password?
              </button>
              <button
                type="button"
                className="link-btn"
                onClick={this.handleSignUpClick}
                disabled={buttonsDisabled}
              >
                Sign Up
              </button>
            </div>
          </form>

          {error && <p className="error">{errorMsg}</p>}
        </div>
      </div>
    );
  }
}

export default Login;
