import React, { useState } from 'react';
import { TextField, Button, RadioGroup, FormControlLabel, Radio, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phoneNumber: '', password: '', role: 'viewer' });
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    // Basic validation
    if (!formData.name) {
      toast.error("First name and last name are required!");
      return false;
    }

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Invalid email address!");
      return false;
    }

    if (formData.phoneNumber.length !== 10) {
      toast.error("Phone number must be 10 digits long!");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!validateForm){
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData, { withCredentials: true });
      toast.success(response.data);
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data || 'Registration failed');
    }
  };

  return (
    <Box sx={{ width: '300px', margin: '50px auto', textAlign: 'center' }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <TextField label="Name" name="name" fullWidth margin="normal" onChange={handleChange} />
        <TextField label="Email" name="email" fullWidth margin="normal" onChange={handleChange} />
        <TextField label="Phone" name="phoneNumber" fullWidth margin="normal" onChange={handleChange} />
        <TextField label="Password" name="password" type="password" fullWidth margin="normal" onChange={handleChange} />
        <RadioGroup name="role" value={formData.role} onChange={handleChange} row>
          <FormControlLabel value="viewer" control={<Radio />} label="Viewer" />
          <FormControlLabel value="editor" control={<Radio />} label="Editor" />
        </RadioGroup>
        <Button variant="contained" color="primary" type="submit" fullWidth>
          Register
        </Button>
      </form>
    </Box>
  );
};

export default Register;
