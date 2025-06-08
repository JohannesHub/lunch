import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Card, CardContent, Grid, Rating, Chip, ToggleButtonGroup, ToggleButton, FormControlLabel, Switch } from '@mui/material';
import restaurants from './data/restaurants.json';
import { Restaurant } from './types';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function App() {
  const [selectedDay, setSelectedDay] = useState<string>(() => {
    // Convert current time to Berlin time
    const berlinTime = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Berlin' }));
    const today = berlinTime.getDay();
    // getDay() returns 0 for Sunday, 1 for Monday, etc.
    return DAYS[today === 0 ? 6 : today - 1];
  });
  const [showOnlyOpen, setShowOnlyOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [fastMealsFilter, setFastMealsFilter] = useState(false);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const isRestaurantOpen = (restaurant: Restaurant) => {
    const daySchedule = restaurant.openingHours.find(hours => hours.day === selectedDay);
    if (!daySchedule) return false;

    // Convert current time to Berlin time
    const berlinTime = new Date(currentTime.toLocaleString('en-US', { timeZone: 'Europe/Berlin' }));
    const currentHour = berlinTime.getHours();
    const currentMinute = berlinTime.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    // Parse opening hours (assuming 12-hour format with AM/PM)
    const parseTime = (timeStr: string) => {
      const [time, period] = timeStr.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      let totalMinutes = hours * 60 + minutes;
      if (period === 'PM' && hours !== 12) totalMinutes += 12 * 60;
      if (period === 'AM' && hours === 12) totalMinutes -= 12 * 60;
      return totalMinutes;
    };

    const openTimeInMinutes = parseTime(daySchedule.open);
    const closeTimeInMinutes = parseTime(daySchedule.close);

    return currentTimeInMinutes >= openTimeInMinutes && currentTimeInMinutes <= closeTimeInMinutes;
  };

  const filteredRestaurants = restaurants.filter(restaurant => {
    const isOpen = isRestaurantOpen(restaurant);
    const isFast = !fastMealsFilter || (restaurant.isFast && parseFloat(restaurant.distance) <= 0.7);
    return (!showOnlyOpen || isOpen) && isFast;
  });

  const handleDayChange = (event: React.MouseEvent<HTMLElement>, newDay: string) => {
    if (newDay !== null) {
      setSelectedDay(newDay);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Lunch Options
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <ToggleButtonGroup
            value={selectedDay}
            exclusive
            onChange={handleDayChange}
            aria-label="day selection"
          >
            {DAYS.map((day) => (
              <ToggleButton key={day} value={day}>
                {day}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={showOnlyOpen}
                onChange={(e) => setShowOnlyOpen(e.target.checked)}
              />
            }
            label="Show only open restaurants"
          />
          <FormControlLabel
            control={
              <Switch
                checked={fastMealsFilter}
                onChange={(e) => setFastMealsFilter(e.target.checked)}
              />
            }
            label="Was Schnelles (≤ 700m)"
          />
        </Box>

        <Grid container spacing={3}>
          {filteredRestaurants.map((restaurant) => (
            <Grid item xs={12} sm={6} md={4} key={restaurant.name}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    {restaurant.name}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {restaurant.dishes}
                  </Typography>
                  {restaurant.rating && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating value={restaurant.rating} precision={0.5} readOnly />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        ({restaurant.rating})
                      </Typography>
                    </Box>
                  )}
                  <Typography variant="body2" color="textSecondary">
                    Distance: {restaurant.distance}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Price: {restaurant.price}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {restaurant.tried && (
                      <Chip label="Tried" color="primary" size="small" sx={{ mr: 1 }} />
                    )}
                    {restaurant.isFast && (
                      <Chip label="Fast" color="secondary" size="small" />
                    )}
                  </Box>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    Today's Hours: {restaurant.openingHours.find(hours => hours.day === selectedDay)?.open} - {restaurant.openingHours.find(hours => hours.day === selectedDay)?.close}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}

export default App;
