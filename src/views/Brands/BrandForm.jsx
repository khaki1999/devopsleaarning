import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, TextField, Button, Grid,
  DialogActions, Typography, MenuItem
} from '@mui/material';

const BrandForm = ({ onClose, onSubmit, editMode = false, brand = null, subcategories = [] }) => {
  const [name, setName] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');

  useEffect(() => {
    if (editMode && brand) {
      setName(brand.name);
      setSubcategoryId(brand.subcategoryId);
    } else {
      setName('');
      setSubcategoryId('');
    }
  }, [editMode, brand]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !subcategoryId) return;

    const brandData = { name, subcategoryId };
    onSubmit(brandData);
  };

  return (
    <Card sx={{ borderRadius: 3, p: 2, minWidth: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {editMode ? 'Edit Brand' : 'Add New Brand'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3} direction="column">
            <Grid item>
              <TextField
                fullWidth
                label="Brand Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Grid>
            <Grid item>
              <TextField
                select
                fullWidth
                label="Subcategory"
                value={subcategoryId}
                onChange={(e) => setSubcategoryId(e.target.value)}
                required
              >
                {subcategories.map((sub) => (
                  <MenuItem key={sub._id} value={sub._id}>
                    {sub.name}
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

export default BrandForm;
