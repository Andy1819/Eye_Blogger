import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const Backend_url = 'https://eye-blogger-backend.vercel.app/';
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${Backend_url}api/auth/login`, formData, { withCredentials: true });
      toast.success(response.data.message);
      console.log(response.data.message);
      if(response.data.role === 'admin') {
        navigate(`/admin`)
      }
      else if(response.data.role === 'editor') {
        navigate(`/${response.data.id}/editor`)
      }
      else if(response.data.role === 'viewer') {
        navigate(`/${response.data.id}/viewer`)
      }
    } catch (error) {
      toast.error(error.response?.data || 'Login failed');
    }
  };

  return (
    <Box sx={{ width: '300px', margin: '50px auto', textAlign: 'center' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <TextField label="Email" name="email" fullWidth margin="normal" onChange={handleChange} />
        <TextField label="Password" name="password" type="password" fullWidth margin="normal" onChange={handleChange} />
        <Button variant="contained" color="primary" type="submit" fullWidth>
          Login
        </Button>
      </form>
      <Typography sx={{ margin: '50px auto'}}>Dont' have an account? <Button variant="contained" color="primary" type="submit" onClick={() => {
          navigate('/register');
        }}>
          Register
      </Button></Typography>
    </Box>
  );
};

export default Login;
