import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Grid,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  CircularProgress
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';
import CouponsForm from './CouponsForm';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import CouponService from '../../services/couponService/CouponService';

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editCoupon, setEditCoupon] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  const navigate = useNavigate(); // Hook for navigation

  const fetchCoupons = async () => {
    setLoading(true); // Set loading to true before fetching data
    try {
      const couponsData = await CouponService.fetchCoupons();
      setCoupons(couponsData);
    } catch (error) {
      console.error('Failed to fetch coupons', error);
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  const handleEdit = (coupon) => {
    setEditCoupon(coupon);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      await CouponService.deleteCoupon(id);
      fetchCoupons();
    } catch (error) {
      console.error('Failed to delete coupon', error);
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
    setEditCoupon(null);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  return (
    <>
      <Breadcrumb title="Coupons">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Coupons
        </Typography>
      </Breadcrumb>

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={<Typography variant="h6">Coupons</Typography>}
              action={
                <Button
                  onClick={() => setOpenDialog(true)}
                  variant="contained"
                  color="primary"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    padding: '6px 16px',
                    textTransform: 'none',
                    fontSize: '14px',
                    transition: 'background-color 0.3s ease',
                    '&:hover': {
                      backgroundColor: (theme) => theme.palette.primary.dark
                    }
                  }}
                >
                  <AddCircleIcon />
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Add Coupon
                  </Typography>
                </Button>
              }
            />
            <Divider />
            <CardContent>
              {loading ? (
                <Grid container justifyContent="center">
                  <CircularProgress />
                </Grid>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Coupon Name</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell align="center">Edit</TableCell>
                        <TableCell align="center">Delete</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {coupons.map((coupon) => (
                        <TableRow key={coupon._id}>
                          <TableCell>{coupon.couponCode}</TableCell>
                          <TableCell>{coupon.status}</TableCell>
                          <TableCell>{coupon.discountType}</TableCell>
                          <TableCell>
                            {coupon.discountType === 'percentage' ? `${coupon.discountAmount}%` : `$${coupon.discountAmount}`}
                          </TableCell>
                          <TableCell align="center">
                            <IconButton onClick={() => handleEdit(coupon)}>
                              <Edit />
                            </IconButton>
                          </TableCell>
                          <TableCell align="center">
                            <IconButton onClick={() => handleDelete(coupon._id)}>
                              <Delete style={{ color: 'red' }} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                      {coupons.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} align="center">
                            No coupons available
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
        <CouponsForm onClose={handleClose} fetchCoupons={fetchCoupons} editData={editCoupon} />
      </Dialog>
    </>
  );
};

export default Coupons;
