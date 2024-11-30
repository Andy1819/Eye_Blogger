import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import axios from "axios";
import { toast } from 'react-toastify';

const EditModal = ({ content, open, onClose, onUpdate }) => {
  const [formData, setFormData] = useState(content);
  const [changed, setChanged] = useState(false);
  const [initial, setInitial] = useState(formData);
  const Backend_url = 'https://eye-blogger-backend.vercel.app/';
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInitial(formData);
    setFormData({ ...formData, [name]: value });
  };

  useEffect (() => {
    const formChange = JSON.stringify(formData) !== JSON.stringify(initial);
    setChanged(formChange);
  },[[formData, initial]]);

  const handleSubmit = async (id, updatedContent) => {
    try {
        await axios.put(
            `${Backend_url}api/messages/${id}`,
            { content: updatedContent },
            { withCredentials: true }
        );
      toast.success("Message updated successfully!");

      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating message:", error);
      toast.error("Error updating message!");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Message</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Message"
          name="content"
          value={formData.content}
          onChange={handleChange}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => handleSubmit(formData._id, formData.content)} disabled={!changed} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditModal;