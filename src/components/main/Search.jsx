import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import Category from "./Category";

const StyledSearch = styled.div`
  border: 1px solid black;
  background-color: white;
  width: 70%;
  text-align: center;
  padding: 16px;
  margin: 0 auto;

  h2 {
    font-size: 1.5rem;
    margin-bottom: 8px;
  }

  input {
    background-color: white;
    border: 1px solid black;
    width: 100%;
    padding: 8px 12px;
    margin-bottom: 8px;
  }

  .no-results {
    color: red;
  }

  .grid-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
`;

const CenteredCategory = styled.div`
  text-align: center;
  margin-top: 20px;
`;

const Search = () => {
  const [ingredients, setIngredients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(ingredients);
  const searchRef = useRef(null);
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    async function getIngredients() {
      try {
        const response = await axios.get(
          `http://localhost/api_food/api_food.php?search=${searchTerm.replace(
            "_",
            " "
          )}`
        );

        console.log("API Response:", response.data);

        const ingredients2 = response.data;

        if (!Array.isArray(ingredients2)) {
          console.error("Invalid data format. Expected an array.");
          return;
        }

        setIngredients(
          ingredients2.map((item) => {
            return {
              id: item.id,
              str: item.name,
              img: item.img,
              type: item.type,
              creator: {
                name: item.creator ? item.creator.name : "",
              },
            };
          })
        );

        setNoResults(ingredients2.length === 0);
      } catch (error) {
        console.error("Error fetching ingredients:", error);
      }
    }

    getIngredients();
  }, [searchTerm]);

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    const filtered =
      term === ""
        ? []
        : ingredients.filter((item) => {
            const lowerCaseTerm = term.toLowerCase();
            const isNameMatch = item.str.toLowerCase().includes(lowerCaseTerm);
            const isTypeMatch = item.type.toLowerCase().includes(lowerCaseTerm);
            const isCreatorMatch =
              item.creator?.name.toLowerCase().includes(lowerCaseTerm) || false;

            return isNameMatch || isTypeMatch || isCreatorMatch;
          });

    setFilteredData(filtered);
    setNoResults(filtered.length === 0);
  };

  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setFilteredData([]);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <StyledSearch ref={searchRef}>
        <h2>Search by Ingredient</h2>
        <input
          type="text"
          placeholder="ชื่ออาหาร,ชื่อประเภท,ชื่อผู้สร้าง..."
          value={searchTerm}
          onChange={handleSearch}
        />
        {noResults ? (
          <p className="no-results">ไม่พบข้อมูล...</p>
        ) : (
          filteredData.length > 0 && (
            <div className="grid-container">
              {filteredData.map((item) => (
                <div key={item.id} className="mb-4">
                  <Link to={`/Meal/${encodeURIComponent(item.id)}`}>
                    <img
                      src={item.img}
                      alt={item.str}
                      className="w-full h-32 object-cover mb-2"
                    />
                    <h3 className="text-lg font-semibold">
                      {item.str
                        .split(new RegExp(`(${searchTerm})`, "i"))
                        .map((part, index) =>
                          part.toLowerCase() === searchTerm.toLowerCase() ? (
                            <strong key={index}>{part}</strong>
                          ) : (
                            part
                          )
                        )}
                    </h3>
                    <p className="text-sm">
                      <strong>Type: </strong>
                      {item.type
                        .split(new RegExp(`(${searchTerm})`, "i"))
                        .map((part, index) =>
                          part.toLowerCase() === searchTerm.toLowerCase() ? (
                            <strong key={index}>{part}</strong>
                          ) : (
                            part
                          )
                        )}
                    </p>
                    <p className="text-sm">
                      <strong>Creator: </strong>
                      {item.creator?.name
                        .split(new RegExp(`(${searchTerm})`, "i"))
                        .map((part, index) =>
                          part.toLowerCase() === searchTerm.toLowerCase() ? (
                            <strong key={index}>{part}</strong>
                          ) : (
                            part
                          )
                        )}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          )
        )}
      </StyledSearch>
      <CenteredCategory>
        <Category />
      </CenteredCategory>
      <br />
    </>
  );
};
export default Search;
