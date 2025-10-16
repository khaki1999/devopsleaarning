import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent, Divider, Grid, Typography, IconButton, Dialog, CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Button from '@mui/material/Button'; // ✅ Correction ici
import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';
import SubCategoryForm from './SubCategoryForm';
import SubCategoryService from '../../services/subCategoryService/subCategoryService';

const SubCategory = () => {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentSubCategory, setCurrentSubCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const categoriesData = await SubCategoryService.fetchCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSubCategories = async () => {
    setLoading(true);
    try {
      const subCategoriesData = await SubCategoryService.fetchSubCategories();
      setSubCategories(subCategoriesData);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setEditMode(false);
    setCurrentSubCategory(null);
    setOpen(true);
  };

  const handleEdit = (subcategory) => {
    setEditMode(true);
    setCurrentSubCategory(subcategory);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setCurrentSubCategory(null);
  };

  const handleAddOrUpdateSubCategory = async (subCategoryData) => {
    try {
      const payload = {
        name: subCategoryData.name,
        categoryId: subCategoryData.categoryId
      };

      if (editMode && currentSubCategory) {
        await SubCategoryService.updateSubCategory(currentSubCategory._id, payload);
      } else {
        await SubCategoryService.addSubCategory(payload);
      }

      fetchSubCategories();
      handleClose();
    } catch (error) {
      console.error('Error saving subcategory:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subcategory?')) {
      try {
        await SubCategoryService.deleteSubCategory(id);
        fetchSubCategories();
      } catch (error) {
        console.error('Error deleting subcategory:', error);
      }
    }
  };

  return (
    <>
      <Breadcrumb title="Sub Category">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary">
          Sub Category
        </Typography>
      </Breadcrumb>

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={<Typography variant="h6">My Subcategories</Typography>}
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
                    <Typography variant="h6">All Subcategories</Typography>
                  </Grid>
                  {subCategories.length === 0 ? (
                    <Grid item xs={12}>
                      <Typography variant="body1" color="textSecondary">
                        No subcategories available.
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
                            <strong>Category</strong>
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
                      {subCategories.map((sub) => (
                        <Grid item xs={12} key={sub._id}>
                          {' '}
                          {/* ✅ Clé unique ici */}
                          <Grid container spacing={2}>
                            <Grid item xs={4}>
                              <Typography>{sub.name}</Typography>
                            </Grid>
                            <Grid item xs={4}>
                              <Typography>{sub.categoryId?.name || 'Unknown'}</Typography>
                            </Grid>
                            <Grid item xs={2}>
                              <IconButton onClick={() => handleEdit(sub)}>
                                <EditIcon />
                              </IconButton>
                            </Grid>
                            <Grid item xs={2}>
                              <IconButton onClick={() => handleDelete(sub._id)}>
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
        <SubCategoryForm
          onClose={handleClose}
          onSubmit={handleAddOrUpdateSubCategory}
          editMode={editMode}
          subCategory={currentSubCategory}
          categories={categories}
        />
      </Dialog>
    </>
  );
};

export default SubCategory;
