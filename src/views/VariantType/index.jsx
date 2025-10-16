import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, Divider, Grid, Typography, IconButton, Dialog, CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';
import Breadcrumb from 'component/Breadcrumb';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Button from '@mui/material/Button';
import { gridSpacing } from 'config.js';
import VariantTypeForm from './VariantTypeForm';
import VariantTypeService from '../../services/variantTypeService/VariantTypeService';

const VariantType = () => {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentVariantType, setCurrentVariantType] = useState(null);
  const [variantTypes, setVariantTypes] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ Ajout du state loading

  useEffect(() => {
    fetchVariantTypes();
  }, []);

  const fetchVariantTypes = async () => {
    setLoading(true); // ✅ Début du chargement
    try {
      const data = await VariantTypeService.fetchVariantTypes();
      setVariantTypes(data);
    } catch (error) {
      console.error('Error fetching variant types:', error);
    } finally {
      setLoading(false); // ✅ Fin du chargement
    }
  };

  const handleOpen = () => {
    setEditMode(false);
    setCurrentVariantType(null);
    setOpen(true);
  };

  const handleEdit = (variantType) => {
    setEditMode(true);
    setCurrentVariantType(variantType);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setCurrentVariantType(null);
  };

  const handleAddOrUpdate = async (data) => {
    try {
      const payload = {
        name: data.name,
        type: data.type
      };

      if (editMode && currentVariantType) {
        await VariantTypeService.updateVariantType(currentVariantType._id, payload);
      } else {
        await VariantTypeService.addVariantType(payload);
      }

      fetchVariantTypes();
      handleClose();
    } catch (error) {
      console.error('Error saving variant type:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this variant type?')) {
      try {
        await VariantTypeService.deleteVariantType(id);
        fetchVariantTypes();
      } catch (error) {
        console.error('Error deleting variant type:', error);
      }
    }
  };

  return (
    <>
      <Breadcrumb title="Variant Type">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary">
          Variant Type
        </Typography>
      </Breadcrumb>

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={<Typography variant="h6">My Variant Types</Typography>}
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
                    <Typography variant="h6">All Variant Types</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Typography>
                          <strong>Variant Name</strong>
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography>
                          <strong>Variant Type</strong>
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
                  </Grid>

                  {variantTypes.length === 0 ? (
                    <Grid item xs={12}>
                      <Typography variant="body1" color="textSecondary">
                        No variant types available.
                      </Typography>
                    </Grid>
                  ) : (
                    variantTypes.map((variant) => (
                      <Grid item xs={12} key={variant._id}>
                        <Grid container spacing={2}>
                          <Grid item xs={4}>
                            <Typography>{variant.name}</Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography>{variant.type}</Typography>
                          </Grid>
                          <Grid item xs={2}>
                            <IconButton onClick={() => handleEdit(variant)}>
                              <EditIcon />
                            </IconButton>
                          </Grid>
                          <Grid item xs={2}>
                            <IconButton onClick={() => handleDelete(variant._id)}>
                              <DeleteIcon style={{ color: 'red' }} />
                            </IconButton>
                          </Grid>
                        </Grid>
                        <Divider />
                      </Grid>
                    ))
                  )}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <VariantTypeForm onClose={handleClose} onSubmit={handleAddOrUpdate} editMode={editMode} variantType={currentVariantType} />
      </Dialog>
    </>
  );
};

export default VariantType;
