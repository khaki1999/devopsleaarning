import React, { useEffect, useState } from 'react';
import {
  DialogTitle, DialogContent, DialogActions,
  TextField, Button, Grid, Typography, Avatar
} from '@mui/material';
import PosterService from '../../services/posterService/PosterService';

const PostersForm = ({ onClose, fetchPosters, editData }) => {
  const [posterName, setPosterName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (editData) {
      setPosterName(editData.posterName);
      setPreview(editData.imageUrl);
    }
  }, [editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('posterName', posterName);
    if (imageFile) {
      formData.append('img', imageFile);
    }

    try {
      if (editData) {
        await PosterService.updatePoster(editData._id, formData);
      } else {
        await PosterService.addPoster(formData);
      }
      fetchPosters();
      onClose();
    } catch (error) {
      console.error('Error saving poster:', error);
    }
  };

  return (
    <>
      <DialogTitle>{editData ? 'Edit Poster' : 'Add Poster'}</DialogTitle>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth label="Poster Name" required
                value={posterName} onChange={(e) => setPosterName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" component="label">
                Upload Image
                <input type="file" hidden accept="image/*"
                  onChange={(e) => {
                    setImageFile(e.target.files[0]);
                    setPreview(URL.createObjectURL(e.target.files[0]));
                  }}
                />
              </Button>
            </Grid>
            {preview && (
              <Grid item xs={12}>
                <Typography variant="subtitle2">Preview:</Typography>
                <Avatar src={preview} variant="rounded" sx={{ width: 100, height: 100 }} />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">{editData ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </form>
    </>
  );
};

export default PostersForm;
