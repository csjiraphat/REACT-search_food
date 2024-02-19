// LoginForm.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Login.css"; // Import CSS file for styling

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(
        "http://localhost/api_food/api_user_login.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `email=${email}&password=${password}`,
        }
      );

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      alert(data.message);

      // If login is successful, store user data in local storage
      if (data.status === "success") {
        const userData = data.user;

        // Save user data in local storage
        localStorage.setItem("userData", JSON.stringify(userData));

        // Redirect to the home page and refresh the screen
        navigate("/");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error:", error.message);
      alert("An error occurred during login");
    }
  };

  return (
    <div className="LoginFormContainer">
      <h2>Login Form</h2>
      <form className="LoginFormA">
        <input
          className="InputField"
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
          required
        />
        <input
          className="InputField"
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          required
        />
        <button className="LoginButton" type="button" onClick={handleLogin}>
          Login
        </button>
        <p className="RegisterLink">
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
