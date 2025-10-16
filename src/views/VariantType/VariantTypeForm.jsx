import React, { useState, useEffect } from 'react';
import { Button, DialogTitle, DialogContent, DialogActions, TextField, Grid } from '@mui/material';

const VariantTypeForm = ({ onClose, onSubmit, editMode, variantType }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: ''
  });

  useEffect(() => {
    if (editMode && variantType) {
      setFormData({
        name: variantType.name || '',
        type: variantType.type || ''
      });
    } else {
      setFormData({ name: '', type: '' });
    }
  }, [editMode, variantType]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <>
      <DialogTitle>{editMode ? 'Edit Variant Type' : 'Add Variant Type'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              name="name"
              label="Variant Name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="type"
              label="Variant Type"
              value={formData.type}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {editMode ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </>
  );
};

export default VariantTypeForm;
