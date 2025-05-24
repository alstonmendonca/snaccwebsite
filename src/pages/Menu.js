import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Divider,
} from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';

export default function Menu() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/fooditems')
      .then(res => setItems(res.data))
      .catch(err => console.error('Error fetching food items:', err));
  }, []);

  return (
    <Box sx={{ px: 4, py: 6, bgcolor: '#000', color: '#fff', minHeight: '100vh' }}>
      <Typography variant="h4" align="center" sx={{ mb: 4, fontWeight: 700 }}>
        Our Delicious Menu
      </Typography>

      <Grid container spacing={4}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
            <Card
              sx={{
                backgroundColor: '#111',
                color: '#fff',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(255,255,255,0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 240,
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {item.fname}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, color: '#ccc' }}>
                  ₹{item.cost} + ₹{item.tax} tax
                </Typography>
                <Chip
                  label={item.veg ? 'Veg' : 'Non-Veg'}
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: '#fff',
                    color: '#fff',
                    mb: 1,
                  }}
                />
                <Divider sx={{ my: 1, borderColor: '#333' }} />
                <Typography variant="caption" color="gray">
                  Category: {item.category}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button
                  variant="outlined"
                  sx={{
                    color: '#fff',
                    borderColor: '#fff',
                    '&:hover': {
                      backgroundColor: '#fff',
                      color: '#000',
                    },
                    borderRadius: 2,
                    textTransform: 'none',
                  }}
                  endIcon={<RestaurantMenuIcon />}
                >
                  Add to Cart
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
