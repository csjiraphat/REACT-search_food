// Profile.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./css/Profile.css"; // Import CSS file for styling
import styled from "styled-components";

const Profile = () => {
  const storedUserData = localStorage.getItem("userData");
  const userData = storedUserData ? JSON.parse(storedUserData) : null;
  const [userFoods, setUserFoods] = useState([]);
  const [sharedPosts, setSharedPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) {
      navigate("/login");
      return;
    }

    async function fetchData() {
      try {
        const [userFoodsResponse, sharedPostsResponse] = await Promise.all([
          axios.get(
            `http://localhost/api_food/api_food.php?user_id=${userData.user_id}`
          ),
          axios.get(
            `http://localhost/api_food/api_shared_log.php?user_id=${userData.user_id}`
          ),
        ]);
        setUserFoods(userFoodsResponse.data);
        setSharedPosts(sharedPostsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [userData, navigate]);

  if (!userData) {
    return null;
  }

  const userCreatedFoods = userFoods.filter(
    (food) => food.user_id === userData.user_id
  );

  const deleteSharedPost = async (share_id) => {
    try {
      await axios.delete(
        `http://localhost/api_food/api_shared_log.php?share_id=${share_id}`
      );
      const updatedSharedPosts = sharedPosts.filter(
        (post) => post.share_id !== share_id
      );
      setSharedPosts(updatedSharedPosts);
    } catch (error) {
      console.error("Error deleting shared post:", error);
    }
  };

  return (
    <div className="Profile">
      <h2 style={{ color: "#4CAF50" }}>Profile Data: {userData.name}</h2>
      <p>
        <strong>ชื่อ:</strong> {userData.name}
      </p>
      <p>
        <strong>อีเมล:</strong> {userData.email}
      </p>

      <h3 style={{ color: "#4CAF50", marginTop: "20px" }}>
        อาหารที่ถูกสร้างโดยคุณ
      </h3>
      <ul style={{ listStyleType: "none", padding: "0" }}>
        {userCreatedFoods.map((food) => (
          <li
            key={food.id}
            style={{
              borderBottom: "1px solid #ddd",
              padding: "10px 0",
              marginBottom: "10px",
            }}
          >
            <Link
              to={`/meal/${food.id}`}
              style={{ textDecoration: "none", color: "#2196F3" }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                {food.img && (
                  <img
                    src={food.img}
                    alt={food.name}
                    style={{
                      width: "50px",
                      height: "50px",
                      marginRight: "10px",
                    }}
                  />
                )}
                {food.name}
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <h3>โพสต์ที่คุณแชร์</h3>
      <div className="PostGrid">
        {sharedPosts.map((post) => (
          <div className="PostCard" key={post.share_id}>
            {post.user && post.user.name && (
              <div className="UserInfo">โพสต์โดย: {post.user.name}</div>
            )}
            {post.food_recipe && (
              <Link to={`/meal/${post.food_recipe.id}`}>
                {post.food_recipe.name}
              </Link>
            )}
            {post.food_recipe && post.food_recipe.img && (
              <img
                className="PostImage"
                src={post.food_recipe.img}
                alt={post.food_recipe.name}
              />
            )}
            <button
              className="DeleteButton"
              onClick={() => deleteSharedPost(post.share_id)}
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
