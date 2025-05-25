import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Typography, List, ListItem, Divider, CircularProgress,
  Button, TextField
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get('/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
        setEditedUser(res.data);
      } catch (err) {
        setError('Failed to load profile');
        if (err.response?.status === 401) {
          navigate('/signin');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setEditedUser(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      const { name, mobile, dob, address } = editedUser;
      const res = await axios.put(
        '/users/profile',
        { name, mobile, dob, address },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data);
      setEditedUser(res.data);
      setEditMode(false);
    } catch (err) {
      console.error(err);
      alert('Update failed');
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', mt: 8, color: 'red' }}>
        <Typography>{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5, p: 4, backgroundColor: '#111', borderRadius: 3, color: '#fff' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Profile
      </Typography>
      <List>
        <ListItem>
          <strong>Name: </strong>&nbsp;
          {editMode ? (
            <TextField
              variant="standard"
              name="name"
              value={editedUser.name || ''}
              onChange={handleChange}
              fullWidth
              sx={{ input: { color: '#fff' } }}
            />
          ) : user.name}
        </ListItem>
        <Divider sx={{ backgroundColor: '#444' }} />
        <ListItem>
          <strong>Email: </strong>&nbsp;{user.email}
        </ListItem>
        <Divider sx={{ backgroundColor: '#444' }} />
        <ListItem>
          <strong>Mobile: </strong>&nbsp;
          {editMode ? (
            <TextField
              variant="standard"
              name="mobile"
              value={editedUser.mobile || ''}
              onChange={handleChange}
              fullWidth
              sx={{ input: { color: '#fff' } }}
            />
          ) : user.mobile}
        </ListItem>
        <Divider sx={{ backgroundColor: '#444' }} />
        <ListItem>
          <strong>Date of Birth: </strong>&nbsp;
          {editMode ? (
            <TextField
              variant="standard"
              name="dob"
              type="date"
              value={editedUser.dob ? editedUser.dob.slice(0, 10) : ''}
              onChange={handleChange}
              fullWidth
              sx={{ input: { color: '#fff' } }}
            />
          ) : user.dob ? new Date(user.dob).toDateString() : 'Not provided'}
        </ListItem>
        <Divider sx={{ backgroundColor: '#444' }} />
        <ListItem>
          <strong>Address: </strong>&nbsp;
          {editMode ? (
            <TextField
              variant="standard"
              name="address"
              value={editedUser.address || ''}
              onChange={handleChange}
              fullWidth
              sx={{ input: { color: '#fff' } }}
            />
          ) : user.address || 'Not provided'}
        </ListItem>
        <Divider sx={{ backgroundColor: '#444' }} />
        <ListItem>
          <Box>
            <strong>Orders:</strong>
            {user.orders && user.orders.length > 0 ? (
              <List dense>
                {user.orders.map((order, index) => (
                  <ListItem key={index} sx={{ ml: 2 }}>
                    Order #{order.order_id} — {order.order_items?.length || 0} item(s) —{' '}
                    {order.completed ? '✅ Completed' : '⌛ Pending'}
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography sx={{ ml: 2, mt: 1 }}>No orders yet</Typography>
            )}
          </Box>
        </ListItem>
      </List>

      <Box sx={{ mt: 4 }}>
        {editMode ? (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              sx={{ mr: 2 }}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setEditedUser(user);
                setEditMode(false);
              }}
              sx={{ color: '#fff', borderColor: '#fff' }}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button
            variant="outlined"
            onClick={() => setEditMode(true)}
            sx={{ color: '#fff', borderColor: '#fff' }}
          >
            Edit Profile
          </Button>
        )}
      </Box>
    </Box>
  );
}
