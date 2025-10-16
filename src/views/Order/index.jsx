import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Grid,
  Typography,
  IconButton,
  Dialog,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Avatar,
  Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';
import OrderDetailsDialog from './OrderDetailsDialog';
import OrderService from '../../services/orderService/OrderService';

const Order = () => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All order');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const ordersData = await OrderService.fetchOrders();
      setOrders(ordersData);
      setFilteredOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = (status) => {
    setStatusFilter(status);
    if (status === 'All order') {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter((order) => order.orderStatus === status);
      setFilteredOrders(filtered);
    }
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleViewDetails = (order) => {
    setCurrentOrder(order);
    setDetailsOpen(true);
  };

  const handleDetailsClose = () => {
    setDetailsOpen(false);
    setCurrentOrder(null);
  };

  const handleUpdateOrder = async (orderData) => {
    try {
      await OrderService.updateOrder(currentOrder._id, orderData);
      fetchOrders();
      handleDetailsClose();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await OrderService.deleteOrder(id);
        fetchOrders();
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    }
  };

  return (
    <>
      <Breadcrumb title="Orders">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary">
          Orders
        </Typography>
      </Breadcrumb>

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">My Orders</Typography>
                  <Box display="flex" gap={2} alignItems="center">
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                      <InputLabel>Filter Order By status</InputLabel>
                      <Select value={statusFilter} label="Filter Order By status" onChange={(e) => filterOrders(e.target.value)}>
                        <MenuItem value="All order">All order</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="processing">Processing</MenuItem>
                        <MenuItem value="shipped">Shipped</MenuItem>
                        <MenuItem value="delivered">Delivered</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                      </Select>
                    </FormControl>
                    <Tooltip title="Refresh">
                      <IconButton onClick={fetchOrders}>
                        <RefreshIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Export">
                      <IconButton onClick={() => console.log('Export functionality')}>
                        <FileDownloadIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              }
            />
            <Divider />
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                {statusFilter === 'All order' ? 'All Order' : `${statusFilter} Orders`}
              </Typography>

              {loading ? (
                <Box display="flex" justifyContent="center" p={4}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <strong>Customer Name</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Order Amount</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Payment</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Status</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Date</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Actions</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredOrders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} align="center">
                            <Typography variant="body1" color="textSecondary">
                              No orders available.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredOrders.map((order, index) => (
                          <TableRow key={order._id} hover>
                            <TableCell>
                              <Box display="flex" alignItems="center" gap={1}>
                                <Avatar
                                  sx={{
                                    width: 24,
                                    height: 24,
                                    bgcolor: ['primary', 'secondary', 'success', 'warning', 'error'][index % 5],
                                    fontSize: '0.875rem'
                                  }}
                                >
                                  {index + 1}
                                </Avatar>
                                <Typography variant="body2">{order.userID?.name || 'N/A'}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight="medium">
                                {formatCurrency(order.orderTotal?.total || order.totalPrice || 0)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">{order.paymentMethod || 'N/A'}</Typography>
                            </TableCell>
                            <TableCell>
                              <Chip label={order.orderStatus || 'N/A'} color={getStatusColor(order.orderStatus)} size="small" />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">{formatDate(order.orderDate)}</Typography>
                            </TableCell>
                            <TableCell>
                              <Tooltip title="View & Edit">
                                <IconButton size="small" onClick={() => handleViewDetails(order)}>
                                  <VisibilityIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton size="small" onClick={() => handleDelete(order._id)} color="error">
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={detailsOpen} onClose={handleDetailsClose} maxWidth="md" fullWidth>
        <OrderDetailsDialog onClose={handleDetailsClose} order={currentOrder} onSubmit={handleUpdateOrder} />
      </Dialog>
    </>
  );
};

export default Order;
