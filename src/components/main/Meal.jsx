import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import { FaThumbsUp, FaShare } from "react-icons/fa";

const ActionButton = styled.button`
  padding: 10px 15px;
  margin: 5px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #45a049;
  }
`;

const DeleteButton = styled.button`
  padding: 10px 15px;
  margin: 5px;
  background-color: #ff3333;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #e60000;
  }
`;

const StyledImage = styled.img`
  width: 450px;
  height: 450px;
  object-fit: cover;
  border-radius: 8px;
`;

const StyledMealDetails = styled.div`
  text-align: left;
  margin-top: 20px;
  margin-left: auto;
  max-width: 600px;
`;

const StyledCreatorInfo = styled.div`
  margin-top: 10px;
`;

function Meal() {
  const { id } = useParams();
  const [meal, setMeal] = useState({});
  const [isUserAuthorized, setIsUserAuthorized] = useState(false);

  useEffect(() => {
    async function getMealById() {
      try {
        const response = await axios.get(
          `http://localhost/api_food/api_food.php?id=${id}`
        );

        console.log("API Response:", response.data);

        const _meal = response.data.find((item) => item.id === id);
        if (!_meal) {
          console.error("Meal not found");
          return;
        }

        const ingredients = _meal.Ingredient.split(",");

        setMeal({
          id: _meal.id,
          str: _meal.name,
          image: _meal.img,
          ingredients: ingredients,
          user_id: _meal.user_id,
          type: _meal.type,
          creator: {
            name: _meal.creator ? _meal.creator.name : "",
          },
        });

        const storedUserData = localStorage.getItem("userData");
        const isAuthenticated = storedUserData ? true : false;
        const loggedInUserId = isAuthenticated
          ? JSON.parse(storedUserData).user_id
          : null;

        if (
          isAuthenticated &&
          parseInt(loggedInUserId) === parseInt(_meal.user_id)
        ) {
          setIsUserAuthorized(true);
        }
      } catch (error) {
        console.error("Error fetching meal:", error);
      }
    }

    getMealById();
  }, [id]);

  const handleDelete = async () => {
    if (!isUserAuthorized) {
      console.error("User is not authorized to delete this meal");
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost/api_food/api_food.php?id=${id}`
      );

      console.log("Delete Response:", response.data);

      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting meal:", error);
    }
  };

  const handleShare = async () => {
    try {
      const storedUserData = localStorage.getItem("userData");
      const isAuthenticated = storedUserData ? true : false;
      const loggedInUserId = isAuthenticated
        ? JSON.parse(storedUserData).user_id
        : null;

      if (!isAuthenticated) {
        console.error("User is not authenticated");
        return;
      }

      const response = await axios.post(
        "http://localhost/api_food/api_shared_log.php",
        {
          user_id: loggedInUserId,
          food_recipe_id: meal.id,
        }
      );

      console.log("Share Response:", response.data);

      // Handle success message or redirect if needed
    } catch (error) {
      console.error("Error sharing meal:", error);
    }
  };

  return (
    <div className="text-lg">
      <Link to="/">
        <ActionButton>Back</ActionButton>
      </Link>
      <StyledMealDetails>
        <h1>{meal.str}</h1>
        <StyledImage src={meal.image} alt={meal.str} />
        <h2>Ingredients</h2>
        <ul className="list-disc list-inside">
          {meal.ingredients?.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
        <StyledCreatorInfo>
          <p>
            <strong>Type: </strong>
            {meal.type}
          </p>
        </StyledCreatorInfo>

        {meal.creator && (
          <StyledCreatorInfo>
            <p>
              <strong>Created by: </strong>
              {meal.creator.name}
            </p>
          </StyledCreatorInfo>
        )}

        {isUserAuthorized && (
          <>
            <Link to={`/edit/${id}`}>
              <ActionButton>Edit Meal</ActionButton>
            </Link>
            <DeleteButton onClick={handleDelete}>Delete Meal</DeleteButton>
          </>
        )}

        <ActionButton onClick={handleShare}>
          <FaShare />
        </ActionButton>
      </StyledMealDetails>
    </div>
  );
}

export default Meal;
