/**
 * Form validation utilities for ListingForge
 */

export function validateProductForm(formData) {
  const errors = {};
  const { product, marketplaces } = formData;

  if (!product?.name || product.name.trim() === '') {
    errors.name = 'Product name is required';
  }

  if (!product?.brand || product.brand.trim() === '') {
    errors.brand = 'Brand name is required';
  }

  if (!product?.category || product.category.trim() === '') {
    errors.category = 'Category is required';
  }

  if (!product?.description || product.description.trim() === '') {
    errors.description = 'Product description is required';
  } else if (product.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters';
  }

  const validFeatures = (product?.features || []).filter(
    (f) => typeof f === 'string' && f.trim() !== ''
  );

  if (validFeatures.length === 0) {
    errors.features = 'At least one product feature is required';
  }

  if (!Array.isArray(marketplaces) || marketplaces.length === 0) {
    errors.marketplaces = 'Please select at least one marketplace';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
