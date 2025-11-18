import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../redux/slices/authSlice'
import toast from 'react-hot-toast'
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBBtn,
  MDBIcon
} from 'mdb-react-ui-kit'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (user) {
      navigate('/')
    }
    if (error) {
      toast.error(error)
    }
  }, [user, error, navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(register(formData))
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <MDBContainer>
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            <div className="animate-scale-in">
              <MDBCard className="shadow-lg border-0" style={{ borderRadius: '16px' }}>
                <MDBCardBody className="p-5">
                  {/* Business Name */}
                  <div className="text-center mb-4">
                    <h2 className="fw-bold text-primary mb-2">Harsh Kirana Store</h2>
                    <p className="text-muted">Inventory & Billing Management</p>
                  </div>

                  {/* Welcome Text */}
                  <div className="text-center mb-4">
                    <h4 className="fw-bold mb-2">Create Account</h4>
                    <p className="text-muted">Start managing your store today</p>
                  </div>

                  {/* Register Form */}
                  <form onSubmit={handleSubmit}>
                    <MDBInput
                      label="Full Name"
                      type="text"
                      size="lg"
                      className="mb-4"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    >
                      <MDBIcon fas icon="user" className="trailing" />
                    </MDBInput>

                    <MDBInput
                      label="Email Address"
                      type="email"
                      size="lg"
                      className="mb-4"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    >
                      <MDBIcon fas icon="envelope" className="trailing" />
                    </MDBInput>

                    <MDBInput
                      label="Password"
                      type="password"
                      size="lg"
                      className="mb-4"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    >
                      <MDBIcon fas icon="lock" className="trailing" />
                    </MDBInput>

                    <MDBBtn
                      type="submit"
                      color="primary"
                      size="lg"
                      className="w-100 mb-3 btn-premium"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Loading...
                        </>
                      ) : (
                        <>
                          Create Account
                          <MDBIcon fas icon="arrow-right" className="ms-2" />
                        </>
                      )}
                    </MDBBtn>
                  </form>

                  {/* Divider */}
                  <div className="text-center my-3">
                    <small className="text-muted">OR</small>
                  </div>

                  {/* Login Link */}
                  <div className="text-center">
                    <p className="text-muted mb-0">
                      Already have an account?{' '}
                      <Link to="/login" className="text-primary fw-semibold text-decoration-none">
                        Login Here
                      </Link>
                    </p>
                  </div>
                </MDBCardBody>
              </MDBCard>

              {/* Footer */}
              <p className="text-center mt-4 text-muted small">
                © 2024 Harsh Kirana Store. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </MDBContainer>
    </div>
  )
}

export default Register
