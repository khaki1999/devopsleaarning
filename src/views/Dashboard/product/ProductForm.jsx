import React, { useEffect, useState } from 'react';
import { Grid, TextField, Button, MenuItem, Typography, Box, IconButton, Dialog, DialogContent } from '@mui/material';
import { styled } from '@mui/material/styles';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import ProductService from '../../../services/products/productService';
import VariantService from '../../../services/variantService/VariantService';
import VariantTypeService from '../../../services/variantTypeService/VariantTypeService';

const ImageUploadBox = styled(Box)(({ theme }) => ({
  border: '2px dashed #666',
  borderRadius: '8px',
  width: '100%',
  height: 130,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#fff',
  cursor: 'pointer',
  position: 'relative'
}));

const ImagePreview = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: '8px'
});

const ProductForm = ({ onAddProduct, open, onClose, editMode = false, product = null }) => {
  const [productName, setProductName] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [variantType, setVariantType] = useState('');
  const [images, setImages] = useState([null, null, null, null, null]);
  const [variantItems, setVariantItems] = useState([]); // all variants
  const [selectedVariants, setSelectedVariants] = useState([]); // selected ids
  const [errors, setErrors] = useState({});

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [variantTypes, setVariantTypes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await ProductService.fetchCategories();
        const subCategoriesData = await ProductService.fetchSubCategories();
        const brandsData = await ProductService.fetchBrands();
        const variantTypesData = await VariantTypeService.fetchVariantTypes();
        const allVariants = await VariantService.fetchVariants();

        setCategories(categoriesData);
        setSubCategories(subCategoriesData);
        setBrands(brandsData);
        setVariantTypes(variantTypesData);
        setVariantItems(allVariants);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (editMode && product) {
      setProductName(product.name);
      setProductDesc(product.description);
      setCategory(product.proCategoryId._id);
      setSubCategory(product.proSubCategoryId._id);
      setBrand(product.proBrandId._id);
      setPrice(product.price);
      setOfferPrice(product.offerPrice);
      setQuantity(product.quantity);
      setVariantType(product.proVariantTypeId._id);
      setImages(product.images.map((img) => img.url));
      // if product has variants, preselect (assuming product.variants contains ids)
      if (Array.isArray(product.variants)) setSelectedVariants(product.variants.map((v) => v._id || v));
    } else {
      setProductName('');
      setProductDesc('');
      setCategory('');
      setSubCategory('');
      setBrand('');
      setPrice('');
      setOfferPrice('');
      setQuantity('');
      setVariantType('');
      setImages([null, null, null, null, null]);
    }
  }, [editMode, product]);

  const handleImageChange = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const newImages = [...images];
      newImages[index] = file;
      setImages(newImages);
    }
  };

  const renderPreview = (img) => {
    if (!img) return <PhotoCamera />;
    if (typeof img === 'string') return <ImagePreview src={img} alt="preview" />;
    // File object: create object URL for preview
    const url = URL.createObjectURL(img);
    return <ImagePreview src={url} alt="preview" onLoad={(e) => URL.revokeObjectURL(url)} />;
  };

  const validate = () => {
    const newErrors = {};
    if (!productName) newErrors.productName = 'Product Name is required';
    if (!productDesc) newErrors.productDesc = 'Product Description is required';
    if (!category) newErrors.category = 'Category is required';
    if (!subCategory) newErrors.subCategory = 'Sub Category is required';
    if (!brand) newErrors.brand = 'Brand is required';
    if (!price) newErrors.price = 'Price is required';
    if (!quantity) newErrors.quantity = 'Quantity is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length === 0) {
      const productData = {
        name: productName,
        description: productDesc,
        category,
        subCategory,
        brand,
        price,
        offerPrice,
        quantity,
        variantType,
        variants: selectedVariants,
        images
      };
      onAddProduct(productData);
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <Box p={2}>
          <Typography variant="h5" align="center" color="primary" gutterBottom>
            {editMode ? 'EDIT PRODUCT' : 'ADD PRODUCT'}
          </Typography>

          <Grid container spacing={2} justifyContent="center">
            {images.map((img, index) => (
              <Grid item xs={6} sm={4} md={2.4} key={index}>
                <ImageUploadBox component="label">
                  {renderPreview(img)}
                  <input type="file" accept="image/*" hidden onChange={(e) => handleImageChange(index, e)} />
                  <Typography variant="caption" align="center">
                    {['Main', 'Second', 'Third', 'Fourth', 'Fifth'][index]} Image
                  </Typography>
                </ImageUploadBox>
              </Grid>
            ))}
          </Grid>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} mt={1}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Product Name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  error={!!errors.productName}
                  helperText={errors.productName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  size="small"
                  label="Product Description"
                  value={productDesc}
                  onChange={(e) => setProductDesc(e.target.value)}
                  error={!!errors.productDesc}
                  helperText={errors.productDesc}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  select
                  label="Select category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  error={!!errors.category}
                  helperText={errors.category}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  select
                  label="Sub category"
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  error={!!errors.subCategory}
                  helperText={errors.subCategory}
                >
                  {subCategories.map((sub) => (
                    <MenuItem key={sub._id} value={sub._id}>
                      {sub.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  select
                  label="Select Brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  error={!!errors.brand}
                  helperText={errors.brand}
                >
                  {brands.map((b) => (
                    <MenuItem key={b._id} value={b._id}>
                      {b.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  error={!!errors.price}
                  helperText={errors.price}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth size="small" label="Offer price" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  error={!!errors.quantity}
                  helperText={errors.quantity}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  select
                  label="Select Variant type"
                  value={variantType}
                  onChange={(e) => {
                    const vt = e.target.value;
                    setVariantType(vt);
                    // when type changes, filter variants list for multi-select
                    const items = (variantItems || []).filter((it) => {
                      const id = it?.variantTypeId?._id || it?.variantTypeId;
                      return id === vt;
                    });
                    // Set filtered list into variantItems UI source
                    setVariantItems(items);
                    setSelectedVariants([]);
                  }}
                >
                  {variantTypes.map((v) => (
                    <MenuItem key={v._id} value={v._id}>
                      {v.type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  select
                  SelectProps={{ multiple: true, renderValue: (selected) => `${selected.length} selected` }}
                  label="Select Variants"
                  value={selectedVariants}
                  onChange={(e) => setSelectedVariants(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
                  helperText={variantItems.length === 0 ? 'Select a variant type first' : ''}
                >
                  {variantItems
                    .filter((it) => (variantType ? (it?.variantTypeId?._id || it?.variantTypeId) === variantType : true))
                    .map((item) => (
                      <MenuItem key={item._id} value={item._id}>
                        {item.name || item.value || item.title}
                      </MenuItem>
                    ))}
                </TextField>
              </Grid>
            </Grid>

            <Box mt={3} display="flex" justifyContent="center" gap={2}>
              <Button variant="outlined" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                {editMode ? 'Update' : 'Submit'}
              </Button>
            </Box>
          </form>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProductForm;
