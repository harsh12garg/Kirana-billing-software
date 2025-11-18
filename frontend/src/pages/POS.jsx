import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../redux/slices/productSlice'
import { createBill } from '../redux/slices/billSlice'
import { fetchSettings } from '../redux/slices/settingsSlice'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'
import { FiSearch, FiPlus, FiMinus, FiTrash2, FiCheck, FiDownload, FiChevronLeft, FiChevronRight, FiPackage, FiPrinter } from 'react-icons/fi'
import {
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
  MDBBadge
} from 'mdb-react-ui-kit'

const POS = () => {
  const dispatch = useDispatch()
  const { products } = useSelector((state) => state.products)
  const { settings } = useSelector((state) => state.settings)
  const [cart, setCart] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12
  const [customer, setCustomer] = useState({ name: '', phone: '' })
  const [discount, setDiscount] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [isCredit, setIsCredit] = useState(false)
  const [lastBill, setLastBill] = useState(null)

  useEffect(() => {
    dispatch(fetchProducts())
    dispatch(fetchSettings())
  }, [dispatch])

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item._id === product._id)
    if (existingItem) {
      setCart(cart.map((item) =>
        item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
      ))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      setCart(cart.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      ))
    }
  }

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item._id !== productId))
  }

  const subtotal = cart.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0)
  const taxRate = settings?.taxRate || 0
  const tax = (subtotal * taxRate) / 100
  const finalAmount = subtotal + tax - discount

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error('Cart is empty')
      return
    }

    if (!customer.name.trim()) {
      toast.error('Customer name is required')
      return
    }

    if (!customer.phone.trim()) {
      toast.error('Customer phone is required')
      return
    }

    const billData = {
      customer,
      items: cart.map((item) => ({
        product: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.sellingPrice,
        total: item.sellingPrice * item.quantity,
      })),
      subtotal,
      tax,
      discount,
      finalAmount,
      paymentMethod,
      isCredit,
    }

    try {
      const result = await dispatch(createBill(billData)).unwrap()
      setLastBill(result)
      toast.success('Bill created successfully')
      setCart([])
      setCustomer({ name: '', phone: '' })
      setDiscount(0)
      setIsCredit(false)
    } catch (error) {
      toast.error(error || 'Failed to create bill')
    }
  }

  const downloadPDF = () => {
    if (!lastBill) return
    
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
      yPos += 10

      doc.line(15, yPos, 195, yPos)
      yPos += 10

      // Bill Details
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text(`Bill: ${lastBill.billNumber}`, 15, yPos)
      doc.text(`Customer: ${lastBill.customer.name}`, 15, yPos + 7)
      doc.text(`Phone: ${lastBill.customer.phone}`, 15, yPos + 14)
      yPos += 25

      // Items
      doc.setFontSize(10)
      lastBill.items.forEach((item) => {
        doc.setFont('helvetica', 'normal')
        doc.text(`${item.name}`, 15, yPos)
        doc.text(`${item.quantity} x ₹${item.price}`, 120, yPos)
        doc.text(`₹${item.total}`, 170, yPos)
        yPos += 7
      })

      yPos += 5
      doc.line(15, yPos, 195, yPos)
      yPos += 10

      // Totals
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(14)
      doc.text(`Total: ₹${lastBill.finalAmount.toFixed(2)}`, 15, yPos)

      doc.save(`Bill-${lastBill.billNumber}.pdf`)
      toast.success('PDF downloaded')
    } catch (error) {
      toast.error('Failed to download PDF')
    }
  }

  const printBill = () => {
    if (!lastBill) return

    const printWindow = window.open('', '', 'width=300,height=600')
    printWindow.document.write(`
      <html>
        <head>
          <title>Bill - ${lastBill.billNumber}</title>
          <style>
            body { font-family: monospace; width: 280px; margin: 0; padding: 10px; }
            .center { text-align: center; }
            .bold { font-weight: bold; }
            .line { border-top: 1px dashed #000; margin: 10px 0; }
            table { width: 100%; }
            td { padding: 2px 0; }
            .right { text-align: right; }
            @media print {
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="center bold" style="font-size: 16px;">${settings?.shopName || 'Kirana Shop'}</div>
          <div class="center" style="font-size: 10px;">${settings?.address || ''}</div>
          <div class="center" style="font-size: 10px;">GST: ${settings?.gstNumber || 'N/A'}</div>
          <div class="center" style="font-size: 10px;">Ph: ${settings?.phone || 'N/A'}</div>
          <div class="line"></div>
          
          <div><strong>Bill:</strong> ${lastBill.billNumber}</div>
          <div><strong>Date:</strong> ${new Date(lastBill.createdAt).toLocaleString()}</div>
          <div><strong>Customer:</strong> ${lastBill.customer.name}</div>
          <div><strong>Phone:</strong> ${lastBill.customer.phone}</div>
          <div class="line"></div>

          <table>
            ${lastBill.items.map(item => `
              <tr>
                <td>${item.name}</td>
                <td class="right">${item.quantity}x${item.price}</td>
                <td class="right">₹${item.total.toFixed(2)}</td>
              </tr>
            `).join('')}
          </table>
          
          <div class="line"></div>
          <table>
            <tr><td>Subtotal:</td><td class="right">₹${lastBill.subtotal.toFixed(2)}</td></tr>
            <tr><td>Tax:</td><td class="right">₹${lastBill.tax.toFixed(2)}</td></tr>
            <tr><td>Discount:</td><td class="right">₹${lastBill.discount.toFixed(2)}</td></tr>
            <tr class="bold"><td>Total:</td><td class="right">₹${lastBill.finalAmount.toFixed(2)}</td></tr>
          </table>
          
          <div class="line"></div>
          <div><strong>Payment:</strong> ${lastBill.paymentMethod.toUpperCase()}</div>
          ${lastBill.isCredit ? '<div style="color: red;"><strong>CREDIT SALE</strong></div>' : ''}
          
          <div class="line"></div>
          <div class="center" style="font-size: 10px;">Thank you!</div>
          
          <div style="text-align: center; margin-top: 20px;">
            <button onclick="window.print()" style="padding: 8px 16px; cursor: pointer;">Print</button>
            <button onclick="window.close()" style="padding: 8px 16px; cursor: pointer; margin-left: 10px;">Close</button>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  // Get unique categories
  const categories = ['All', ...new Set(products.map(p => p.category))]

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode?.includes(searchTerm)
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
      <h2 className="fw-bold mb-3 mb-md-4" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>Point of Sale</h2>

      <MDBRow className="pos-layout">
        {/* Products Section */}
        <MDBCol lg="8" className="mb-3 mb-lg-4">
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
              <div className="mt-3 d-flex justify-content-between align-items-center">
                <small className="text-muted">
                  Showing {currentProducts.length} of {filteredProducts.length} products
                </small>
                {totalPages > 1 && (
                  <div className="btn-group btn-group-sm">
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <FiChevronLeft />
                    </button>
                    <button className="btn btn-outline-secondary" disabled>
                      {currentPage} / {totalPages}
                    </button>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <FiChevronRight />
                    </button>
                  </div>
                )}
              </div>
            </MDBCardBody>
          </MDBCard>

          <MDBRow className="product-grid">
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <MDBCol xs="6" md="6" lg="4" key={product._id} className="mb-2 mb-md-3">
                  <MDBCard
                    className="premium-card h-100"
                    onClick={() => addToCart(product)}
                    style={{ cursor: 'pointer' }}
                  >
                    <MDBCardBody className="p-2 p-md-3">
                      <h6 className="fw-bold mb-2" style={{ fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>{product.name}</h6>
                      <MDBBadge color="primary" light className="mb-2" style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)' }}>
                        {product.category}
                      </MDBBadge>
                      <p className="text-success fw-bold mb-1 mb-md-2" style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>₹{product.sellingPrice}</p>
                      <small className="text-muted" style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.875rem)' }}>Stock: {product.stock}</small>
                    </MDBCardBody>
                  </MDBCard>
                </MDBCol>
              ))
            ) : (
              <MDBCol md="12">
                <div className="text-center py-4 py-md-5">
                  <FiPackage size={48} className="text-muted mb-3" />
                  <p className="text-muted">No products found</p>
                </div>
              </MDBCol>
            )}
          </MDBRow>
        </MDBCol>

        {/* Cart Section */}
        <MDBCol lg="4" className="mb-3 mb-lg-0">
          <MDBCard className="premium-card sticky-top" style={{ top: '20px' }}>
            <MDBCardBody className="p-2 p-md-3">
              <h5 className="fw-bold mb-3 mb-md-4" style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}>Cart</h5>

              <div className="mb-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {cart.map((item) => (
                  <div key={item._id} className="d-flex justify-content-between align-items-center mb-3 p-2 rounded cart-item-bg">
                    <div className="flex-grow-1">
                      <p className="fw-bold mb-1 cart-item-text">{item.name}</p>
                      <small className="cart-item-text">₹{item.sellingPrice} x {item.quantity}</small>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      >
                        <FiMinus />
                      </button>
                      <span className="cart-item-text">{item.quantity}</span>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      >
                        <FiPlus />
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => removeFromCart(item._id)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <hr />

              <div className="mb-3">
                <label className="form-label small">Customer Name *</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  required
                  placeholder="Enter customer name"
                />
              </div>
              <div className="mb-3">
                <label className="form-label small">Customer Phone *</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  required
                  placeholder="Enter customer phone"
                />
              </div>
              <div className="mb-3">
                <label className="form-label small">Discount</label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                />
              </div>
              <select
                className="form-select form-select-sm mb-3"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="upi">UPI</option>
                <option value="credit">Credit</option>
              </select>
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={isCredit}
                  onChange={(e) => setIsCredit(e.target.checked)}
                />
                <label className="form-check-label">
                  Credit Sale (Udhar)
                </label>
              </div>

              <hr />

              <div className="mb-2 d-flex justify-content-between">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="mb-2 d-flex justify-content-between">
                <span>Tax ({taxRate}%):</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="mb-2 d-flex justify-content-between">
                <span>Discount:</span>
                <span>₹{discount.toFixed(2)}</span>
              </div>
              <div className="mb-3 d-flex justify-content-between fw-bold fs-5">
                <span>Total:</span>
                <span>₹{finalAmount.toFixed(2)}</span>
              </div>

              <button className="btn btn-primary w-100 btn-premium" onClick={handleCheckout}>
                <FiCheck className="me-2" />
                Checkout
              </button>
            </MDBCardBody>
          </MDBCard>

          {lastBill && (
            <MDBCard className="premium-card mt-3">
              <MDBCardBody>
                <h6 className="fw-bold mb-3">Last Bill</h6>
                <div className="p-3 bg-light rounded border">
                  <p className="text-center fw-bold mb-1">{settings?.shopName}</p>
                  <p className="text-center small mb-1">{settings?.address}</p>
                  <p className="text-center small mb-2">GST: {settings?.gstNumber}</p>
                  <hr />
                  <p className="mb-1"><strong>Bill:</strong> {lastBill.billNumber}</p>
                  <p className="mb-1"><strong>Customer:</strong> {lastBill.customer.name}</p>
                  <p className="mb-1"><strong>Phone:</strong> {lastBill.customer.phone}</p>
                  <hr />
                  <p className="fw-bold mb-0 text-success">Amount: ₹{lastBill.finalAmount.toFixed(2)}</p>
                </div>
                <div className="d-flex gap-2 mt-3">
                  <button className="btn btn-sm btn-primary flex-fill" onClick={downloadPDF}>
                    <FiDownload className="me-1" />
                    PDF
                  </button>
                  <button className="btn btn-sm btn-outline-primary flex-fill" onClick={printBill}>
                    <FiPrinter className="me-1" />
                    Print
                  </button>
                </div>
              </MDBCardBody>
            </MDBCard>
          )}
        </MDBCol>
      </MDBRow>
    </div>
  )
}

export default POS
