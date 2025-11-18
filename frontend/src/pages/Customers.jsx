import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCustomers, createCustomer } from '../redux/slices/customerSlice'
import toast from 'react-hot-toast'
import { FiPlus, FiSearch, FiUser } from 'react-icons/fi'
import {
  MDBCard,
  MDBCardBody,
  MDBBtn,
  MDBRow,
  MDBCol
} from 'mdb-react-ui-kit'

const Customers = () => {
  const dispatch = useDispatch()
  const { customers, loading } = useSelector((state) => state.customers)
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  })

  useEffect(() => {
    dispatch(fetchCustomers())
  }, [dispatch])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await dispatch(createCustomer(formData)).unwrap()
      toast.success('Customer added successfully')
      setShowModal(false)
      setFormData({ name: '', phone: '', email: '', address: '' })
    } catch (error) {
      toast.error(error || 'Failed to add customer')
    }
  }

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  )

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-2">Customers</h2>
          <p className="text-muted mb-0">Manage your customer database</p>
        </div>
        <MDBBtn color="primary" className="btn-premium" onClick={() => setShowModal(true)}>
          <FiPlus className="me-2" />
          Add Customer
        </MDBBtn>
      </div>

      {/* Search */}
      <MDBCard className="mb-4 premium-card">
        <MDBCardBody>
          <div className="input-group">
            <span className="input-group-text">
              <FiSearch />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </MDBCardBody>
      </MDBCard>

      {/* Customers Grid */}
      <MDBRow>
        {filteredCustomers.map((customer) => (
          <MDBCol md="6" lg="4" key={customer._id} className="mb-4">
            <MDBCard className="premium-card h-100">
              <MDBCardBody>
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '48px', height: '48px' }}>
                    <FiUser size={24} />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">{customer.name}</h5>
                    <p className="text-muted mb-0 small">{customer.phone}</p>
                  </div>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Total Purchases:</span>
                  <span className="fw-bold">₹{customer.totalPurchases?.toFixed(2) || 0}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Total Credit:</span>
                  <span className="fw-bold text-warning">₹{customer.totalCredit?.toFixed(2) || 0}</span>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        ))}
      </MDBRow>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Customer</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit} id="customerForm">
                  <div className="mb-3">
                    <label className="form-label">Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    ></textarea>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" form="customerForm" className="btn btn-primary">
                  Add Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Customers
