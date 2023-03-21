import Axios from 'axios';
import "./login.css"
import { useEffect } from 'react';

const Login = () => {
  // function to handle login
  const handleLogin = () => {
    // get the username and password
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // send a request to the server
    Axios.post('https://apitwitter.emilienpons.com/api/login', {
      username: username,
      password: password
    })
      .then(function (response) {
        // if the response is successful
        if (response.data.accessToken) {
          // store the token in local storage
          localStorage.setItem('user', JSON.stringify(response.data));
          // redirect to home page
          window.location.href = "/";
        } else {
          // if the response is unsuccessful
          alert(response.data.error);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

        // if login is successful, redirect to the main page
        // if (response.data) {
        //   const tokens = JSON.stringify(response.data);
        //   localStorage.setItem('jwt', tokens);
        //   // get username from /api/user given the token
        // } else {
        //   alert(response.data);
        // }

    // function to hide or show the password
    const handlePasswordVisibility = () => {
      const password = document.getElementById('password');
      const eye = document.getElementById('eye');
      if (password.type === 'password') {
        password.type = 'text';
        eye.classList.remove('fa-eye');
        eye.classList.add('fa-eye-slash');
      } else {
        password.type = 'password';
        eye.classList.remove('fa-eye-slash');
        eye.classList.add('fa-eye');
      }
    }

  useEffect(() => {
    // if the user is already logged in, redirect to the main page
    if (localStorage.getItem('user')) {
      window.location.href = "/";
    }
  })


  return (
    // make a login request to the server
    <div className="login">
      <div className="login-l">
        <div className="login-l-wrapper">
          <img src="https://i.imgur.com/p05pvOS.png" alt='auth background'></img>
          <i className="fa-brands fa-twitter" aria-hidden="true"></i>
        </div>
      </div>
      <div className="login-r">
        <div className="login-r-wrapper">
          <i className="fa-brands fa-twitter" aria-hidden="true"></i>
          <div className="login-container">
            <h1>Login</h1>
            <div className="login-form">
              <div className="login-form-input">
                <input type="text" id="username" placeholder="Username" />
              </div>
              <div className="login-form-input">
                <input type="password" id="password" placeholder="Password" />
                <i className="fa-solid fa-eye" id='eye' onClick={handlePasswordVisibility}></i>
              </div>
              <div className="login-form-button">
                <button onClick={handleLogin}>Login</button>
              </div>
            </div>
            <div className="link">
              <p>Not registered? <a href="/register"><span>Click here </span></a>to create an account</p>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default Login