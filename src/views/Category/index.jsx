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
  Avatar,
  Stack
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';
import CategoryForm from './CategoryForm';
import { Button } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CategoryService from '../../services/categoryService/CategoryService';

const Category = () => {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true); // Set loading to true before fetching data
    try {
      const categoriesData = await CategoryService.fetchCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  const handleOpen = () => {
    setEditMode(false);
    setCurrentCategory(null);
    setOpen(true);
  };

  const handleEdit = (category) => {
    setEditMode(true);
    setCurrentCategory(category);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setCurrentCategory(null);
  };

  const handleAddOrUpdateCategory = async (categoryData) => {
    try {
      const formData = new FormData();
      formData.append('name', categoryData.name);
      if (categoryData.image) {
        formData.append('img', categoryData.image);
      }

      if (editMode && currentCategory) {
        await CategoryService.updateCategory(currentCategory._id, formData);
      } else {
        await CategoryService.addCategory(formData);
      }

      fetchCategories();
      handleClose();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await CategoryService.deleteCategory(id);
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  return (
    <>
      <Breadcrumb title="Category">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary">
          Category
        </Typography>
      </Breadcrumb>

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={<Typography variant="h6">My Categories</Typography>}
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
                      backgroundColor: (theme) => theme.palette.primary.dark // Changer la couleur au survol
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
                    <Typography variant="h6">All Categories</Typography>
                  </Grid>
                  {categories.length === 0 ? (
                    <Grid item xs={12}>
                      <Typography variant="body1" color="textSecondary">
                        No categories available.
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
                            <strong>Date</strong>
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
                      {categories.map((category, index) => (
                        <Grid item xs={12} key={index}>
                          <Grid container spacing={2}>
                            <Grid item xs={4}>
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar variant="rounded" src={category.image} sx={{ width: 40, height: 40 }} />
                                <Typography>{category.name}</Typography>
                              </Stack>
                            </Grid>
                            <Grid item xs={4}>
                              <Typography color="textSecondary">{new Date(category.createdAt).toLocaleString()}</Typography>
                            </Grid>
                            <Grid item xs={2}>
                              <IconButton onClick={() => handleEdit(category)}>
                                <EditIcon />
                              </IconButton>
                            </Grid>
                            <Grid item xs={2}>
                              <IconButton onClick={() => handleDelete(category._id)}>
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
        <CategoryForm onClose={handleClose} onSubmit={handleAddOrUpdateCategory} editMode={editMode} category={currentCategory} />
      </Dialog>
    </>
  );
};

export default Category;
