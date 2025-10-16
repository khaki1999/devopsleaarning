import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  DialogActions,
  Typography,
  MenuItem
} from '@mui/material';

const SubCategoryForm = ({ onClose, onSubmit, editMode = false, subCategory = null, categories = [] }) => {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');

  useEffect(() => {
    if (editMode && subCategory) {
      setName(subCategory.name);
      setCategoryId(subCategory.categoryId?._id || '');
    } else {
      setName('');
      setCategoryId('');
    }
  }, [editMode, subCategory]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name.trim() || !categoryId) return;

    const subCategoryData = {
      name,
      categoryId
    };

    onSubmit(subCategoryData);
  };

  return (
    <Card sx={{ borderRadius: 3, p: 2, minWidth: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {editMode ? 'Edit Subcategory' : 'Add New Subcategory'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3} direction="column">
            <Grid item>
              <TextField
                fullWidth
                label="Subcategory Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Grid>

            <Grid item>
              <TextField
                select
                fullWidth
                label="Category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
              >
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item>
              <DialogActions sx={{ justifyContent: 'space-between' }}>
                <Button onClick={onClose} variant="outlined" color="secondary">
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  {editMode ? 'Update' : 'Submit'}
                </Button>
              </DialogActions>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default SubCategoryForm;
