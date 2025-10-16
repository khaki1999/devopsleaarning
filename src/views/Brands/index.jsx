import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, Divider, Grid, Typography, IconButton, Dialog, CircularProgress, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Breadcrumb from 'component/Breadcrumb';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { gridSpacing } from 'config.js';
import BrandForm from './BrandForm';
import BrandService from '../../services/brandService/brandService';
import { Link } from 'react-router-dom';

const Brand = () => {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentBrand, setCurrentBrand] = useState(null);
  const [brands, setBrands] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [subcategoriesData, brandsData] = await Promise.all([BrandService.fetchSubcategories(), BrandService.fetchBrands()]);
      setSubcategories(subcategoriesData);
      setBrands(brandsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setEditMode(false);
    setCurrentBrand(null);
    setOpen(true);
  };

  const handleEdit = (brand) => {
    setEditMode(true);
    setCurrentBrand(brand);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setCurrentBrand(null);
  };

  const handleAddOrUpdateBrand = async (brandData) => {
    try {
      const payload = {
        name: brandData.name,
        subcategoryId: brandData.subcategoryId
      };

      if (editMode && currentBrand) {
        await BrandService.updateBrand(currentBrand._id, payload);
      } else {
        await BrandService.addBrand(payload);
      }

      fetchData();
      handleClose();
    } catch (error) {
      console.error('Error saving brand:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      try {
        await BrandService.deleteBrand(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting brand:', error);
      }
    }
  };

  const getSubcategoryName = (subcategory) => {
    if (typeof subcategory === 'object' && subcategory !== null) {
      return subcategory.name || 'Unknown';
    }
    const found = subcategories.find((s) => s._id === subcategory);
    return found ? found.name : 'Unknown';
  };

  return (
    <>
      <Breadcrumb title="Brand">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary">
          Brand
        </Typography>
      </Breadcrumb>

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={<Typography variant="h6">My Brands</Typography>}
              action={
                <Button
                  onClick={handleOpen}
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
                    Add New
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
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6">All Brands</Typography>
                  </Grid>
                  {brands.length === 0 ? (
                    <Grid item xs={12}>
                      <Typography variant="body1" color="textSecondary">
                        No brands available.
                      </Typography>
                    </Grid>
                  ) : (
                    <Grid item xs={12}>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <Typography>
                            <strong>Name</strong>
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography>
                            <strong>Subcategory</strong>
                          </Typography>
                        </Grid>
                        <Grid item xs={2}>
                          <Typography>
                            <strong>Edit</strong>
                          </Typography>
                        </Grid>
                        <Grid item xs={2}>
                          <Typography>
                            <strong>Delete</strong>
                          </Typography>
                        </Grid>
                      </Grid>
                      <Divider />
                      {brands.map((brand, index) => (
                        <Grid item xs={12} key={index}>
                          <Grid container spacing={2}>
                            <Grid item xs={4}>
                              <Typography>{brand.name}</Typography>
                            </Grid>
                            <Grid item xs={4}>
                              <Typography>{getSubcategoryName(brand.subcategoryId)}</Typography>
                            </Grid>
                            <Grid item xs={2}>
                              <IconButton onClick={() => handleEdit(brand)}>
                                <EditIcon />
                              </IconButton>
                            </Grid>
                            <Grid item xs={2}>
                              <IconButton onClick={() => handleDelete(brand._id)}>
                                <DeleteIcon style={{ color: 'red' }} />
                              </IconButton>
                            </Grid>
                          </Grid>
                          <Divider />
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <BrandForm
          onClose={handleClose}
          onSubmit={handleAddOrUpdateBrand}
          editMode={editMode}
          brand={currentBrand}
          subcategories={subcategories}
        />
      </Dialog>
    </>
  );
};

export default Brand;
