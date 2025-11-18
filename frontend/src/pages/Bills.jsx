import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBills } from '../redux/slices/billSlice'
import { fetchSettings } from '../redux/slices/settingsSlice'
import jsPDF from 'jspdf'
import toast from 'react-hot-toast'
import { FiDownload, FiSearch, FiFileText, FiImage } from 'react-icons/fi'
import {
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBadge
} from 'mdb-react-ui-kit'

const Bills = () => {
  const dispatch = useDispatch()
  const { bills, loading } = useSelector((state) => state.bills)
  const { settings } = useSelector((state) => state.settings)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    dispatch(fetchBills())
    dispatch(fetchSettings())
  }, [dispatch])

  const downloadBillPDF = (bill) => {
    try {
      const doc = new jsPDF()
      let yPos = 20

      // Shop Header
      doc.setFontSize(20)
      doc.setFont('helvetica', 'bold')
      doc.text(settings?.shopName || 'Kirana Shop', 105, yPos, { align: 'center' })
      yPos += 8

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      if (settings?.address) {
        doc.text(settings.address, 105, yPos, { align: 'center' })
        yPos += 5
      }
      doc.text(`GST: ${settings?.gstNumber || 'N/A'}`, 105, yPos, { align: 'center' })
      yPos += 5
      doc.text(`Phone: ${settings?.phone || 'N/A'}`, 105, yPos, { align: 'center' })
      yPos += 8

      // Line separator
      doc.setLineWidth(0.5)
      doc.line(15, yPos, 195, yPos)
      yPos += 10

      // Bill Details
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text(`Bill No: ${bill.billNumber}`, 15, yPos)
      doc.text(`Date: ${new Date(bill.createdAt).toLocaleDateString()}`, 15, yPos + 7)

      doc.text(`Customer: ${bill.customer?.name || 'Walk-in'}`, 120, yPos)
      doc.text(`Phone: ${bill.customer?.phone || 'N/A'}`, 120, yPos + 7)
      yPos += 20

      // Items Header
      doc.setFontSize(10)
      doc.setFillColor(25, 118, 210)
      doc.rect(15, yPos - 5, 180, 8, 'F')
      doc.setTextColor(255, 255, 255)
      doc.text('Product', 17, yPos)
      doc.text('Qty', 120, yPos)
      doc.text('Price', 145, yPos)
      doc.text('Total', 175, yPos)
      yPos += 8

      // Items
      doc.setTextColor(0, 0, 0)
      doc.setFont('helvetica', 'normal')
      bill.items.forEach((item, index) => {
        if (yPos > 270) {
          doc.addPage()
          yPos = 20
        }

        // Alternate row background
        if (index % 2 === 0) {
          doc.setFillColor(245, 245, 245)
          doc.rect(15, yPos - 5, 180, 7, 'F')
        }

        doc.text(item.name.substring(0, 30), 17, yPos)
        doc.text(item.quantity.toString(), 120, yPos)
        doc.text(`₹${item.price.toFixed(2)}`, 145, yPos)
        doc.text(`₹${item.total.toFixed(2)}`, 175, yPos)
        yPos += 7
      })

      yPos += 5
      doc.line(15, yPos, 195, yPos)
      yPos += 10

      // Totals
      doc.setFont('helvetica', 'normal')
      doc.text('Subtotal:', 140, yPos)
      doc.text(`₹${bill.subtotal.toFixed(2)}`, 175, yPos)
      yPos += 7

      doc.text('Tax:', 140, yPos)
      doc.text(`₹${bill.tax.toFixed(2)}`, 175, yPos)
      yPos += 7

      doc.text('Discount:', 140, yPos)
      doc.text(`₹${bill.discount.toFixed(2)}`, 175, yPos)
      yPos += 10

      // Grand Total
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(14)
      doc.text('Grand Total:', 140, yPos)
      doc.text(`₹${bill.finalAmount.toFixed(2)}`, 175, yPos)
      yPos += 10

      // Payment Info
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text(`Payment Method: ${bill.paymentMethod.toUpperCase()}`, 15, yPos)
      
      if (bill.isCredit) {
        yPos += 7
        doc.setTextColor(211, 47, 47)
        doc.setFont('helvetica', 'bold')
        doc.text('CREDIT SALE', 15, yPos)
        doc.setTextColor(0, 0, 0)
      }

      // Footer
      doc.setFont('helvetica', 'italic')
      doc.setFontSize(9)
      doc.text('Thank you for your business!', 105, 285, { align: 'center' })

      doc.save(`Bill-${bill.billNumber}.pdf`)
      toast.success('PDF downloaded successfully')
    } catch (error) {
      console.error(error)
      toast.error('Failed to download PDF')
    }
  }

  const printBill = (bill) => {
    const printWindow = window.open('', '', 'width=800,height=600')
    printWindow.document.write(`
      <html>
        <head>
          <title>Bill - ${bill.billNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
            .header h1 { margin: 0; font-size: 24px; }
            .header p { margin: 5px 0; font-size: 12px; }
            .details { display: flex; justify-content: space-between; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th { background: #1976d2; color: white; padding: 10px; text-align: left; }
            td { padding: 8px; border-bottom: 1px solid #ddd; }
            tr:nth-child(even) { background: #f9f9f9; }
            .totals { margin-left: auto; width: 300px; }
            .totals div { display: flex; justify-content: space-between; padding: 5px 0; }
            .grand-total { font-size: 18px; font-weight: bold; border-top: 2px solid #333; padding-top: 10px; }
            .footer { text-align: center; margin-top: 40px; font-style: italic; }
            @media print {
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${settings?.shopName || 'Kirana Shop'}</h1>
            <p>${settings?.address || ''}</p>
            <p>GST: ${settings?.gstNumber || 'N/A'} | Phone: ${settings?.phone || 'N/A'}</p>
          </div>
          
          <div class="details">
            <div>
              <p><strong>Bill No:</strong> ${bill.billNumber}</p>
              <p><strong>Date:</strong> ${new Date(bill.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p><strong>Customer:</strong> ${bill.customer?.name || 'Walk-in'}</p>
              <p><strong>Phone:</strong> ${bill.customer?.phone || 'N/A'}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${bill.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>₹${item.price.toFixed(2)}</td>
                  <td>₹${item.total.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals">
            <div><span>Subtotal:</span><span>₹${bill.subtotal.toFixed(2)}</span></div>
            <div><span>Tax:</span><span>₹${bill.tax.toFixed(2)}</span></div>
            <div><span>Discount:</span><span>₹${bill.discount.toFixed(2)}</span></div>
            <div class="grand-total"><span>Grand Total:</span><span>₹${bill.finalAmount.toFixed(2)}</span></div>
          </div>

          <p><strong>Payment Method:</strong> ${bill.paymentMethod.toUpperCase()}</p>
          ${bill.isCredit ? '<p style="color: red; font-weight: bold;">CREDIT SALE</p>' : ''}

          <div class="footer">
            <p>Thank you for your business!</p>
          </div>

          <div style="text-align: center; margin-top: 20px;">
            <button onclick="window.print()" style="padding: 10px 20px; font-size: 16px; cursor: pointer;">Print</button>
            <button onclick="window.close()" style="padding: 10px 20px; font-size: 16px; cursor: pointer; margin-left: 10px;">Close</button>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  const filteredBills = bills.filter((bill) =>
    bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.customer?.phone?.includes(searchTerm)
  )

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="mb-3 mb-md-4">
        <h2 className="fw-bold mb-2" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>All Bills</h2>
        <p className="text-muted mb-0" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>View and manage all transactions</p>
      </div>

      {/* Search */}
      <MDBCard className="mb-3 mb-md-4 premium-card">
        <MDBCardBody className="p-2 p-md-3">
          <div className="input-group input-group-sm input-group-md">
            <span className="input-group-text">
              <FiSearch />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search bills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </MDBCardBody>
      </MDBCard>

      {/* Bills Table */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <MDBCard className="premium-card">
          <MDBCardBody>
            <div className="table-responsive">
              <MDBTable hover>
                <MDBTableHead>
                  <tr>
                    <th>Bill Number</th>
                    <th>Customer</th>
                    <th className="d-none d-md-table-cell">Phone</th>
                    <th>Amount</th>
                    <th className="d-none d-lg-table-cell">Payment</th>
                    <th className="d-none d-md-table-cell">Date</th>
                    <th>Actions</th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody>
                  {filteredBills.map((bill) => (
                    <tr key={bill._id}>
                      <td data-label="Bill Number" className="fw-bold">{bill.billNumber}</td>
                      <td data-label="Customer">{bill.customer?.name || 'Walk-in'}</td>
                      <td data-label="Phone" className="d-none d-md-table-cell">{bill.customer?.phone || '-'}</td>
                      <td data-label="Amount" className="fw-bold">₹{bill.finalAmount.toFixed(2)}</td>
                      <td data-label="Payment" className="d-none d-lg-table-cell">
                        <MDBBadge color={bill.isCredit ? 'warning' : 'success'}>
                          {bill.isCredit ? 'Credit' : bill.paymentMethod}
                        </MDBBadge>
                      </td>
                      <td data-label="Date" className="d-none d-md-table-cell">{new Date(bill.createdAt).toLocaleDateString()}</td>
                      <td data-label="Actions">
                        <div className="d-flex flex-column flex-md-row gap-1">
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => downloadBillPDF(bill)}
                            title="Download PDF"
                          >
                            <FiDownload className="me-1" />
                            <span className="d-none d-md-inline">PDF</span>
                          </button>
                          <button 
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => printBill(bill)}
                            title="Print Bill"
                          >
                            <FiFileText className="me-1" />
                            <span className="d-none d-md-inline">Print</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </MDBTableBody>
              </MDBTable>
            </div>
          </MDBCardBody>
        </MDBCard>
      )}
    </div>
  )
}

export default Bills
