import { useState, useEffect } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../redux/slices/authSlice'
import { toggleTheme } from '../redux/slices/themeSlice'
import { 
  MDBContainer, 
  MDBNavbar, 
  MDBNavbarBrand, 
  MDBNavbarToggler,
  MDBIcon,
  MDBBtn
} from 'mdb-react-ui-kit'

const Layout = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const { theme } = useSelector((state) => state.theme)
  const { user } = useSelector((state) => state.auth)
  const [showSidebar, setShowSidebar] = useState(false)

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  }, [theme])

  const handleLogout = () => {
    dispatch(logout())
  }

  const navItems = [
    { path: '/', icon: 'dashboard', label: 'Dashboard', color: '#1976d2' },
    { path: '/products', icon: 'inventory_2', label: 'Products', color: '#9c27b0' },
    { path: '/pos', icon: 'shopping_cart', label: 'POS', color: '#2e7d32' },
    { path: '/bills', icon: 'receipt_long', label: 'Bills', color: '#ed6c02' },
    { path: '/credits', icon: 'credit_card', label: 'Credits', color: '#d32f2f' },
    { path: '/customers', icon: 'people', label: 'Customers', color: '#0288d1' },
    { path: '/gst-calculator', icon: 'calculate', label: 'GST Calculator', color: '#00897b' },
    { path: '/settings', icon: 'settings', label: 'Settings', color: '#616161' },
  ]

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className={`sidebar ${showSidebar ? 'show' : ''}`}>
        {/* Business Name Section */}
        <div className="p-3 p-md-4 border-bottom">
          <div className="mb-3">
            <h5 className="mb-1 fw-bold text-primary" style={{ fontSize: 'clamp(0.9rem, 2vw, 1.1rem)' }}>Inventory and Billing Software</h5>
            <p className="mb-0 text-muted small">Business Management</p>
          </div>
          <div className="bg-light rounded-3 p-2 p-md-3">
            <p className="mb-1 fw-semibold small text-truncate">{user?.name}</p>
            <p className="mb-0 text-muted text-truncate" style={{ fontSize: '12px' }}>{user?.email}</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="py-3">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                style={isActive ? { backgroundColor: item.color } : {}}
                onClick={() => setShowSidebar(false)}
              >
                <i className="material-icons">{item.icon}</i>
                <span className="fw-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>

        {/* Bottom Actions */}
        <div className="p-3 border-top mt-auto">
          <MDBBtn
            color="light"
            className="w-100 mb-2"
            onClick={() => dispatch(toggleTheme())}
          >
            <MDBIcon fas icon={theme === 'light' ? 'moon' : 'sun'} className="me-2" />
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </MDBBtn>
          <MDBBtn
            color="danger"
            className="w-100"
            onClick={handleLogout}
          >
            <MDBIcon fas icon="sign-out-alt" className="me-2" />
            Logout
          </MDBBtn>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content flex-grow-1">
        {/* Mobile Navbar */}
        <div className="d-lg-none mb-3 mobile-navbar">
          <div className="d-flex align-items-center justify-content-between p-3 bg-white shadow-sm" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
            {/* Hamburger Menu Button */}
            <button
              className="btn btn-link text-dark p-0 mobile-menu-btn"
              onClick={() => setShowSidebar(!showSidebar)}
              aria-label="Toggle menu"
              style={{ fontSize: '24px', textDecoration: 'none' }}
            >
              <MDBIcon fas icon="bars" />
            </button>

            {/* Brand Name */}
            <span className="fw-bold text-primary" style={{ fontSize: '14px' }}>
              Inventory & Billing
            </span>

            {/* Dark Mode Toggle Button */}
            <button
              className="btn btn-link text-dark p-0 mobile-theme-btn"
              onClick={() => dispatch(toggleTheme())}
              aria-label="Toggle theme"
              style={{ fontSize: '20px', textDecoration: 'none' }}
            >
              <MDBIcon fas icon={theme === 'light' ? 'moon' : 'sun'} />
            </button>
          </div>
        </div>

        {/* Page Content */}
        <MDBContainer fluid className="animate-fade-in">
          <Outlet />
        </MDBContainer>
      </div>

      {/* Overlay for mobile */}
      {showSidebar && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-lg-none"
          style={{ zIndex: 999 }}
          onClick={() => setShowSidebar(false)}
        />
      )}
    </div>
  )
}

export default Layout
