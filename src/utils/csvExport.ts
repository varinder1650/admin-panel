import { format } from 'date-fns';

interface CSVExportOptions {
  filename?: string;
  headers: string[];
  data: any[][];
}

export const exportToCSV = (options: CSVExportOptions): void => {
  const { filename, headers, data } = options;
  
  const escapeCSV = (value: any): string => {
    if (value === null || value === undefined) return '';
    const stringValue = String(value);
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  const csvContent = [
    headers.map(escapeCSV).join(','),
    ...data.map(row => row.map(escapeCSV).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  const finalFilename = filename || `export_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.csv`;
  
  link.setAttribute('href', url);
  link.setAttribute('download', finalFilename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportOrders = (orders: any[]): void => {
  const headers = [
    "Order ID",
    "Customer Name",
    "Customer Email",
    "Customer Phone",
    "Status",
    "Total Amount",
    "Payment Method",
    "Delivery Partner",
    "Created Date",
    "Created Time",
    "Delivery Address"
  ];

  const data = orders.map(order => [
    order.id || '',
    order.user_name || '',
    order.user_email || '',
    order.user_phone || '',
    order.status || order.order_status || '',
    order.total || order.total_amount || '0',
    order.payment_method || '',
    order.delivery_partner_name || 'Not assigned',
    order.created_at ? format(new Date(order.created_at), 'yyyy-MM-dd') : '',
    order.created_at ? format(new Date(order.created_at), 'HH:mm:ss') : '',
    order.delivery_address ? 
      `${order.delivery_address.address || ''}, ${order.delivery_address.city || ''}` : ''
  ]);

  exportToCSV({
    filename: `orders_${format(new Date(), 'yyyy-MM-dd')}.csv`,
    headers,
    data
  });
};