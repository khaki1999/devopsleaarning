import React, { useEffect, useState } from 'react';
import {
  DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box
} from '@mui/material';

const CategoryForm = ({ onClose, onSubmit, editMode, category }) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (editMode && category) {
      setName(category.name || '');
      setImage(null); // reset image (edit = upload new optional)
    } else {
      setName('');
      setImage(null);
    }
  }, [editMode, category]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, image });
  };

  return (
    <>
      <DialogTitle>{editMode ? 'Edit Category' : 'Add Category'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Box mt={2}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {editMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </>
  );
};

export default CategoryForm;
