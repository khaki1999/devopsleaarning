import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, Divider, Grid, Typography, IconButton, Dialog, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Breadcrumb from 'component/Breadcrumb';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Button } from '@mui/material';
import { gridSpacing } from 'config.js';
import VariantForm from './VariantForm';
import VariantService from '../../services/variantService/VariantService';

const Variant = () => {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentVariant, setCurrentVariant] = useState(null);
  const [variants, setVariants] = useState([]);
  const [variantTypes, setVariantTypes] = useState([]);
  const [loading, setLoading] = useState(true); // Ajout de loading

  useEffect(() => {
    fetchVariantTypes();
    fetchVariants();
  }, []);

  const fetchVariantTypes = async () => {
    try {
      const variantTypesData = await VariantService.fetchVariantTypes();
      setVariantTypes(variantTypesData);
    } catch (error) {
      console.error('Error fetching variant types:', error);
    }
  };

  const fetchVariants = async () => {
    setLoading(true); // Commencer le chargement
    try {
      const variantsData = await VariantService.fetchVariants();
      setVariants(variantsData);
    } catch (error) {
      console.error('Error fetching variants:', error);
    } finally {
      setLoading(false); // Fin du chargement
    }
  };

  const handleOpen = () => {
    setEditMode(false);
    setCurrentVariant(null);
    setOpen(true);
  };

  const handleEdit = (variant) => {
    setEditMode(true);
    setCurrentVariant(variant);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setCurrentVariant(null);
  };

  const handleAddOrUpdateVariant = async (variantData) => {
    try {
      const payload = {
        name: variantData.name,
        variantTypeId: variantData.variantTypeId
      };

      if (editMode && currentVariant) {
        await VariantService.updateVariant(currentVariant._id, payload);
      } else {
        await VariantService.addVariant(payload);
      }

      fetchVariants();
      handleClose();
    } catch (error) {
      console.error('Error saving variant:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this variant?')) {
      try {
        await VariantService.deleteVariant(id);
        fetchVariants();
      } catch (error) {
        console.error('Error deleting variant:', error);
      }
    }
  };

  const getVariantTypeName = (variantType) => {
    if (typeof variantType === 'object' && variantType !== null) {
      return variantType.name || 'Unknown';
    }
    const found = variantTypes.find((type) => type._id === variantType);
    return found ? found.name : 'Unknown';
  };

  return (
    <>
      <Breadcrumb title="Variant">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary">
          Variant
        </Typography>
      </Breadcrumb>

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={<Typography variant="h6">My Variants</Typography>}
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
                    <Typography variant="h6">All Variants</Typography>
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

                  {variants.length === 0 ? (
                    <Grid item xs={12}>
                      <Typography variant="body1" color="textSecondary">
                        No variants available.
                      </Typography>
                    </Grid>
                  ) : (
                    variants.map((variant) => (
                      <Grid item xs={12} key={variant._id}>
                        <Grid container spacing={2}>
                          <Grid item xs={4}>
                            <Typography>{variant.name}</Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography>{getVariantTypeName(variant.variantTypeId)}</Typography>
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
        <VariantForm
          onClose={handleClose}
          onSubmit={handleAddOrUpdateVariant}
          editMode={editMode}
          variant={currentVariant}
          variantTypes={variantTypes}
        />
      </Dialog>
    </>
  );
};

export default Variant;
