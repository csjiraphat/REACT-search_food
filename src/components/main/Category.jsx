import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { Link } from "react-router-dom";

const StyledCategory = styled.div`
  background-color: white;
  padding: 20px;
  border: 1px solid black;
  margin: 0 auto; // Center the content horizontally
  max-width: 1200px;
  text-align: center;
`;

const Category = () => {
  const [randomMeals, setRandomMeals] = useState([]);

  useEffect(() => {
    async function getRandomMeals() {
      try {
        const response = await axios.get(
          "http://localhost/api_food/api_food.php"
        );

        if (Array.isArray(response.data)) {
          // Check if response data is an array
          // Shuffle the array randomly
          const shuffledMeals = response.data.sort(() => Math.random() - 0.5);

          // Take the first 9 items
          const selectedMeals = shuffledMeals.slice(0, 9);

          setRandomMeals(selectedMeals);
        } else {
          console.error("Invalid data format. Expected an array.");
        }
      } catch (error) {
        console.error("Error fetching random meals:", error);
      }
    }

    getRandomMeals();
  }, []);

  return (
    <StyledCategory>
      <h2>Random Meals</h2>
      <div className="grid grid-cols-3 gap-4">
        {randomMeals.map((meal) => (
          <div key={meal.id} className="mb-4">
            <Link to={`/meal/${meal.id}`}>
              <div className="border rounded overflow-hidden">
                <img
                  src={meal.img}
                  alt={meal.name}
                  className="w-full h-32 object-cover mb-2"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{meal.name}</h3>
                  <p className="text-sm">Type: {meal.type}</p>
                  {/* Display creator information */}
                  <p className="text-sm">Created by: {meal.creator.name}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </StyledCategory>
  );
};

export default Category;
