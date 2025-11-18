import { useState } from 'react'
import { FiPercent, FiRefreshCw, FiCopy, FiCheck } from 'react-icons/fi'
import {
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBBadge,
  MDBIcon
} from 'mdb-react-ui-kit'
import toast from 'react-hot-toast'

const GSTCalculator = () => {
  const [calculationType, setCalculationType] = useState('exclusive') // exclusive or inclusive
  const [amount, setAmount] = useState('')
  const [gstRate, setGstRate] = useState('18')
  const [results, setResults] = useState(null)
  const [copied, setCopied] = useState(false)

  const gstRates = [
    { value: '0', label: '0%' },
    { value: '0.25', label: '0.25%' },
    { value: '3', label: '3%' },
    { value: '5', label: '5%' },
    { value: '12', label: '12%' },
    { value: '18', label: '18%' },
    { value: '28', label: '28%' }
  ]

  const calculateGST = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    const baseAmount = parseFloat(amount)
    const rate = parseFloat(gstRate)

    let result = {}

    if (calculationType === 'exclusive') {
      // GST Exclusive (Add GST to amount)
      const gstAmount = (baseAmount * rate) / 100
      const cgst = gstAmount / 2
      const sgst = gstAmount / 2
      const totalAmount = baseAmount + gstAmount

      result = {
        originalAmount: baseAmount,
        gstRate: rate,
        cgst: cgst,
        sgst: sgst,
        igst: gstAmount,
        totalGST: gstAmount,
        finalAmount: totalAmount
      }
    } else {
      // GST Inclusive (Remove GST from amount)
      const totalAmount = baseAmount
      const originalAmount = (baseAmount * 100) / (100 + rate)
      const gstAmount = totalAmount - originalAmount
      const cgst = gstAmount / 2
      const sgst = gstAmount / 2

      result = {
        originalAmount: originalAmount,
        gstRate: rate,
        cgst: cgst,
        sgst: sgst,
        igst: gstAmount,
        totalGST: gstAmount,
        finalAmount: totalAmount
      }
    }

    setResults(result)
  }

  const resetCalculator = () => {
    setAmount('')
    setGstRate('18')
    setResults(null)
    setCalculationType('exclusive')
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="mb-3 mb-md-4">
        <div className="d-flex align-items-center mb-2">
          <div className="bg-primary text-white rounded-3 p-2 me-3">
            <MDBIcon fas icon="calculator" size="2x" />
          </div>
          <div>
            <h2 className="fw-bold mb-0" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>GST Calculator</h2>
          </div>
        </div>
        <p className="text-muted mb-0" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
          Calculate GST inclusive and exclusive amounts easily
        </p>
      </div>

      <MDBRow>
        {/* Calculator Input Section */}
        <MDBCol lg="5" className="mb-3 mb-lg-4">
          <MDBCard className="premium-card h-100">
            <MDBCardBody className="p-3 p-md-4">
              <h5 className="fw-bold mb-4" style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}>
                <MDBIcon fas icon="calculator" className="me-2" />
                Calculate GST
              </h5>

              {/* Calculation Type Toggle */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Calculation Type</label>
                <div className="btn-group w-100" role="group">
                  <button
                    type="button"
                    className={`btn ${calculationType === 'exclusive' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setCalculationType('exclusive')}
                  >
                    GST Exclusive
                  </button>
                  <button
                    type="button"
                    className={`btn ${calculationType === 'inclusive' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setCalculationType('inclusive')}
                  >
                    GST Inclusive
                  </button>
                </div>
                <small className="text-muted d-block mt-2">
                  {calculationType === 'exclusive' 
                    ? 'Add GST to the amount' 
                    : 'Remove GST from the amount'}
                </small>
              </div>

              {/* Amount Input */}
              <div className="mb-4">
                <label className="form-label fw-semibold">
                  {calculationType === 'exclusive' ? 'Amount (Excluding GST)' : 'Amount (Including GST)'}
                </label>
                <div className="input-group input-group-lg">
                  <span className="input-group-text">₹</span>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && calculateGST()}
                  />
                </div>
              </div>

              {/* GST Rate Selection */}
              <div className="mb-4">
                <label className="form-label fw-semibold">GST Rate</label>
                <div className="row g-2">
                  {gstRates.map((rate) => (
                    <div key={rate.value} className="col-4 col-md-3">
                      <button
                        type="button"
                        className={`btn w-100 ${gstRate === rate.value ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setGstRate(rate.value)}
                      >
                        {rate.label}
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-3">
                  <label className="form-label small">Custom Rate (%)</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter custom rate"
                    value={gstRate}
                    onChange={(e) => setGstRate(e.target.value)}
                    step="0.01"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex gap-2">
                <MDBBtn
                  color="primary"
                  className="flex-fill btn-premium"
                  size="lg"
                  onClick={calculateGST}
                >
                  <MDBIcon fas icon="calculator" className="me-2" />
                  Calculate
                </MDBBtn>
                <MDBBtn
                  color="light"
                  className="btn-premium"
                  size="lg"
                  onClick={resetCalculator}
                >
                  <FiRefreshCw />
                </MDBBtn>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        {/* Results Section */}
        <MDBCol lg="7" className="mb-3 mb-lg-4">
          {results ? (
            <div className="animate-scale-in">
              {/* Summary Card */}
              <MDBCard className="premium-card mb-3">
                <MDBCardBody className="p-3 p-md-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold mb-0" style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}>
                      Calculation Results
                    </h5>
                    <MDBBadge color="success" className="px-3 py-2">
                      {results.gstRate}% GST
                    </MDBBadge>
                  </div>

                  <div className="bg-light rounded-3 p-3 p-md-4 mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted">
                        {calculationType === 'exclusive' ? 'Original Amount' : 'Amount (Excl. GST)'}
                      </span>
                      <span className="fw-semibold">{formatCurrency(results.originalAmount)}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted">Total GST ({results.gstRate}%)</span>
                      <span className="fw-semibold text-primary">{formatCurrency(results.totalGST)}</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold fs-5">Final Amount</span>
                      <span className="fw-bold fs-4 text-success">{formatCurrency(results.finalAmount)}</span>
                    </div>
                  </div>

                  <button
                    className="btn btn-outline-primary w-100"
                    onClick={() => copyToClipboard(results.finalAmount.toFixed(2))}
                  >
                    {copied ? <FiCheck className="me-2" /> : <FiCopy className="me-2" />}
                    {copied ? 'Copied!' : 'Copy Final Amount'}
                  </button>
                </MDBCardBody>
              </MDBCard>

              {/* GST Breakdown */}
              <MDBCard className="premium-card mb-3">
                <MDBCardBody className="p-3 p-md-4">
                  <h5 className="fw-bold mb-3" style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}>
                    GST Breakdown
                  </h5>

                  <MDBRow className="g-3">
                    <MDBCol xs="6" md="4">
                      <div className="text-center p-3 bg-light rounded-3">
                        <p className="text-muted small mb-1">CGST</p>
                        <p className="fw-bold mb-0 text-primary">{formatCurrency(results.cgst)}</p>
                        <small className="text-muted">{(results.gstRate / 2).toFixed(2)}%</small>
                      </div>
                    </MDBCol>
                    <MDBCol xs="6" md="4">
                      <div className="text-center p-3 bg-light rounded-3">
                        <p className="text-muted small mb-1">SGST</p>
                        <p className="fw-bold mb-0 text-primary">{formatCurrency(results.sgst)}</p>
                        <small className="text-muted">{(results.gstRate / 2).toFixed(2)}%</small>
                      </div>
                    </MDBCol>
                    <MDBCol xs="12" md="4">
                      <div className="text-center p-3 bg-light rounded-3">
                        <p className="text-muted small mb-1">IGST</p>
                        <p className="fw-bold mb-0 text-primary">{formatCurrency(results.igst)}</p>
                        <small className="text-muted">{results.gstRate}%</small>
                      </div>
                    </MDBCol>
                  </MDBRow>

                  <div className="alert alert-info mt-3 mb-0">
                    <small>
                      <strong>Note:</strong> CGST + SGST is used for intra-state transactions. 
                      IGST is used for inter-state transactions.
                    </small>
                  </div>
                </MDBCardBody>
              </MDBCard>

              {/* Detailed Breakdown Table */}
              <MDBCard className="premium-card">
                <MDBCardBody className="p-3 p-md-4">
                  <h5 className="fw-bold mb-3" style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}>
                    Detailed Breakdown
                  </h5>

                  <div className="table-responsive">
                    <table className="table table-borderless mb-0">
                      <tbody>
                        <tr className="border-bottom">
                          <td className="py-3">
                            <span className="fw-semibold">Base Amount</span>
                            <br />
                            <small className="text-muted">Amount before GST</small>
                          </td>
                          <td className="py-3 text-end fw-bold">{formatCurrency(results.originalAmount)}</td>
                        </tr>
                        <tr className="border-bottom">
                          <td className="py-3">
                            <span className="fw-semibold">GST Rate</span>
                            <br />
                            <small className="text-muted">Applied tax rate</small>
                          </td>
                          <td className="py-3 text-end fw-bold">{results.gstRate}%</td>
                        </tr>
                        <tr className="border-bottom">
                          <td className="py-3">
                            <span className="fw-semibold">GST Amount</span>
                            <br />
                            <small className="text-muted">Total tax amount</small>
                          </td>
                          <td className="py-3 text-end fw-bold text-primary">{formatCurrency(results.totalGST)}</td>
                        </tr>
                        <tr className="bg-light">
                          <td className="py-3">
                            <span className="fw-bold fs-5">Total Amount</span>
                            <br />
                            <small className="text-muted">Final payable amount</small>
                          </td>
                          <td className="py-3 text-end fw-bold fs-5 text-success">
                            {formatCurrency(results.finalAmount)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </div>
          ) : (
            <MDBCard className="premium-card h-100">
              <MDBCardBody className="d-flex flex-column align-items-center justify-content-center p-5 text-center">
                <div className="bg-light rounded-circle p-4 mb-3">
                  <MDBIcon fas icon="calculator" size="3x" className="text-muted" />
                </div>
                <h5 className="fw-bold mb-2">No Calculation Yet</h5>
                <p className="text-muted mb-0">
                  Enter an amount and GST rate, then click Calculate to see the results
                </p>
              </MDBCardBody>
            </MDBCard>
          )}
        </MDBCol>
      </MDBRow>

      {/* GST Rate Reference */}
      <MDBRow>
        <MDBCol lg="12">
          <MDBCard className="premium-card">
            <MDBCardBody className="p-3 p-md-4">
              <h5 className="fw-bold mb-3" style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}>
                GST Rate Reference Guide
              </h5>
              <MDBRow className="g-3">
                <MDBCol xs="6" md="4" lg="2">
                  <div className="text-center p-3 border rounded-3">
                    <MDBBadge color="secondary" className="mb-2">0%</MDBBadge>
                    <p className="small mb-0">Essential items, Education</p>
                  </div>
                </MDBCol>
                <MDBCol xs="6" md="4" lg="2">
                  <div className="text-center p-3 border rounded-3">
                    <MDBBadge color="info" className="mb-2">5%</MDBBadge>
                    <p className="small mb-0">Daily necessities, Food items</p>
                  </div>
                </MDBCol>
                <MDBCol xs="6" md="4" lg="2">
                  <div className="text-center p-3 border rounded-3">
                    <MDBBadge color="primary" className="mb-2">12%</MDBBadge>
                    <p className="small mb-0">Processed food, Computers</p>
                  </div>
                </MDBCol>
                <MDBCol xs="6" md="4" lg="2">
                  <div className="text-center p-3 border rounded-3">
                    <MDBBadge color="warning" className="mb-2">18%</MDBBadge>
                    <p className="small mb-0">Most goods & services</p>
                  </div>
                </MDBCol>
                <MDBCol xs="6" md="4" lg="2">
                  <div className="text-center p-3 border rounded-3">
                    <MDBBadge color="danger" className="mb-2">28%</MDBBadge>
                    <p className="small mb-0">Luxury items, Automobiles</p>
                  </div>
                </MDBCol>
                <MDBCol xs="6" md="4" lg="2">
                  <div className="text-center p-3 border rounded-3">
                    <MDBBadge color="dark" className="mb-2">Custom</MDBBadge>
                    <p className="small mb-0">Enter your own rate</p>
                  </div>
                </MDBCol>
              </MDBRow>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </div>
  )
}

export default GSTCalculator
