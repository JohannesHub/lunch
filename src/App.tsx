import React, { useState, useEffect } from 'react';
import RestaurantList from './components/RestaurantList';
import { Restaurant } from './types';
import restaurantData from './data/restaurants.json';

const App: React.FC = () => {
  const [filterByDish, setFilterByDish] = useState<string | null>(null);
  const [dishOptions, setDishOptions] = useState<string[]>([]);

  useEffect(() => {
    const uniqueDishes = Array.from(
      new Set(restaurantData.flatMap((restaurant) => restaurant.dishes.split(', ')))
    );
    setDishOptions(uniqueDishes);
  }, []);

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDish = event.target.value;
    setFilterByDish(selectedDish !== 'all' ? selectedDish : null);
  };

  const filteredRestaurants = filterByDish
    ? restaurantData.filter((restaurant) => restaurant.dishes.includes(filterByDish))
    : restaurantData;

  return (
    <div>
      <h1>Restaurant Finder</h1>
      <div>
        <label htmlFor="dishFilter">Filter by Dish:</label>
        <select id="dishFilter" onChange={handleFilterChange}>
          <option value="all">All</option>
          {dishOptions.map((dish, index) => (
            <option key={index} value={dish}>
              {dish}
            </option>
          ))}
        </select>
      </div>
      <RestaurantList restaurants={filteredRestaurants} />
    </div>
  );
};

export default App;
