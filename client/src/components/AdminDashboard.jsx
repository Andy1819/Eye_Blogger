import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Pagination, Card, CardContent, CardActions, Modal, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const AdminPage = () => {
  const [requestedUsers, setRequestedUsers] = useState([]);
  const [acceptedUsers, setAcceptedUsers] = useState([]);
  const [requestedPage, setRequestedPage] = useState(1);
  const [acceptedPage, setAcceptedPage] = useState(1);
  const [messages, setMessages] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(null);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  const fetchUsers = async (status, setUsers) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/admin/users?status=${status}`, {withCredentials: true});
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/messages', {withCredentials: true});
      // console.log(response.data);
      setMessages(response.data);
    } catch (error) {
      toast.error('Failed to fetch messages');
    }
  };

  const handleStatusChange = async (userId, status) => {
    try {
      await axios.patch(`http://localhost:5000/api/admin/users/${userId}/status`, { status }, {withCredentials: true});
      toast.success(`User ${status} successfully`);
      fetchUsers('requested', setRequestedUsers);
      fetchUsers('accepted', setAcceptedUsers);
    } catch (error) {
      toast.error('Failed to update user status');
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

  useEffect(() => {
    fetchUsers('requested', setRequestedUsers);
    fetchUsers('accepted', setAcceptedUsers);
    fetchMessages();
  }, []);

  const paginate = (users, page) => users.slice((page - 1) * itemsPerPage, page * itemsPerPage);

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
      <h2>Requested Users</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginate(requestedUsers, requestedPage).map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Button onClick={() => handleStatusChange(user._id, 'accepted')} color="success">
                    Accept
                  </Button>
                  <Button onClick={() => handleStatusChange(user._id, 'declined')} color="error">
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination
          count={Math.ceil(requestedUsers.length / itemsPerPage)}
          page={requestedPage}
          onChange={(e, value) => setRequestedPage(value)}
        />
      </TableContainer>

      <h2>Accepted Users</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginate(acceptedUsers, acceptedPage).map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell>{user.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination
          count={Math.ceil(acceptedUsers.length / itemsPerPage)}
          page={acceptedPage}
          onChange={(e, value) => setAcceptedPage(value)}
        />
      </TableContainer>
      
      <h2>Message posted by Editors....</h2>
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

export default AdminPage;
