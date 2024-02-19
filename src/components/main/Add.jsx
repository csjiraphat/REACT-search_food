import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

const AddRecipeContainer = styled.div`
  margin: auto;
`;

const AddRecipeFormContainer = styled.div`
  display: flex;
`;

const AddRecipeForm = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  flex: 1; /* Make the form expand to fill the remaining space */
`;

const InputField = styled.input`
  margin-bottom: 15px;
  padding: 10px;
  font-size: 16px;
`;

const TextAreaField = styled.textarea`
  margin-bottom: 15px;
  padding: 10px;
  font-size: 16px;
`;

const SubmitButton = styled.button`
  padding: 15px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 18px;

  &:hover {
    background-color: #45a049;
  }
`;

const Notification = styled.div`
  margin-top: 20px;
  padding: 10px;
  background-color: #dff0d8;
  color: #3c763d;
  border: 1px solid #d6e9c6;
  border-radius: 5px;
`;

const ImageContainer = styled.div`
  margin-left: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  width: 350px; /* กำหนดความกว้างของกรอบ */
  height: 350px; /* กำหนดความสูงของกรอบ */
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain; /* ให้รูปภาพทำการ fit ในกรอบ */
`;

const AddRecipe = () => {
  const [formData, setFormData] = useState({
    name: "",
    Ingredient: "",
    img: "",
    type: "",
    cuisine: "",
  });

  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    const loggedInUserId = storedUserData
      ? JSON.parse(storedUserData).user_id
      : "";

    if (!loggedInUserId) {
      console.log("User not logged in. Redirecting to /login");
      window.location.href = "/login";
    }

    setFormData({ ...formData, user_id: loggedInUserId });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const storedUserData = localStorage.getItem("userData");
      const loggedInUserId = storedUserData
        ? JSON.parse(storedUserData).user_id
        : "";

      if (!loggedInUserId) {
        setNotification("กรุณาเข้าสู่ระบบเพื่อเพิ่มสูตรอาหาร");

        setTimeout(() => {
          setNotification(null);
          window.location.href = "/login";
        }, 3000);

        return;
      }

      const idResponse = await axios.get(
        "http://localhost/api_food/api_food.php?id=getLatestId"
      );

      const latestId = parseInt(idResponse.data.latestId);
      const nextId = (latestId + 1).toString().padStart(10, "0");

      setFormData({ ...formData, id: nextId, user_id: loggedInUserId });

      const response = await axios.post(
        "http://localhost/api_food/api_food.php",
        formData
      );

      console.log(response.data);

      setNotification("เพิ่มสูตรอาหารเรียบร้อยแล้ว");

      setFormData({
        name: "",
        Ingredient: "",
        img: "",
        type: "",
        cuisine: "",
      });

      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการส่งข้อมูล:", error);
    }
  };

  return (
    <AddRecipeContainer>
      <h2>เพิ่มสูตรอาหาร</h2>

      {notification && <Notification>{notification}</Notification>}

      <AddRecipeFormContainer>
        <AddRecipeForm onSubmit={handleSubmit}>
          <InputField
            type="text"
            name="name"
            placeholder="ชื่อ"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <TextAreaField
            id="Ingredient"
            name="Ingredient"
            placeholder="ส่วนผสม"
            value={formData.Ingredient}
            onChange={handleChange}
            required
          />

          <InputField
            type="text"
            name="img"
            placeholder="URL รูปภาพ"
            value={formData.img}
            onChange={handleChange}
            required
          />

          <InputField
            type="text"
            name="type"
            placeholder="ประเภท"
            value={formData.type}
            onChange={handleChange}
            required
          />

          <InputField
            type="text"
            name="cuisine"
            placeholder="อาหารประจำชาติ"
            value={formData.cuisine}
            onChange={handleChange}
            required
          />

          <SubmitButton type="submit">เพิ่มสูตรอาหาร</SubmitButton>
        </AddRecipeForm>

        <ImageContainer>
          {formData.img && <Image src={formData.img} alt="สูตรอาหาร" />}
        </ImageContainer>
      </AddRecipeFormContainer>
    </AddRecipeContainer>
  );
};

export default AddRecipe;
