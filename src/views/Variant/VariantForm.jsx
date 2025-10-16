import React, { useState, useEffect } from 'react';
import {
  DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem
} from '@mui/material';

const VariantForm = ({ onClose, onSubmit, editMode, variant, variantTypes }) => {
  const [name, setName] = useState('');
  const [variantTypeId, setVariantTypeId] = useState('');

  useEffect(() => {
    if (editMode && variant) {
      setName(variant.name);
      setVariantTypeId(variant.variantTypeId || '');
    } else {
      setName('');
      setVariantTypeId('');
    }
  }, [editMode, variant]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, variantTypeId });
  };

  return (
    <>
      <DialogTitle>{editMode ? 'Edit Variant' : 'Add Variant'}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Variant Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="dense"
        />
        <TextField
          select
          fullWidth
          label="Variant Type"
          value={variantTypeId}
          onChange={(e) => setVariantTypeId(e.target.value)}
          margin="dense"
        >
          {variantTypes.map((type) => (
            <MenuItem key={type._id} value={type._id}>
              {type.name}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {editMode ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </>
  );
};

export default VariantForm;
