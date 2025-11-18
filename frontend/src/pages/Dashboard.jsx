import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDashboardStats } from '../redux/slices/dashboardSlice'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import {
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBBadge,
  MDBTable,
  MDBTableHead,
  MDBTableBody
} from 'mdb-react-ui-kit'

const Dashboard = () => {
  const dispatch = useDispatch()
  const { stats, loading } = useSelector((state) => state.dashboard)

  useEffect(() => {
    dispatch(fetchDashboardStats())
  }, [dispatch])

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="mb-3 mb-md-4">
        <h2 className="fw-bold mb-2" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>Dashboard</h2>
        <p className="text-muted mb-0" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>Welcome back! Here's what's happening with your store today.</p>
      </div>

      {/* Stats Cards */}
      <MDBRow className="mb-3 mb-md-4 stats-grid">
        <MDBCol xs="6" md="6" lg="3" className="mb-3 mb-md-4">
          <MDBCard className="stats-card bg-primary text-white">
            <MDBCardBody className="p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="mb-1 opacity-75" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>Total Products</p>
                  <h3 className="fw-bold mb-0" style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)' }}>{stats?.totalProducts || 0}</h3>
                </div>
                <MDBIcon fas icon="box" className="opacity-50 d-none d-md-block" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }} />
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        <MDBCol xs="6" md="6" lg="3" className="mb-3 mb-md-4">
          <MDBCard className="stats-card bg-warning text-white">
            <MDBCardBody className="p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="mb-1 opacity-75" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>Low Stock Items</p>
                  <h3 className="fw-bold mb-0" style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)' }}>{stats?.lowStockCount || 0}</h3>
                </div>
                <MDBIcon fas icon="exclamation-triangle" className="opacity-50 d-none d-md-block" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }} />
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        <MDBCol xs="6" md="6" lg="3" className="mb-3 mb-md-4">
          <MDBCard className="stats-card bg-success text-white">
            <MDBCardBody className="p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="mb-1 opacity-75" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>Today's Sales</p>
                  <h3 className="fw-bold mb-0" style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)' }}>₹{stats?.todaySales?.toFixed(2) || 0}</h3>
                </div>
                <MDBIcon fas icon="dollar-sign" className="opacity-50 d-none d-md-block" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }} />
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        <MDBCol xs="6" md="6" lg="3" className="mb-3 mb-md-4">
          <MDBCard className="stats-card bg-info text-white">
            <MDBCardBody className="p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="mb-1 opacity-75" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>Monthly Sales</p>
                  <h3 className="fw-bold mb-0" style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)' }}>₹{stats?.monthlySales?.toFixed(2) || 0}</h3>
                </div>
                <MDBIcon fas icon="chart-line" className="opacity-50 d-none d-md-block" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }} />
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>

      {/* Sales Chart */}
      <MDBCard className="mb-3 mb-md-4 premium-card">
        <MDBCardBody className="p-2 p-md-3">
          <div className="d-flex justify-content-between align-items-center mb-3 mb-md-4">
            <div>
              <h5 className="fw-bold mb-1" style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}>Sales Analytics</h5>
              <p className="text-muted mb-0 small" style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)' }}>Last 30 days performance</p>
            </div>
            <MDBBadge color="primary" pill style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)' }}>Live</MDBBadge>
          </div>
          <ResponsiveContainer width="100%" height={window.innerWidth < 768 ? 250 : 350}>
            <AreaChart data={stats?.salesChart || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
              <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#1976d2"
                strokeWidth={3}
                fill="#1976d2"
                fillOpacity={0.1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </MDBCardBody>
      </MDBCard>

      <MDBRow>
        {/* Low Stock Alert */}
        <MDBCol lg="6" className="mb-4">
          <MDBCard className="premium-card h-100">
            <MDBCardBody>
              <div className="d-flex align-items-center mb-4">
                <div className="bg-warning bg-opacity-10 text-warning rounded-3 p-3 me-3">
                  <MDBIcon fas icon="exclamation-triangle" size="lg" />
                </div>
                <div>
                  <h5 className="fw-bold mb-1">Low Stock Alert</h5>
                  <p className="text-muted mb-0 small">Items need restocking</p>
                </div>
              </div>
              <div className="table-responsive">
                <MDBTable hover className="mb-0">
                  <MDBTableHead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th className="text-end">Stock</th>
                    </tr>
                  </MDBTableHead>
                  <MDBTableBody>
                    {stats?.lowStockProducts?.slice(0, 5).map((product) => (
                      <tr key={product._id}>
                        <td className="fw-semibold">{product.name}</td>
                        <td><MDBBadge color="light" className="text-dark">{product.category}</MDBBadge></td>
                        <td className="text-end">
                          <span className="fw-bold text-warning">{product.stock} {product.unit}</span>
                        </td>
                      </tr>
                    ))}
                  </MDBTableBody>
                </MDBTable>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        {/* Best Selling */}
        <MDBCol lg="6" className="mb-4">
          <MDBCard className="premium-card h-100">
            <MDBCardBody>
              <div className="d-flex align-items-center mb-4">
                <div className="bg-success bg-opacity-10 text-success rounded-3 p-3 me-3">
                  <MDBIcon fas icon="chart-line" size="lg" />
                </div>
                <div>
                  <h5 className="fw-bold mb-1">Best Sellers</h5>
                  <p className="text-muted mb-0 small">Top performing products</p>
                </div>
              </div>
              <div className="table-responsive">
                <MDBTable hover className="mb-0">
                  <MDBTableHead>
                    <tr>
                      <th>Rank</th>
                      <th>Product</th>
                      <th className="text-end">Revenue</th>
                    </tr>
                  </MDBTableHead>
                  <MDBTableBody>
                    {stats?.bestSelling?.map((item, index) => (
                      <tr key={item.product._id}>
                        <td>
                          <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center fw-bold" style={{ width: '32px', height: '32px' }}>
                            {index + 1}
                          </div>
                        </td>
                        <td>
                          <div className="fw-semibold">{item.product.name}</div>
                          <small className="text-muted">{item.totalQuantity} sold</small>
                        </td>
                        <td className="text-end fw-bold text-success">₹{item.totalRevenue.toFixed(2)}</td>
                      </tr>
                    ))}
                  </MDBTableBody>
                </MDBTable>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>

      {/* Additional Stats */}
      <MDBRow>
        <MDBCol md="4" className="mb-4">
          <MDBCard className="stats-card" style={{ backgroundColor: '#0288d1' }}>
            <MDBCardBody className="text-white">
              <MDBIcon fas icon="users" size="3x" className="mb-3 opacity-75" />
              <p className="mb-1 opacity-75">Total Customers</p>
              <h3 className="fw-bold mb-0">{stats?.totalCustomers || 0}</h3>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        <MDBCol md="4" className="mb-4">
          <MDBCard className="stats-card bg-warning">
            <MDBCardBody className="text-white">
              <MDBIcon fas icon="credit-card" size="3x" className="mb-3 opacity-75" />
              <p className="mb-1 opacity-75">Pending Credits</p>
              <h3 className="fw-bold mb-0">₹{stats?.totalPendingCredit?.toFixed(2) || 0}</h3>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        <MDBCol md="4" className="mb-4">
          <MDBCard className="stats-card" style={{ backgroundColor: '#9c27b0' }}>
            <MDBCardBody className="text-white">
              <MDBIcon fas icon="box" size="3x" className="mb-3 opacity-75" />
              <p className="mb-1 opacity-75">Categories</p>
              <h3 className="fw-bold mb-0">8+</h3>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </div>
  )
}

export default Dashboard
