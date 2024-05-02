import React, { useState, useEffect } from 'react';
import RestaurantList from './components/RestaurantList';
import { Restaurant } from './types';
import restaurantData from './data/restaurants.json';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const App: React.FC = () => {
  const [selectedDishes, setSelectedDishes] = useState<string[]>([]);
  const [maxDistance, setMaxDistance] = useState<number | null>(null);
  const [triedFilter, setTriedFilter] = useState<boolean | null>(null);
  const [dishOptions, setDishOptions] = useState<string[]>([]);

  useEffect(() => {
    const uniqueDishes = Array.from(
      new Set(restaurantData.flatMap((restaurant) => restaurant.dishes.toLowerCase().split(', ')))
    );
    setDishOptions(uniqueDishes);
  }, []);

  const handleDishChange = (event: React.MouseEvent<HTMLElement>, newDishes: string[]) => {
    setSelectedDishes(newDishes);
  };

  const handleDistanceChange = (event: Event, value: number | number[]) => {
    if (Array.isArray(value)) {
      setMaxDistance(value[0]);
    } else {
      setMaxDistance(value);
    }
  };

  const handleTriedFilterChange = (event: React.MouseEvent<HTMLElement>, newValue: boolean | null) => {
    setTriedFilter(newValue);
  };

  const filteredRestaurants = restaurantData.filter((restaurant) => {
    if (selectedDishes.length > 0) {
      if (!selectedDishes.some((dish) => restaurant.dishes.toLowerCase().includes(dish.toLowerCase()))) {
        return false;
      }
    }
    if (maxDistance && parseFloat(restaurant.distance) > maxDistance) {
      return false;
    }
    if (triedFilter !== null && restaurant.tried !== triedFilter) {
      return false;
    }
    return true;
  });

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#3f51b5' }}>Restaurant Finder</h1>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginBottom: 2 }}>
        <ToggleButtonGroup value={selectedDishes} onChange={handleDishChange}>
          {dishOptions.map((dish, index) => (
            <ToggleButton
              key={index}
              value={dish}
              aria-label={dish}
              style={{
                backgroundColor: selectedDishes.includes(dish) ? '#3f51b5' : '#fff',
                color: selectedDishes.includes(dish) ? '#fff' : '#3f51b5'
              }}
            >
              {dish}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>
      <div style={{ width: '300px', margin: '20px auto' }}>
        <Typography id="distance-slider" gutterBottom style={{ color: '#3f51b5' }}>
          Filter by Distance (up to {maxDistance ? maxDistance.toFixed(1) : '2.0'} km)
        </Typography>
        <Slider
          value={maxDistance || 0}
          onChange={handleDistanceChange}
          min={0}
          max={2}
          step={0.1}
          aria-labelledby="distance-slider"
        />
      </div>
      <div>
        <ToggleButtonGroup
          value={triedFilter}
          exclusive
          onChange={handleTriedFilterChange}
          aria-label="tried filter"
        >
          <ToggleButton
            value={true}
            style={{
              backgroundColor: triedFilter === true ? '#3f51b5' : '#fff',
              color: triedFilter === true ? '#fff' : '#3f51b5'
            }}
          >
            Ausprobiert
          </ToggleButton>
          <ToggleButton
            value={false}
            style={{
              backgroundColor: triedFilter === false ? '#3f51b5' : '#fff',
              color: triedFilter === false ? '#fff' : '#3f51b5'
            }}
          >
            Nicht ausprobiert
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
      <RestaurantList restaurants={filteredRestaurants} />
    </div>
  );
};

export default App;
