/**
 * Invoice Generation Utility
 */

export const generateInvoice = (order) => {
  const invoiceNumber = `INV-${Date.now()}`;
  const invoiceDate = new Date().toISOString().split('T')[0];
  
  return {
    invoiceNumber,
    invoiceDate,
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    order,
  };
};

export const formatInvoiceAsHTML = (invoice) => {
  const { invoiceNumber, invoiceDate, dueDate, order } = invoice;
  
  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deposit = order.deposit || 0;
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const total = subtotal + deposit + tax;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .invoice { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; color: #3b82f6; }
        .invoice-details { text-align: right; }
        .section { margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f3f4f6; font-weight: bold; }
        .total-section { text-align: right; margin-top: 20px; }
        .total-line { font-size: 18px; font-weight: bold; color: #3b82f6; }
      </style>
    </head>
    <body>
      <div class="invoice">
        <div class="header">
          <div class="logo">RentEase</div>
          <div class="invoice-details">
            <div><strong>Invoice #:</strong> ${invoiceNumber}</div>
            <div><strong>Date:</strong> ${invoiceDate}</div>
            <div><strong>Due Date:</strong> ${dueDate}</div>
          </div>
        </div>

        <div class="section">
          <h3>Bill To:</h3>
          <p>${order.customerName || 'Customer'}</p>
          <p>${order.email || ''}</p>
          <p>${order.address || ''}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>₹${item.price.toLocaleString()}</td>
                <td>₹${(item.price * item.quantity).toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="total-section">
          <div><strong>Subtotal:</strong> ₹${subtotal.toLocaleString()}</div>
          <div><strong>Security Deposit:</strong> ₹${deposit.toLocaleString()}</div>
          <div><strong>GST (18%):</strong> ₹${tax.toLocaleString()}</div>
          <div class="total-line"><strong>Total:</strong> ₹${total.toLocaleString()}</div>
        </div>

        <div class="section" style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p><strong>Thank you for renting with RentEase!</strong></p>
          <p>For support, contact us at support@rentease.com</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const downloadInvoice = (invoice) => {
  const html = formatInvoiceAsHTML(invoice);
  const blob = new Blob([html], { type: 'text/html' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${invoice.invoiceNumber}.html`;
  link.click();
  window.URL.revokeObjectURL(url);
};

export const printInvoice = (invoice) => {
  const html = formatInvoiceAsHTML(invoice);
  const printWindow = window.open('', '', 'width=800,height=600');
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.print();
};
