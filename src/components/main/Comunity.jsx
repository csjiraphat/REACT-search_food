import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

const CommunityPageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
`;

const SharedPostCard = styled.div`
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
`;

const UserInfo = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin: 0 auto;
`;

const PostImage = styled.img`
  width: 450px;
  height: 450px;
  object-fit: cover;
  border-radius: 8px;
  margin: 0 auto;
`;

const CommunityPage = () => {
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

  const handleSharePost = async (shareId) => {
    // Implement your logic to share a post here
    // This function will be called when a user clicks on the "Share" button
    console.log("Sharing post with share ID:", shareId);
  };

  return (
    <CommunityPageContainer>
      <h2>Community</h2>
      {sharedPosts.map((post) => (
        <SharedPostCard key={post.share_id}>
          <UserInfo>{post.user.name}</UserInfo>
          <p>{post.food_recipe.name}</p>
          <PostImage src={post.food_recipe.img} alt={post.food_recipe.name} />
          <button onClick={() => handleSharePost(post.share_id)}>Share</button>
        </SharedPostCard>
      ))}
    </CommunityPageContainer>
  );
};

export default CommunityPage;
