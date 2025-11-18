import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSettings, updateSettings } from '../redux/slices/settingsSlice'
import toast from 'react-hot-toast'
import { FiSave, FiInfo, FiDollarSign, FiFileText, FiPackage, FiBell, FiCreditCard, FiPrinter, FiSettings } from 'react-icons/fi'
import {
  MDBCard,
  MDBCardBody
} from 'mdb-react-ui-kit'

const Settings = () => {
  const dispatch = useDispatch()
  const { settings, loading } = useSelector((state) => state.settings)
  const [activeTab, setActiveTab] = useState('shop')

  const [formData, setFormData] = useState({
    shopName: '',
    gstNumber: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    logo: null,
    taxRate: 0,
    currency: '₹',
    currencyPosition: 'before',
    billPrefix: 'INV',
    billStartNumber: 1,
    billFooterText: 'Thank you for your business!',
    showBillTerms: false,
    billTerms: '',
    lowStockAlert: 10,
    enableStockAlerts: true,
    autoReduceStock: true,
    emailNotifications: false,
    smsNotifications: false,
    lowStockNotification: true,
    dailyReportEmail: false,
    acceptCash: true,
    acceptCard: true,
    acceptUPI: true,
    upiId: '',
    printAfterSale: false,
    receiptPaperSize: '80mm',
    showBarcode: true,
    autoBackup: false,
    backupFrequency: 'weekly',
    itemsPerPage: 10,
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12h',
  })

  useEffect(() => {
    dispatch(fetchSettings())
  }, [dispatch])

  useEffect(() => {
    if (settings) {
      setFormData({
        shopName: settings.shopName || '',
        gstNumber: settings.gstNumber || '',
        address: settings.address || '',
        phone: settings.phone || '',
        email: settings.email || '',
        website: settings.website || '',
        logo: null,
        taxRate: settings.taxRate || 0,
        currency: settings.currency || '₹',
        currencyPosition: settings.currencyPosition || 'before',
        billPrefix: settings.billPrefix || 'INV',
        billStartNumber: settings.billStartNumber || 1,
        billFooterText: settings.billFooterText || 'Thank you for your business!',
        showBillTerms: settings.showBillTerms || false,
        billTerms: settings.billTerms || '',
        lowStockAlert: settings.lowStockAlert || 10,
        enableStockAlerts: settings.enableStockAlerts !== undefined ? settings.enableStockAlerts : true,
        autoReduceStock: settings.autoReduceStock !== undefined ? settings.autoReduceStock : true,
        emailNotifications: settings.emailNotifications || false,
        smsNotifications: settings.smsNotifications || false,
        lowStockNotification: settings.lowStockNotification !== undefined ? settings.lowStockNotification : true,
        dailyReportEmail: settings.dailyReportEmail || false,
        acceptCash: settings.acceptCash !== undefined ? settings.acceptCash : true,
        acceptCard: settings.acceptCard !== undefined ? settings.acceptCard : true,
        acceptUPI: settings.acceptUPI !== undefined ? settings.acceptUPI : true,
        upiId: settings.upiId || '',
        printAfterSale: settings.printAfterSale || false,
        receiptPaperSize: settings.receiptPaperSize || '80mm',
        showBarcode: settings.showBarcode !== undefined ? settings.showBarcode : true,
        autoBackup: settings.autoBackup || false,
        backupFrequency: settings.backupFrequency || 'weekly',
        itemsPerPage: settings.itemsPerPage || 10,
        dateFormat: settings.dateFormat || 'DD/MM/YYYY',
        timeFormat: settings.timeFormat || '12h',
      })
    }
  }, [settings])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = new FormData()
    
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== undefined) {
        if (key === 'logo' && formData[key] instanceof File) {
          data.append(key, formData[key])
        } else if (key !== 'logo') {
          data.append(key, formData[key])
        }
      }
    })

    try {
      await dispatch(updateSettings(data)).unwrap()
      toast.success('Settings updated successfully')
    } catch (error) {
      toast.error(error || 'Failed to update settings')
    }
  }

  const tabs = [
    { id: 'shop', label: 'Shop Info', icon: FiInfo },
    { id: 'financial', label: 'Financial', icon: FiDollarSign },
    { id: 'bill', label: 'Bill Settings', icon: FiFileText },
    { id: 'inventory', label: 'Inventory', icon: FiPackage },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'payment', label: 'Payment', icon: FiCreditCard },
    { id: 'receipt', label: 'Receipt', icon: FiPrinter },
    { id: 'system', label: 'System', icon: FiSettings },
  ]

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <h2 className="fw-bold mb-2">Settings</h2>
        <p className="text-muted mb-0">Configure your shop and application settings</p>
      </div>

      <div className="row">
        {/* Sidebar Navigation */}
        <div className="col-lg-3 mb-4">
          <MDBCard className="premium-card settings-sidebar">
            <MDBCardBody className="p-2">
              <div className="settings-nav">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      className={`settings-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <Icon className="me-2" />
                      {tab.label}
                    </button>
                  )
                })}
              </div>
            </MDBCardBody>
          </MDBCard>
        </div>

        {/* Content Area */}
        <div className="col-lg-9">
          <MDBCard className="premium-card">
            <MDBCardBody>
              <form onSubmit={handleSubmit}>
                {/* Shop Information Tab */}
                {activeTab === 'shop' && (
                  <div className="settings-content">
                    <h5 className="fw-bold mb-4">Shop Information</h5>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Shop Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.shopName}
                          onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">GST Number</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.gstNumber}
                          onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                          placeholder="27AABCU9603R1ZM"
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Phone *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Website</label>
                        <input
                          type="url"
                          className="form-control"
                          value={formData.website}
                          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                          placeholder="https://example.com"
                        />
                      </div>
                      <div className="col-md-12 mb-3">
                        <label className="form-label">Address *</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          required
                        ></textarea>
                      </div>
                      <div className="col-md-12 mb-3">
                        <label className="form-label">Shop Logo</label>
                        <input
                          type="file"
                          className="form-control"
                          accept="image/*"
                          onChange={(e) => setFormData({ ...formData, logo: e.target.files[0] })}
                        />
                        <small className="text-muted">Recommended size: 200x200px</small>
                      </div>
                    </div>
                  </div>
                )}

                {/* Financial Tab */}
                {activeTab === 'financial' && (
                  <div className="settings-content">
                    <h5 className="fw-bold mb-4">Financial Settings</h5>
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Tax Rate (%)</label>
                        <input
                          type="number"
                          className="form-control"
                          value={formData.taxRate}
                          onChange={(e) => setFormData({ ...formData, taxRate: e.target.value })}
                          min="0"
                          max="100"
                          step="0.01"
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Currency Symbol</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.currency}
                          onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Currency Position</label>
                        <select
                          className="form-select"
                          value={formData.currencyPosition}
                          onChange={(e) => setFormData({ ...formData, currencyPosition: e.target.value })}
                        >
                          <option value="before">Before Amount (₹100)</option>
                          <option value="after">After Amount (100₹)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bill Settings Tab */}
                {activeTab === 'bill' && (
                  <div className="settings-content">
                    <h5 className="fw-bold mb-4">Bill Settings</h5>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Bill Prefix</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.billPrefix}
                          onChange={(e) => setFormData({ ...formData, billPrefix: e.target.value })}
                          placeholder="INV"
                        />
                        <small className="text-muted">Example: INV-001, BILL-001</small>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Bill Start Number</label>
                        <input
                          type="number"
                          className="form-control"
                          value={formData.billStartNumber}
                          onChange={(e) => setFormData({ ...formData, billStartNumber: e.target.value })}
                          min="1"
                        />
                      </div>
                      <div className="col-md-12 mb-3">
                        <label className="form-label">Bill Footer Text</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.billFooterText}
                          onChange={(e) => setFormData({ ...formData, billFooterText: e.target.value })}
                        />
                      </div>
                      <div className="col-md-12 mb-3">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={formData.showBillTerms}
                            onChange={(e) => setFormData({ ...formData, showBillTerms: e.target.checked })}
                          />
                          <label className="form-check-label">
                            Show Terms & Conditions on Bill
                          </label>
                        </div>
                      </div>
                      {formData.showBillTerms && (
                        <div className="col-md-12 mb-3">
                          <label className="form-label">Terms & Conditions</label>
                          <textarea
                            className="form-control"
                            rows="4"
                            value={formData.billTerms}
                            onChange={(e) => setFormData({ ...formData, billTerms: e.target.value })}
                            placeholder="Enter your terms and conditions..."
                          ></textarea>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Inventory Tab */}
                {activeTab === 'inventory' && (
                  <div className="settings-content">
                    <h5 className="fw-bold mb-4">Inventory Settings</h5>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Low Stock Alert Threshold</label>
                        <input
                          type="number"
                          className="form-control"
                          value={formData.lowStockAlert}
                          onChange={(e) => setFormData({ ...formData, lowStockAlert: e.target.value })}
                          min="0"
                        />
                        <small className="text-muted">Alert when stock falls below this number</small>
                      </div>
                      <div className="col-md-12 mb-3">
                        <div className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={formData.enableStockAlerts}
                            onChange={(e) => setFormData({ ...formData, enableStockAlerts: e.target.checked })}
                          />
                          <label className="form-check-label">
                            Enable Low Stock Alerts
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={formData.autoReduceStock}
                            onChange={(e) => setFormData({ ...formData, autoReduceStock: e.target.checked })}
                          />
                          <label className="form-check-label">
                            Automatically Reduce Stock on Sale
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div className="settings-content">
                    <h5 className="fw-bold mb-4">Notification Settings</h5>
                    <div className="row">
                      <div className="col-md-12 mb-3">
                        <div className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={formData.emailNotifications}
                            onChange={(e) => setFormData({ ...formData, emailNotifications: e.target.checked })}
                          />
                          <label className="form-check-label">
                            Enable Email Notifications
                          </label>
                        </div>
                        <div className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={formData.smsNotifications}
                            onChange={(e) => setFormData({ ...formData, smsNotifications: e.target.checked })}
                          />
                          <label className="form-check-label">
                            Enable SMS Notifications
                          </label>
                        </div>
                        <div className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={formData.lowStockNotification}
                            onChange={(e) => setFormData({ ...formData, lowStockNotification: e.target.checked })}
                          />
                          <label className="form-check-label">
                            Low Stock Notifications
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={formData.dailyReportEmail}
                            onChange={(e) => setFormData({ ...formData, dailyReportEmail: e.target.checked })}
                          />
                          <label className="form-check-label">
                            Daily Sales Report Email
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Tab */}
                {activeTab === 'payment' && (
                  <div className="settings-content">
                    <h5 className="fw-bold mb-4">Payment Settings</h5>
                    <div className="row">
                      <div className="col-md-12 mb-3">
                        <label className="form-label fw-bold">Accepted Payment Methods</label>
                        <div className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={formData.acceptCash}
                            onChange={(e) => setFormData({ ...formData, acceptCash: e.target.checked })}
                          />
                          <label className="form-check-label">
                            Cash
                          </label>
                        </div>
                        <div className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={formData.acceptCard}
                            onChange={(e) => setFormData({ ...formData, acceptCard: e.target.checked })}
                          />
                          <label className="form-check-label">
                            Card (Debit/Credit)
                          </label>
                        </div>
                        <div className="form-check mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={formData.acceptUPI}
                            onChange={(e) => setFormData({ ...formData, acceptUPI: e.target.checked })}
                          />
                          <label className="form-check-label">
                            UPI
                          </label>
                        </div>
                      </div>
                      {formData.acceptUPI && (
                        <div className="col-md-6 mb-3">
                          <label className="form-label">UPI ID</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.upiId}
                            onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                            placeholder="yourname@upi"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Receipt Tab */}
                {activeTab === 'receipt' && (
                  <div className="settings-content">
                    <h5 className="fw-bold mb-4">Receipt Settings</h5>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Receipt Paper Size</label>
                        <select
                          className="form-select"
                          value={formData.receiptPaperSize}
                          onChange={(e) => setFormData({ ...formData, receiptPaperSize: e.target.value })}
                        >
                          <option value="80mm">80mm (Thermal)</option>
                          <option value="58mm">58mm (Thermal)</option>
                          <option value="A4">A4 (Standard)</option>
                        </select>
                      </div>
                      <div className="col-md-12 mb-3">
                        <div className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={formData.printAfterSale}
                            onChange={(e) => setFormData({ ...formData, printAfterSale: e.target.checked })}
                          />
                          <label className="form-check-label">
                            Auto Print Receipt After Sale
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={formData.showBarcode}
                            onChange={(e) => setFormData({ ...formData, showBarcode: e.target.checked })}
                          />
                          <label className="form-check-label">
                            Show Barcode on Receipt
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* System Tab */}
                {activeTab === 'system' && (
                  <div className="settings-content">
                    <h5 className="fw-bold mb-4">System Settings</h5>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Items Per Page</label>
                        <select
                          className="form-select"
                          value={formData.itemsPerPage}
                          onChange={(e) => setFormData({ ...formData, itemsPerPage: e.target.value })}
                        >
                          <option value="5">5</option>
                          <option value="10">10</option>
                          <option value="20">20</option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Date Format</label>
                        <select
                          className="form-select"
                          value={formData.dateFormat}
                          onChange={(e) => setFormData({ ...formData, dateFormat: e.target.value })}
                        >
                          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Time Format</label>
                        <select
                          className="form-select"
                          value={formData.timeFormat}
                          onChange={(e) => setFormData({ ...formData, timeFormat: e.target.value })}
                        >
                          <option value="12h">12 Hour (AM/PM)</option>
                          <option value="24h">24 Hour</option>
                        </select>
                      </div>
                      <div className="col-md-12 mb-3">
                        <label className="form-label fw-bold">Backup Settings</label>
                        <div className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={formData.autoBackup}
                            onChange={(e) => setFormData({ ...formData, autoBackup: e.target.checked })}
                          />
                          <label className="form-check-label">
                            Enable Automatic Backup
                          </label>
                        </div>
                      </div>
                      {formData.autoBackup && (
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Backup Frequency</label>
                          <select
                            className="form-select"
                            value={formData.backupFrequency}
                            onChange={(e) => setFormData({ ...formData, backupFrequency: e.target.value })}
                          >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-3 border-top">
                  <button type="submit" className="btn btn-primary btn-premium" disabled={loading}>
                    <FiSave className="me-2" />
                    {loading ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </form>
            </MDBCardBody>
          </MDBCard>
        </div>
      </div>
    </div>
  )
}

export default Settings
