import React from 'react'
import "./register.css"
import Axios from 'axios'
import { useEffect } from 'react'

const Register = () => {
  //function to handle register

  const handleRegister = () => {
    //get the username and password
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // check if usrname and password are valid
    if (username.length < 3 || username.length > 20) {
      alert('Username must be at least 3 characters long and less than 20 characters long');
      return;
    } else if (/[^a-zA-Z0-9]/.test(username)) {
      alert('Username must contain only letters and numbers. Spaces are not allowed.');
      return;
    } else if (password.length < 7) {
      alert('Password must be at least 7 characters long');
      return;
    } // check if password contains at least one number, one uppercase letter, and one lowercase letter, and at least one special character
    else if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[^a-zA-Z0-9]/.test(password)) {
      alert('Password must contain at least one number, one uppercase letter, one lowercase letter, and at least one special character');
    } else {
      Axios.post('https://apitwitter.emilienpons.com/api/register', {
        username: username,
        password: password,
        userpp: 'http://media.idownloadblog.com/wp-content/uploads/2017/03/Twitter-new-2017-avatar-001.png'
      }).then((response) => {
          //if register is successful
          if (response.data.accessToken) {
            //set the user in the local storage
            const jsonUser = JSON.stringify(response.data);
            localStorage.setItem('user', jsonUser);

            //redirect the user to the profile page
            window.location.href = '/';
          } else {
            //if not successful, return an error to the user
            alert('Username already exists');
          }
        })
        .catch(function (error) {
          const jsonUser = localStorage.getItem('user');
          console.log(jsonUser);
        });
    }
  }

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
            <h1>Create an account</h1>
            <div className="login-form">
              <div className="login-form-input">
                <input type="text" id="username" placeholder="Username" />
              </div>
              <div className="login-form-input">
                <input type="password" id="password" placeholder="Password" />
                <i className="fa-solid fa-eye" id='eye' onClick={handlePasswordVisibility}></i>
              </div>
              <div className="login-form-button">
                <button onClick={handleRegister}>Register</button>
              </div>
            </div>
            <div className="link">
              <p>Already registered? <a href="/login"><span>Click here </span></a>to login</p>
            </div>
          </div>
        </div>
      </div>
      </div>
  )
}

export default Register