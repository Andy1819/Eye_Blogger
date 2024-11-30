import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CardActions, Modal, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const ViewerPage = () => {
  const [messages, setMessages] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(null);

  const navigate = useNavigate();

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/messages', {withCredentials: true});
      setMessages(response.data);
    } catch (error) {
      toast.error('Failed to fetch messages');
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  

  const handleOpenModal = (message) => {
    setCurrentMessage(message);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setCurrentMessage(null);
    setOpenModal(false);
  };

  return (
    <div>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          navigate('/');
        }}
        style={{ float: 'right' }}
      >
        Logout
      </Button>

      <h2>Viewer Page</h2>

      <div style={{ marginTop: '20px' }}>
      {messages && Array.isArray(messages) && messages.length > 0 ? (
        messages.map((msg) => (
            <Card key={msg._id} style={{ marginBottom: '10px' }}>
            <CardContent>
                <p>{msg.content.substring(0, 100)}...</p>
                <small>By: {msg.user.name}</small>
            </CardContent>
            <CardActions>
                <Button onClick={() => handleOpenModal(msg)}>Open</Button>
            </CardActions>
            </Card>
        ))
            )
            :
            (<h1>No messages available</h1>)}

      </div>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ p: 4, backgroundColor: 'white', margin: '20px auto', maxWidth: 400 }}>
          <h3>Message Details</h3>
          <p>{currentMessage?.content}</p>
          <small>{new Date(currentMessage?.time).toLocaleString()}</small>
          <Button onClick={handleCloseModal}>Close</Button>
        </Box>
      </Modal>
    </div>
  );
};

export default ViewerPage;
