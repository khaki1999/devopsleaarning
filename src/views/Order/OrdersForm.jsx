import React, { useState, useEffect } from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Stack
} from '@mui/material';

const OrderForm = ({ onClose, onSubmit, editMode, order }) => {
  const [formData, setFormData] = useState({
    orderStatus: '',
    trackingUrl: ''
  });

  useEffect(() => {
    if (editMode && order) {
      setFormData({
        orderStatus: order.orderStatus || '',
        trackingUrl: order.trackingUrl || ''
      });
    }
  }, [editMode, order]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <>
      <DialogTitle>{editMode ? 'Edit Order' : 'New Order'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1, minWidth: '350px' }}>
          <TextField
            select
            label="Order Status"
            name="orderStatus"
            value={formData.orderStatus}
            onChange={handleChange}
            fullWidth
            required
          >
            {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
              <MenuItem key={status} value={status}>{status}</MenuItem>
            ))}
          </TextField>

          <TextField
            label="Tracking URL"
            name="trackingUrl"
            value={formData.trackingUrl}
            onChange={handleChange}
            fullWidth
            placeholder="https://..."
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {editMode ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </>
  );
};

export default OrderForm;
