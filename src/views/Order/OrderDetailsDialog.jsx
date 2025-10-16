import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { formatCurrency } from '../../utils/formatUtils';

const OrderDetailsDialog = ({ onClose, order, onSubmit }) => {
  const [orderStatus, setOrderStatus] = useState(order?.orderStatus || '');
  const [trackingUrl, setTrackingUrl] = useState(order?.trackingUrl || '');

  useEffect(() => {
    if (order) {
      setOrderStatus(order.orderStatus || '');
      setTrackingUrl(order.trackingUrl || '');
    }
  }, [order]);

  if (!order) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Dialog open={!!order} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5" color="primary" align="center">
          ORDER DETAILS
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {/* Order Info Header */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>Name:</strong> {order.userID?.name || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>Order Id:</strong> {order._id || 'N/A'}
              </Typography>
            </Grid>
          </Grid>

          {/* Items Section */}
          <Card sx={{ mb: 3, border: '1px solid', borderColor: 'primary.main' }}>
            <CardContent>
              <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                Items
              </Typography>
              {order.items && order.items.length > 0 ? (
                <List>
                  {order.items.map((item, index) => (
                    <ListItem key={index} divider={index < order.items.length - 1}>
                      <ListItemText
                        primary={`${item.productName}: ${item.quantity} x ${formatCurrency(item.price)}`}
                        secondary={`Variant: ${item.variant || 'Default'}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No items found
                </Typography>
              )}
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1">
                  <strong>Total Price:</strong>
                </Typography>
                <Typography variant="h6" color="success.main">
                  {formatCurrency(order.totalPrice || order.orderTotal?.total || 0)}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Shipping Address Section */}
          <Card sx={{ mb: 3, border: '1px solid', borderColor: 'primary.main' }}>
            <CardContent>
              <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                Shipping Address
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Phone:</strong> {order.shippingAddress?.phone || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Street:</strong> {order.shippingAddress?.street || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>City:</strong> {order.shippingAddress?.city || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Postal Code:</strong> {order.shippingAddress?.postalCode || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Country:</strong> {order.shippingAddress?.country || 'N/A'}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Payment Details Section */}
          <Card sx={{ mb: 3, border: '1px solid', borderColor: 'primary.main' }}>
            <CardContent>
              <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                Payment Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Payment Method:</strong> {order.paymentMethod || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Coupon Code:</strong> {order.couponCode?.couponCode || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Order Sub Total:</strong> {formatCurrency(order.orderTotal?.subtotal || 0)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="error">
                    <strong>Discount:</strong> {formatCurrency(order.orderTotal?.discount || 0)}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6">
                    <strong>Grand Total:</strong> {formatCurrency(order.orderTotal?.total || order.totalPrice || 0)}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Order Status and Tracking */}
          <Card sx={{ border: '1px solid', borderColor: 'primary.main' }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Order Status</InputLabel>
                    <Select value={orderStatus} label="Order Status" onChange={(e) => setOrderStatus(e.target.value)}>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="processing">Processing</MenuItem>
                      <MenuItem value="shipped">Shipped</MenuItem>
                      <MenuItem value="delivered">Delivered</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Tracking URL"
                    value={trackingUrl}
                    onChange={(e) => setTrackingUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={() => onSubmit({ orderStatus, trackingUrl })} variant="contained" color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailsDialog;
