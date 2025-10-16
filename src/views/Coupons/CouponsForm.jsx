import React, { useEffect, useState } from 'react';
import {
  DialogTitle, DialogContent, DialogActions,
  TextField, Button, Grid, MenuItem,
  FormControl, InputLabel, Select
} from '@mui/material';
import CouponService from '../../services/couponService/CouponService';

const CouponsForm = ({ onClose, fetchCoupons, editData }) => {
  const [couponCode, setCouponCode] = useState('');
  const [status, setStatus] = useState('active');
  const [discountType, setDiscountType] = useState('percentage');
  const [discountAmount, setDiscountAmount] = useState('');
  const [minimumPurchaseAmount, setMinimumPurchaseAmount] = useState('');
  const [endDate, setEndDate] = useState('');
  const [applicableCategory, setApplicableCategory] = useState('');
  const [applicableSubCategory, setApplicableSubCategory] = useState('');
  const [applicableProduct, setApplicableProduct] = useState('');
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [catRes, subRes, prodRes] = await Promise.all([
          CouponService.fetchCategories(),
          CouponService.fetchSubCategories(),
          CouponService.fetchProducts()
        ]);
        setCategories(catRes);
        setSubCategories(subRes);
        setProducts(prodRes);
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    };
    fetchDropdowns();
  }, []);

  useEffect(() => {
    if (editData) {
      setCouponCode(editData.couponCode);
      setStatus(editData.status);
      setDiscountType(editData.discountType);
      setDiscountAmount(editData.discountAmount);
      setMinimumPurchaseAmount(editData.minimumPurchaseAmount);
      setEndDate(editData.endDate?.slice(0, 10));
      setApplicableCategory(editData.applicableCategory || '');
      setApplicableSubCategory(editData.applicableSubCategory || '');
      setApplicableProduct(editData.applicableProduct || '');
    }
  }, [editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newCoupon = {
      couponCode,
      status,
      discountType,
      discountAmount,
      minimumPurchaseAmount,
      endDate,
      applicableCategory,
      applicableSubCategory,
      applicableProduct
    };

    try {
      if (editData) {
        await CouponService.updateCoupon(editData._id, newCoupon);
      } else {
        await CouponService.addCoupon(newCoupon);
      }
      fetchCoupons();
      onClose();
    } catch (error) {
      console.error('Error saving coupon:', error);
    }
  };

  return (
    <>
      <DialogTitle>{editData ? 'Edit Coupon' : 'Add Coupon'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth label="Coupon Name" required
                value={couponCode} onChange={(e) => setCouponCode(e.target.value)}
              />
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth required>
                <InputLabel>Status</InputLabel>
                <Select value={status} onChange={(e) => setStatus(e.target.value)} label="Status">
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth required>
                <InputLabel>Type</InputLabel>
                <Select value={discountType} onChange={(e) => setDiscountType(e.target.value)} label="Type">
                  <MenuItem value="percentage">Percentage</MenuItem>
                  <MenuItem value="fixed">Fixed</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth label="Discount Amount" type="number" required
                value={discountAmount} onChange={(e) => setDiscountAmount(e.target.value)}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth label="Minimum Purchase Amount" type="number" required
                value={minimumPurchaseAmount} onChange={(e) => setMinimumPurchaseAmount(e.target.value)}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth label="End Date" type="date" required
                InputLabelProps={{ shrink: true }}
                value={endDate} onChange={(e) => setEndDate(e.target.value)}
              />
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select value={applicableCategory} onChange={(e) => setApplicableCategory(e.target.value)} label="Category">
                  {categories.map((cat) => (
                    <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Subcategory</InputLabel>
                <Select value={applicableSubCategory} onChange={(e) => setApplicableSubCategory(e.target.value)} label="Subcategory">
                  {subCategories.map((sub) => (
                    <MenuItem key={sub._id} value={sub._id}>{sub.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Product</InputLabel>
                <Select value={applicableProduct} onChange={(e) => setApplicableProduct(e.target.value)} label="Product">
                  {products.map((prod) => (
                    <MenuItem key={prod._id} value={prod._id}>{prod.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">{editData ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </form>
    </>
  );
};

export default CouponsForm;
