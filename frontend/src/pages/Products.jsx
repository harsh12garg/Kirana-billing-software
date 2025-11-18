import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../redux/slices/productSlice'
import toast from 'react-hot-toast'
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import {
  MDBCard,
  MDBCardBody,
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBadge
} from 'mdb-react-ui-kit'

const Products = () => {
  const dispatch = useDispatch()
  const { products, loading } = useSelector((state) => state.products)
  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentProduct, setCurrentProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    purchasePrice: '',
    sellingPrice: '',
    stock: '',
    unit: 'pcs',
    barcode: '',
    lowStockThreshold: '10',
    image: null,
  })

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = new FormData()
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) {
        data.append(key, formData[key])
      }
    })

    try {
      if (editMode) {
        await dispatch(updateProduct({ id: currentProduct._id, productData: data })).unwrap()
        toast.success('Product updated successfully')
      } else {
        await dispatch(createProduct(data)).unwrap()
        toast.success('Product added successfully')
      }
      resetForm()
    } catch (error) {
      toast.error(error || 'Something went wrong')
    }
  }

  const handleEdit = (product) => {
    setEditMode(true)
    setCurrentProduct(product)
    setFormData({
      name: product.name,
      category: product.category,
      purchasePrice: product.purchasePrice,
      sellingPrice: product.sellingPrice,
      stock: product.stock,
      unit: product.unit,
      barcode: product.barcode || '',
      lowStockThreshold: product.lowStockThreshold,
      image: null,
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await dispatch(deleteProduct(id)).unwrap()
        toast.success('Product deleted successfully')
      } catch (error) {
        toast.error(error || 'Failed to delete product')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      purchasePrice: '',
      sellingPrice: '',
      stock: '',
      unit: 'pcs',
      barcode: '',
      lowStockThreshold: '10',
      image: null,
    })
    setShowModal(false)
    setEditMode(false)
    setCurrentProduct(null)
  }

  // Get unique categories
  const categories = ['All', ...new Set(products.map(p => p.category))]

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = filteredProducts.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCategory])

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 mb-md-4 gap-2">
        <div>
          <h2 className="fw-bold mb-1 mb-md-2" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>Products</h2>
          <p className="text-muted mb-0" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>Manage your inventory</p>
        </div>
        <MDBBtn color="primary" className="btn-premium w-100 w-md-auto" onClick={() => setShowModal(true)}>
          <FiPlus className="me-2" />
          Add Product
        </MDBBtn>
      </div>

      {/* Search and Filter */}
      <MDBCard className="mb-3 mb-md-4 premium-card">
        <MDBCardBody className="p-2 p-md-3">
          <div className="row g-2 g-md-3">
            <div className="col-12 col-md-8">
              <div className="input-group input-group-sm input-group-md">
                <span className="input-group-text">
                  <FiSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-12 col-md-4">
              <select
                className="form-select form-select-sm form-select-md"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-3">
            <small className="text-muted">
              Showing {currentProducts.length} of {filteredProducts.length} products
            </small>
          </div>
        </MDBCardBody>
      </MDBCard>

      {/* Products Table */}
      <MDBCard className="premium-card">
        <MDBCardBody>
          <div className="table-responsive">
            <MDBTable hover>
              <MDBTableHead>
                <tr>
                  <th>Name</th>
                  <th className="d-none d-md-table-cell">Category</th>
                  <th className="d-none d-lg-table-cell">Purchase Price</th>
                  <th>Selling Price</th>
                  <th>Stock</th>
                  <th className="d-none d-md-table-cell">Unit</th>
                  <th>Actions</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {currentProducts.length > 0 ? (
                  currentProducts.map((product) => (
                    <tr key={product._id}>
                      <td data-label="Name" className="fw-semibold">{product.name}</td>
                      <td data-label="Category" className="d-none d-md-table-cell">
                        <MDBBadge color="primary" light>
                          {product.category}
                        </MDBBadge>
                      </td>
                      <td data-label="Purchase Price" className="d-none d-lg-table-cell">₹{product.purchasePrice}</td>
                      <td data-label="Selling Price" className="fw-bold text-success">₹{product.sellingPrice}</td>
                      <td data-label="Stock">
                        <span className={product.stock <= product.lowStockThreshold ? 'fw-bold text-warning' : ''}>
                          {product.stock}
                        </span>
                      </td>
                      <td data-label="Unit" className="d-none d-md-table-cell">{product.unit}</td>
                      <td data-label="Actions">
                        <div className="d-flex flex-column flex-md-row gap-1">
                          <button
                            className="btn btn-info btn-sm"
                            onClick={() => handleEdit(product)}
                            title="Edit Product"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(product._id)}
                            title="Delete Product"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      <p className="text-muted mb-0">No products found</p>
                    </td>
                  </tr>
                )}
              </MDBTableBody>
            </MDBTable>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <nav>
                <ul className="pagination">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <FiChevronLeft />
                    </button>
                  </li>
                  {[...Array(totalPages)].map((_, index) => (
                    <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(index + 1)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <FiChevronRight />
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </MDBCardBody>
      </MDBCard>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}>{editMode ? 'Edit Product' : 'Add Product'}</h5>
                <button type="button" className="btn-close" onClick={resetForm}></button>
              </div>
              <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                <form onSubmit={handleSubmit} id="productForm">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Product Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Category *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Purchase Price *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.purchasePrice}
                        onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Selling Price *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.sellingPrice}
                        onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Stock *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Unit *</label>
                      <select
                        className="form-select"
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      >
                        <option value="pcs">Pieces</option>
                        <option value="kg">Kilogram</option>
                        <option value="ltr">Liter</option>
                        <option value="box">Box</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Barcode</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.barcode}
                        onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Low Stock Alert</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.lowStockThreshold}
                        onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                      />
                    </div>
                    <div className="col-md-12 mb-3">
                      <label className="form-label">Product Image</label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                      />
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" form="productForm" className="btn btn-primary">
                  {editMode ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Products
