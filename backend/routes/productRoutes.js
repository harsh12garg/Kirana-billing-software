const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  getProductByBarcode,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.route('/')
  .get(protect, getProducts)
  .post(protect, upload.single('image'), createProduct);

router.get('/barcode/:barcode', protect, getProductByBarcode);

router.route('/:id')
  .get(protect, getProductById)
  .put(protect, upload.single('image'), updateProduct)
  .delete(protect, deleteProduct);

module.exports = router;
