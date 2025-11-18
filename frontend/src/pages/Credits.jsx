import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCredits, markAsPaid } from '../redux/slices/creditSlice'
import toast from 'react-hot-toast'
import { FiCreditCard, FiCheckCircle } from 'react-icons/fi'
import {
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBadge,
  MDBRow,
  MDBCol
} from 'mdb-react-ui-kit'

const Credits = () => {
  const dispatch = useDispatch()
  const { credits, loading } = useSelector((state) => state.credits)

  useEffect(() => {
    dispatch(fetchCredits())
  }, [dispatch])

  const handleMarkPaid = async (id) => {
    if (window.confirm('Mark this credit as paid?')) {
      try {
        await dispatch(markAsPaid(id)).unwrap()
        toast.success('Credit marked as paid')
      } catch (error) {
        toast.error(error || 'Failed to update credit')
      }
    }
  }

  const pendingCredits = credits.filter((c) => !c.isPaid)
  const paidCredits = credits.filter((c) => c.isPaid)
  const totalPending = pendingCredits.reduce((sum, c) => sum + c.amount, 0)

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="mb-4">
        <h2 className="fw-bold mb-2">Credit Management (Udhar)</h2>
        <p className="text-muted mb-0">Track and manage customer credits</p>
      </div>

      {/* Stats */}
      <MDBRow className="mb-4">
        <MDBCol md="4">
          <MDBCard className="stats-card bg-warning text-white">
            <MDBCardBody>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="mb-1 opacity-75">Total Pending</p>
                  <h3 className="fw-bold mb-0">₹{totalPending.toFixed(2)}</h3>
                  <small className="opacity-75">{pendingCredits.length} pending credits</small>
                </div>
                <MDBIcon fas icon="credit-card" size="3x" className="opacity-50" />
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>

      {/* Pending Credits */}
      <MDBCard className="mb-4 premium-card">
        <MDBCardBody>
          <h5 className="fw-bold mb-4">Pending Credits</h5>
          <div className="table-responsive">
            <MDBTable hover>
              <MDBTableHead>
                <tr>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {pendingCredits.map((credit) => {
                  const dueDate = new Date(credit.dueDate)
                  const today = new Date()
                  const daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24))

                  return (
                    <tr key={credit._id}>
                      <td className="fw-semibold">{credit.customer?.name}</td>
                      <td>{credit.customer?.phone}</td>
                      <td className="fw-bold text-warning">₹{credit.amount.toFixed(2)}</td>
                      <td>{credit.dueDate ? new Date(credit.dueDate).toLocaleDateString() : '-'}</td>
                      <td>
                        {daysOverdue > 0 ? (
                          <MDBBadge color="danger">{daysOverdue} days overdue</MDBBadge>
                        ) : (
                          <MDBBadge color="success">On time</MDBBadge>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleMarkPaid(credit._id)}
                        >
                          <FiCheckCircle className="me-1" />
                          Mark Paid
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </MDBTableBody>
            </MDBTable>
          </div>
        </MDBCardBody>
      </MDBCard>

      {/* Paid Credits */}
      <MDBCard className="premium-card">
        <MDBCardBody>
          <h5 className="fw-bold mb-4">Paid Credits</h5>
          <div className="table-responsive">
            <MDBTable hover>
              <MDBTableHead>
                <tr>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Amount</th>
                  <th>Paid Date</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {paidCredits.map((credit) => (
                  <tr key={credit._id}>
                    <td className="fw-semibold">{credit.customer?.name}</td>
                    <td>{credit.customer?.phone}</td>
                    <td className="fw-bold">₹{credit.amount.toFixed(2)}</td>
                    <td>{credit.paidDate ? new Date(credit.paidDate).toLocaleDateString() : '-'}</td>
                  </tr>
                ))}
              </MDBTableBody>
            </MDBTable>
          </div>
        </MDBCardBody>
      </MDBCard>
    </div>
  )
}

export default Credits
