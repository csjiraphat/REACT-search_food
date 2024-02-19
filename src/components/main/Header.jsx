import React, { useState } from "react";
import { Link } from "react-router-dom";

function Header() {
  // Check if user is authenticated based on the presence of userData in local storage
  const isAuthenticated = !!localStorage.getItem("userData");

  // Get user data from local storage
  const userData = JSON.parse(localStorage.getItem("userData")) || {};

  // State to track whether the dropdown menu should be visible
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  // Function to toggle the visibility of the dropdown menu
  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  return (
    <header className="py-2 mb-6 text-center bg-dark">
      <nav className="flex justify-between items-center">
        <div className="pl-2">
          <Link to="/">
            <h1 className="text-light">
              Food<span className="uppercase text-accent">Recips</span>
            </h1>
          </Link>
        </div>
        <ul className="flex">
          <li className="ml-auto pr-6">
            <Link to="/community" className="text-light">
              comunity
            </Link>
          </li>
          {isAuthenticated ? (
            <>
              <li className="ml-auto pr-6">
                <Link to="/add" className="text-light">
                  เพิ่ม
                </Link>
              </li>
              <li className="ml-auto pr-6">
                <span className="text-light" onClick={toggleDropdown}>
                  {userData.name}
                </span>
                {/* Dropdown menu for authenticated user */}
                {isDropdownVisible && (
                  <ul className="dropdown">
                    <li>
                      <Link to="/profile" className="text-light">
                        โปรไฟล์
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          // Handle logout logic (clear local storage, redirect, etc.)
                          localStorage.removeItem("userData");
                          window.location.href = "/login"; // Redirect to login page
                        }}
                        className="text-light"
                      >
                        ล็อคเอ้าท์
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            </>
          ) : (
            <>
              <li className="ml-auto pr-6">
                <Link to="/login" className="text-light">
                  ล็อคอิน
                </Link>
              </li>
              <li className="ml-auto pr-6">
                <Link to="/register" className="text-light">
                  สมัคร
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
