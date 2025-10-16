import React, { useEffect, useMemo, useState } from 'react';
import { useTheme, styled } from '@mui/material/styles';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  CircularProgress,
  Avatar,
  Stack
} from '@mui/material';
import { Add as AddIcon, Refresh as RefreshIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { gridSpacing } from 'config.js';
import ProductForm from '../product/ProductForm';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ProductService from '../../../services/products/productService';
import OrderService from '../../../services/orderService/OrderService';
import Chart from 'react-apexcharts';
import { useSelector } from 'react-redux';

const Header = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default
}));

const Dashboard = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const globalSearch = useSelector((state) => state.search?.query || '');

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrderKey, setSelectedOrderKey] = useState('all');

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const productsData = await ProductService.fetchProducts();
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const data = await OrderService.fetchOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleOpen = () => {
    setEditMode(false);
    setCurrentProduct(null);
    setOpen(true);
  };

  const handleEdit = (product) => {
    setEditMode(true);
    setCurrentProduct(product);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setCurrentProduct(null);
  };

  const handleAddProduct = async (productData) => {
    try {
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('proCategoryId', productData.category);
      formData.append('proSubCategoryId', productData.subCategory);
      formData.append('proBrandId', productData.brand);
      formData.append('price', productData.price);
      formData.append('offerPrice', productData.offerPrice);
      formData.append('quantity', productData.quantity);
      formData.append('proVariantTypeId', productData.variantType);

      productData.images.forEach((img, index) => {
        if (img) formData.append(`image${index + 1}`, img);
      });

      if (editMode && currentProduct) {
        await ProductService.updateProduct(currentProduct._id, formData);
      } else {
        await ProductService.addProduct(formData);
      }

      fetchProducts();
      handleClose();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await ProductService.deleteProduct(id);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  // Filter + search logic
  const filteredProducts = products.filter((p) => {
    if (filter === 'out') return p.quantity === 0;
    if (filter === 'limited') return p.quantity > 0 && p.quantity <= 5;
    if (filter === 'other') return p.quantity > 5;
    return true; // all
  });

  const searchedProducts = useMemo(() => {
    if (!globalSearch) return filteredProducts;
    const q = globalSearch.toLowerCase();
    return filteredProducts.filter((p) => `${p.name || ''}`.toLowerCase().includes(q));
  }, [filteredProducts, globalSearch]);

  const orderStatusCounts = useMemo(() => {
    const init = { all: 0, pending: 0, processed: 0, cancelled: 0, shipped: 0, delivered: 0 };
    if (!Array.isArray(orders)) return init;
    const acc = { ...init };
    acc.all = orders.length;
    orders.forEach((o) => {
      const s = `${o?.orderStatus || ''}`.toLowerCase();
      if (s.includes('pending')) acc.pending += 1;
      else if (s.includes('processing')) acc.processed += 1;
      else if (s.includes('cancel')) acc.cancelled += 1;
      else if (s.includes('ship')) acc.shipped += 1;
      else if (s.includes('deliver')) acc.delivered += 1;
    });
    return acc;
  }, [orders]);

  const ordersDonut = useMemo(() => {
    const baseColors = [
      theme.palette.warning.main,
      theme.palette.primary.main,
      theme.palette.error.main,
      theme.palette.info.main,
      '#2e7d32'
    ];
    const dimmed = '#cfd8dc';
    const labelKeys = ['pending', 'processed', 'cancelled', 'shipped', 'delivered'];
    const colors = labelKeys.map((k, idx) => (selectedOrderKey === 'all' || selectedOrderKey === k ? baseColors[idx] : dimmed));
    return {
      series: [
        orderStatusCounts.pending,
        orderStatusCounts.processed,
        orderStatusCounts.cancelled,
        orderStatusCounts.shipped,
        orderStatusCounts.delivered
      ],
      options: {
        chart: {
          type: 'donut',
          events: {
            dataPointSelection: function (event, chartContext, config) {
              const key = labelKeys[config.dataPointIndex];
              // setSelectedOrderKey not available in this scope; handled by onClick overlay
            }
          }
        },
        labels: ['Pending', 'Processing', 'Cancelled', 'Shipped', 'Delivered'],
        legend: { position: 'bottom' },
        dataLabels: { enabled: true },
        colors
      }
    };
  }, [orderStatusCounts, theme, selectedOrderKey]);

  return (
    <>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Header>
            <Typography variant="h4">My Products</Typography>
            <div>
              <IconButton color="primary" onClick={handleOpen}>
                <AddIcon />
              </IconButton>
              <IconButton
                onClick={() => {
                  fetchProducts();
                  fetchOrders();
                }}
              >
                <RefreshIcon />
              </IconButton>
            </div>
          </Header>

          <Grid container spacing={gridSpacing}>
            {[
              {
                label: 'All Products',
                key: 'all',
                count: products.length,
                icon: <Inventory2Icon fontSize="large" color="primary" />
              },
              {
                label: 'Out of Stock',
                key: 'out',
                count: products.filter((p) => p.quantity === 0).length,
                icon: <RemoveShoppingCartIcon fontSize="large" color="error" />
              },
              {
                label: 'Limited Stock',
                key: 'limited',
                count: products.filter((p) => p.quantity > 0 && p.quantity <= 5).length,
                icon: <WarningAmberIcon fontSize="large" color="warning" />
              },
              {
                label: 'Other Stock',
                key: 'other',
                count: products.filter((p) => p.quantity > 5).length,
                icon: <CheckCircleIcon fontSize="large" sx={{ color: 'green' }} />
              }
            ].map((item) => (
              <Grid item lg={3} sm={6} xs={12} key={item.key}>
                <Card
                  onClick={() => setFilter(item.key)}
                  sx={{
                    cursor: 'pointer',
                    border: filter === item.key ? `2px solid ${theme.palette.primary.main}` : '1px solid #e0e0e0',
                    backgroundColor: filter === item.key ? theme.palette.action.hover : 'inherit',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {item.icon}
                    <div>
                      <Typography variant="h6">{item.label}</Typography>
                      <Typography variant="subtitle1" color="textSecondary">
                        {item.count} Products
                      </Typography>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item lg={8} xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {filter === 'all'
                      ? 'All Products'
                      : filter === 'out'
                        ? 'Out of Stock Products'
                        : filter === 'limited'
                          ? 'Limited Stock Products'
                          : 'Other Stock Products'}
                  </Typography>

                  {loading ? (
                    <Grid container justifyContent="center">
                      <CircularProgress />
                    </Grid>
                  ) : (
                    <Grid container spacing={2}>
                      {searchedProducts.length === 0 ? (
                        <Grid item xs={12}>
                          <Typography>No products available.</Typography>
                        </Grid>
                      ) : (
                        <>
                          <Grid item xs={12}>
                            <Grid container spacing={2}>
                              <Grid item xs={3}>
                                <strong>Name</strong>
                              </Grid>
                              <Grid item xs={2}>
                                <strong>Category</strong>
                              </Grid>
                              <Grid item xs={2}>
                                <strong>Sub Category</strong>
                              </Grid>
                              <Grid item xs={2}>
                                <strong>Price</strong>
                              </Grid>
                              <Grid item xs={1}>
                                <strong>Edit</strong>
                              </Grid>
                              <Grid item xs={1}>
                                <strong>Delete</strong>
                              </Grid>
                            </Grid>
                          </Grid>

                          {searchedProducts.map((product) => (
                            <Grid item xs={12} key={product._id}>
                              <Grid container spacing={2} alignItems="center">
                                <Grid item xs={3}>
                                  <Stack direction="row" alignItems="center" spacing={2}>
                                    <Avatar variant="rounded" src={product.images?.[0]?.url} sx={{ width: 40, height: 40 }} />
                                    <Typography>{product.name}</Typography>
                                  </Stack>
                                </Grid>
                                <Grid item xs={2}>
                                  {product.proCategoryId?.name}
                                </Grid>
                                <Grid item xs={2}>
                                  {product.proSubCategoryId?.name}
                                </Grid>
                                <Grid item xs={2}>
                                  {product.price}
                                </Grid>
                                <Grid item xs={1}>
                                  <IconButton onClick={() => handleEdit(product)}>
                                    <EditIcon />
                                  </IconButton>
                                </Grid>
                                <Grid item xs={1}>
                                  <IconButton onClick={() => handleDelete(product._id)}>
                                    <DeleteIcon color="error" />
                                  </IconButton>
                                </Grid>
                              </Grid>
                              <Divider />
                            </Grid>
                          ))}
                        </>
                      )}
                    </Grid>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item lg={4} xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h5">Orders Details</Typography>
                  <div style={{ marginTop: 8, marginBottom: 16 }}>
                    {ordersLoading ? (
                      <Grid container justifyContent="center">
                        <CircularProgress />
                      </Grid>
                    ) : (
                      <div onClick={(e) => e.stopPropagation()}>
                        <Chart options={ordersDonut.options} series={ordersDonut.series} type="donut" height={260} />
                      </div>
                    )}
                  </div>
                  <List>
                    {[
                      { label: 'All Orders', value: orderStatusCounts.all, key: 'all' },
                      { label: 'Pending Orders', value: orderStatusCounts.pending, key: 'pending' },
                      { label: 'Processing Orders', value: orderStatusCounts.processed, key: 'processed' },
                      { label: 'Cancelled Orders', value: orderStatusCounts.cancelled, key: 'cancelled' },
                      { label: 'Shipped Orders', value: orderStatusCounts.shipped, key: 'shipped' },
                      { label: 'Delivered Orders', value: orderStatusCounts.delivered, key: 'delivered' }
                    ].map((row, idx) => (
                      <React.Fragment key={row.label}>
                        <ListItem button onClick={() => setSelectedOrderKey(row.key)} selected={selectedOrderKey === row.key}>
                          <ListItemText primary={row.label} secondary={`${row.value} Order${row.value === 1 ? '' : 's'}`} />
                        </ListItem>
                        {idx < 5 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <ProductForm open={open} onClose={handleClose} onAddProduct={handleAddProduct} editMode={editMode} product={currentProduct} />
    </>
  );
};

export default Dashboard;
