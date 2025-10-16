import React, { useState, useEffect } from 'react';
import {
  DialogTitle, DialogContent, DialogActions,
  TextField, Button, Grid
} from '@mui/material';

const NotificationForm = ({ onClose, onSubmit, editMode, notification }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (editMode && notification) {
      setTitle(notification.title || '');
      setDescription(notification.description || '');
      setImageUrl(notification.imageUrl || '');
    } else {
      setTitle('');
      setDescription('');
      setImageUrl('');
    }
  }, [editMode, notification]);

  const handleSubmit = () => {
    if (title.trim() === '' || description.trim() === '') {
      alert('Please fill in title and description.');
      return;
    }

    onSubmit({ title, description, imageUrl });
  };

  return (
    <>
      <DialogTitle>{editMode ? 'Edit Notification' : 'Send Notification'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="Title"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              variant="outlined"
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              variant="outlined"
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Image URL (optional)"
              fullWidth
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              variant="outlined"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="outlined">Cancel</Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          {editMode ? 'Update' : 'Send'}
        </Button>
      </DialogActions>
    </>
  );
};

export default NotificationForm;
