// RegisterForm.jsx

import React, { useState } from "react";
import axios from "axios";
import "./css/Register.css"; // Import CSS file for styling

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost/api_food/api_user_regis.php",
        new URLSearchParams(formData),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      console.log(response.data);

      setSuccessMessage("User registered successfully");
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      setRedirectToLogin(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="RegisterFormContainer">
      {successMessage && <div className="SuccessMessage">{successMessage}</div>}
      <form className="RegisterFormA" onSubmit={handleSubmit}>
        <input
          className="InputField"
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          className="InputField"
          type="text"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          className="InputField"
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <button className="RegisterButton" type="submit">
          Register
        </button>
        <p className="LonginLink">
          You have an account? <a href="/login">Login here</a>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
