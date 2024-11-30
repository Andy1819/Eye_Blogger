import React, { useState, useEffect } from 'react';
import { TextField, Button, Card, CardContent, CardActions, Modal, Box } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import EditModal from './EditModal';

const EditorPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [openEditForm, setOpenEditForm] = useState(false);
  const Backend_url = 'https://eye-blogger-backend.vercel.app/';
  const { id: userId } = useParams();
  const navigate = useNavigate();

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${Backend_url}api/messages`, { withCredentials: true });
      setMessages(response.data);
    } catch (error) {
      toast.error('Failed to fetch messages');
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${Backend_url}api/messages/create`,
        { content: newMessage },
        { withCredentials: true }
      );
      setNewMessage('');
      fetchMessages();
      toast.success(response.data);
    } catch (error) {
      toast.error('Failed to create message');
    }
  };

  const handleEdit = async (msg) => {
    try {
      setCurrentMessage(msg);
      setOpenEditForm(true);
    } catch (error) {
      toast.error('Failed to edit message');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${Backend_url}api/messages/${id}`, { withCredentials: true });
      fetchMessages();
      toast.success('Message deleted');
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

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

      <h2>Editor Page</h2>
      <TextField
        label="Write a new message"
        fullWidth
        multiline
        rows={4}
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit
      </Button>

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
                {msg.user._id === userId && (
                <>
                    <Button onClick={() => handleEdit(msg)}>
                    Edit
                    </Button>
                    <Button color="secondary" onClick={() => handleDelete(msg._id)}>
                    Delete
                    </Button>
                </>
                )}
            </CardActions>
            </Card>
        ))
            )
            :
            (<h1>No messages available</h1>)}

      </div>

      {openEditForm && (
        <EditModal
          content={currentMessage}
          open={openEditForm}
          onClose={() => setOpenEditForm(false)}
          onUpdate={fetchMessages}
        />
      )}

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

export default EditorPage;