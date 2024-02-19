import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

const EditMealContainer = styled.div`
  margin: auto;
`;

const EditMealFormContainer = styled.div`
  display: flex;
`;

const EditMealForm = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  flex: 1;
`;

const InputField = styled.input`
  margin-bottom: 15px;
  padding: 10px;
  font-size: 16px;
`;

const ImageContainer = styled.div`
  margin-left: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  width: 350px;
  height: 350px;
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const ActionButton = styled.button`
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

const EditMeal = () => {
  const storedUserData = localStorage.getItem("userData");
  const userData = storedUserData ? JSON.parse(storedUserData) : null;
  const { id } = useParams();
  const navigate = useNavigate();
  const [meal, setMeal] = useState({
    id: "",
    user_id: "",
    name: "",
    Ingredient: "",
    img: "",
    type: "",
    cuisine: "",
  });

  useEffect(() => {
    if (!userData) {
      navigate("/login");
      return;
    }
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

        setMeal({
          id: _meal.id,
          user_id: _meal.user_id,
          name: _meal.name,
          Ingredient: _meal.Ingredient,
          img: _meal.img,
          type: _meal.type,
          cuisine: _meal.cuisine,
        });
      } catch (error) {
        console.error("Error fetching meal:", error);
      }
    }

    getMealById();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMeal((prevMeal) => ({ ...prevMeal, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `http://localhost/api_food/api_food.php?id=${id}`,
        meal
      );

      console.log("Update Response:", response.data);

      navigate(`/meal/${id}`);
    } catch (error) {
      console.error("Error updating meal:", error);
    }
  };

  return (
    <EditMealContainer>
      <h2>Edit Meal</h2>

      <EditMealFormContainer>
        <EditMealForm onSubmit={handleSubmit}>
          <InputField
            type="text"
            name="name"
            placeholder="Name"
            value={meal.name}
            onChange={handleInputChange}
            required
          />
          <InputField
            type="text"
            name="Ingredient"
            placeholder="Ingredients"
            value={meal.Ingredient}
            onChange={handleInputChange}
            required
          />
          <InputField
            type="text"
            name="img"
            placeholder="Image URL"
            value={meal.img}
            onChange={handleInputChange}
            required
          />
          <InputField
            type="text"
            name="type"
            placeholder="Type"
            value={meal.type}
            onChange={handleInputChange}
            required
          />
          <InputField
            type="text"
            name="cuisine"
            placeholder="Cuisine"
            value={meal.cuisine}
            onChange={handleInputChange}
            required
          />
          <ActionButton type="submit">Save Changes</ActionButton>
        </EditMealForm>

        <ImageContainer>
          {meal.img && <Image src={meal.img} alt="Meal Preview" />}
        </ImageContainer>
      </EditMealFormContainer>
    </EditMealContainer>
  );
};

export default EditMeal;
