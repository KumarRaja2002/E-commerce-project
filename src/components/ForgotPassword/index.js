import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'; // For React Router v5
import '../ForgotPassword/index.css';

class ForgotPassword extends Component {
  state = {
    email: '',
    otp: '',
    newPassword: '',
    error: false,
    errorMsg: '',
    loading: false,
    resetPassword: false,
    loadingResetPassword: false,
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleForgotPasswordSubmit = async (event) => {
    event.preventDefault();
    const { email } = this.state;

    this.setState({ loading: true });

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/users/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        this.setState({
          error: false,
          errorMsg: '',
          resetPassword: true,
          loading: false,
        });
      } else {
        const data = await response.json();
        this.setState({ error: true, errorMsg: data.error, loading: false });
      }
    } catch {
      this.setState({ error: true, errorMsg: 'Something went wrong. Please try again.', loading: false });
    }
  };

  handleResetPasswordSubmit = async (event) => {
    event.preventDefault();
    const { email, otp, newPassword } = this.state;

    this.setState({ loadingResetPassword: true });

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/users/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      if (response.ok) {
        this.setState({ error: false, errorMsg: '', loadingResetPassword: false });
        this.redirectTo('/login'); // Redirect after reset
      } else {
        const data = await response.json();
        this.setState({ error: true, errorMsg: 'Wrong OTP entered.', loadingResetPassword: false });
      }
    } catch {
      this.setState({
        error: true,
        errorMsg: 'Something went wrong. Please try again.',
        loadingResetPassword: false,
      });
    }
  };

  redirectTo = (path) => {
    this.props.history.push(path); // React Router v5 method
  };

  render() {
    const { email, otp, newPassword, error, errorMsg, loading, resetPassword, loadingResetPassword } = this.state;

    return (
      <div className="forgot-password-background">
        <form
          onSubmit={resetPassword ? this.handleResetPasswordSubmit : this.handleForgotPasswordSubmit}
          className="form"
        >
          <h2>{resetPassword ? 'Reset Password' : 'Forgot Password'}</h2>

          {!resetPassword && (
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
          )}

          {resetPassword && (
            <>
              <div className="form-group">
                <label>OTP:</label>
                <input
                  type="text"
                  name="otp"
                  value={otp}
                  onChange={this.handleChange}
                  required
                  disabled={loadingResetPassword}
                />
              </div>
              <div className="form-group">
                <label>New Password:</label>
                <input
                  type="password"
                  name="newPassword"
                  value={newPassword}
                  onChange={this.handleChange}
                  required
                  disabled={loadingResetPassword}
                />
              </div>
            </>
          )}
          <div className="button-container">
            <button type="submit" className="forgot-btn" disabled={loading || loadingResetPassword}>
              {loading || loadingResetPassword ? (
                <div className="spinner"></div>
              ) : resetPassword ? (
                'Reset Password'
              ) : (
                'Send OTP'
              )}
            </button>
            <button
              type="button"
              className="login-btn"
              onClick={() => this.redirectTo('/login')}
              disabled={loading || loadingResetPassword}
            >
              Back to Login
            </button>
          </div>
          {error && <p className="error">{errorMsg}</p>}
        </form>
      </div>
    );
  }
}

export default withRouter(ForgotPassword);
