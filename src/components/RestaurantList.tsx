import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Restaurant } from '../types';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
  restaurants: Restaurant[];
}

const RestaurantList: React.FC<Props> = ({ restaurants }) => {
  return (
    <div>
      <h2>Restaurant List</h2>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="restaurant table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Gerichte</TableCell>
              {/*<TableCell align="right">Bewertung</TableCell>*/}
              <TableCell align="right">Entfernung</TableCell>
              {/*<TableCell align="right">Öffnungszeiten</TableCell>*/}
              <TableCell align="right">Preis</TableCell>
              <TableCell>Ausprobiert</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {restaurants.map((restaurant, index) => (
              <TableRow
                key={index}
                sx={{
                  '&:hover': {
                    backgroundColor: '#f0f0f0',
                  },
                }}
              >
                <TableCell component="th" scope="row">
                  {restaurant.name}
                </TableCell>
                <TableCell>{restaurant.dishes}</TableCell>
                {/*<TableCell align="right">{restaurant.rating}</TableCell>*/}
                <TableCell align="right">{restaurant.distance}</TableCell>
                {/*<TableCell align="right">{restaurant.openingHours}</TableCell>*/}
                <TableCell align="right">{restaurant.price}</TableCell>
                <TableCell>{restaurant.tried ? <CheckIcon color="primary" /> : <CloseIcon color="error" />}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default RestaurantList;