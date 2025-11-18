import { forwardRef } from 'react'

const BillTemplate = forwardRef(({ bill, settings }, ref) => {
  if (!bill) return null

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div ref={ref} className="bg-white text-black p-8 max-w-4xl mx-auto" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div className="border-b-4 border-black pb-4 mb-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold uppercase">{settings?.shopName || 'Kirana Store'}</h1>
            <p className="text-sm mt-2">{settings?.address || 'Shop Address'}</p>
            <p className="text-sm">Phone: {settings?.phone || 'N/A'}</p>
            <p className="text-sm">Email: {settings?.email || 'N/A'}</p>
            {settings?.gstNumber && (
              <p className="text-sm font-semibold">GSTIN: {settings.gstNumber}</p>
            )}
          </div>
          {settings?.logo && (
            <img src={settings.logo} alt="Logo" className="h-20 w-20 object-contain" />
          )}
        </div>
      </div>

      {/* Invoice Title */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold uppercase border-2 border-black inline-block px-6 py-2">
          TAX INVOICE
        </h2>
      </div>

      {/* Bill Details */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="border border-black p-3">
          <p className="font-bold text-lg mb-2">Bill To:</p>
          <p className="font-semibold">{bill.customer?.name || 'Walk-in Customer'}</p>
          {bill.customer?.phone && <p>Phone: {bill.customer.phone}</p>}
          {bill.customer?.address && <p>Address: {bill.customer.address}</p>}
        </div>
        <div className="border border-black p-3">
          <div className="space-y-1">
            <p><span className="font-bold">Invoice No:</span> {bill.billNumber}</p>
            <p><span className="font-bold">Date:</span> {formatDate(bill.createdAt)}</p>
            <p><span className="font-bold">Payment:</span> <span className="uppercase">{bill.paymentMethod}</span></p>
            {bill.isCredit && (
              <p className="text-red-600 font-bold">⚠ CREDIT SALE (UDHAR)</p>
            )}
          </div>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full border-collapse border-2 border-black mb-6">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-black p-2 text-left">S.No</th>
            <th className="border border-black p-2 text-left">Item Description</th>
            <th className="border border-black p-2 text-center">Qty</th>
            <th className="border border-black p-2 text-right">Rate</th>
            <th className="border border-black p-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {bill.items?.map((item, index) => (
            <tr key={index}>
              <td className="border border-black p-2">{index + 1}</td>
              <td className="border border-black p-2">{item.name}</td>
              <td className="border border-black p-2 text-center">{item.quantity}</td>
              <td className="border border-black p-2 text-right">₹{item.price.toFixed(2)}</td>
              <td className="border border-black p-2 text-right">₹{item.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-6">
        <div className="w-1/2 border-2 border-black">
          <div className="flex justify-between p-2 border-b border-black">
            <span className="font-semibold">Subtotal:</span>
            <span>₹{bill.subtotal.toFixed(2)}</span>
          </div>
          {bill.tax > 0 && (
            <div className="flex justify-between p-2 border-b border-black">
              <span className="font-semibold">Tax ({settings?.taxRate || 0}%):</span>
              <span>₹{bill.tax.toFixed(2)}</span>
            </div>
          )}
          {bill.discount > 0 && (
            <div className="flex justify-between p-2 border-b border-black">
              <span className="font-semibold">Discount:</span>
              <span className="text-red-600">- ₹{bill.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between p-3 bg-gray-200 font-bold text-lg">
            <span>TOTAL AMOUNT:</span>
            <span>₹{bill.finalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Amount in Words */}
      <div className="border border-black p-3 mb-6">
        <p className="font-semibold">Amount in Words:</p>
        <p className="text-lg capitalize">{numberToWords(bill.finalAmount)} Rupees Only</p>
      </div>

      {/* Terms & Conditions */}
      <div className="border-t-2 border-black pt-4 mb-6">
        <p className="font-bold mb-2">Terms & Conditions:</p>
        <ul className="text-sm space-y-1">
          <li>• Goods once sold will not be taken back or exchanged</li>
          <li>• All disputes are subject to local jurisdiction only</li>
          <li>• Payment should be made within the due date</li>
        </ul>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-end border-t-2 border-black pt-4">
        <div>
          <p className="text-sm">Thank you for your business!</p>
          <p className="text-xs text-gray-600 mt-2">This is a computer-generated invoice</p>
        </div>
        <div className="text-center">
          <div className="border-t-2 border-black pt-2 mt-8 w-48">
            <p className="font-semibold">Authorized Signature</p>
          </div>
        </div>
      </div>
    </div>
  )
})

// Helper function to convert number to words
const numberToWords = (num) => {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']

  if (num === 0) return 'Zero'

  const convert = (n) => {
    if (n < 10) return ones[n]
    if (n < 20) return teens[n - 10]
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '')
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + convert(n % 100) : '')
    if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + convert(n % 1000) : '')
    if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + convert(n % 100000) : '')
    return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 !== 0 ? ' ' + convert(n % 10000000) : '')
  }

  return convert(Math.floor(num))
}

BillTemplate.displayName = 'BillTemplate'

export default BillTemplate
