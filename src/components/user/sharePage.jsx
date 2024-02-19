// SharePage.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/share.css"; // Import CSS file for styling

const SharePage = () => {
  const [sharedPosts, setSharedPosts] = useState([]);

  useEffect(() => {
    async function fetchSharedPosts() {
      try {
        const response = await axios.get(
          "http://localhost/api_food/api_shared_log.php"
        );
        setSharedPosts(response.data);
      } catch (error) {
        console.error("Error fetching shared posts:", error);
      }
    }

    fetchSharedPosts();
  }, []);

  return (
    <div className="SharedPosts">
      {Array.isArray(sharedPosts) && sharedPosts.length > 0 ? (
        sharedPosts.map((post) => (
          <div className="PostCard" key={post.share_id}>
            <div className="UserInfo">{post.user.name}</div>
            <Link to={`/meal/${post.food_recipe.id}`}>
              <img
                className="PostImage"
                src={post.food_recipe.img}
                alt={post.food_recipe.name}
              />
            </Link>
            <p>
              <Link
                to={`/meal/${post.food_recipe.id}`}
                style={{ textDecoration: "none", color: "#2196F3" }}
              >
                {post.food_recipe.name}
              </Link>
            </p>
          </div>
        ))
      ) : (
        <p>No shared posts found</p>
      )}
    </div>
  );
};

export default SharePage;
