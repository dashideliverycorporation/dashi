/**
 * Order notification email template
 * Template for notifying restaurants about new orders
 */

import { PaymentMethod } from '@/prisma/app/generated/prisma/client';

/**
 * Order notification email template data interface
 */
export interface OrderNotificationEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  restaurantName: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  deliveryAddress: string;
  customerNotes?: string;
  orderDate: Date;
  payment?: {
    method: PaymentMethod;
    mobileNumber?: string;
    providerName?: string;
    transactionId?: string;
  };
}

/**
 * Creates HTML email template for restaurant order notifications
 * 
 * @param orderData - Data needed to generate the order notification email
 * @returns HTML string for the email
 */
export const createOrderNotificationEmail = (orderData: OrderNotificationEmailData): string => {
  const itemsHtml = orderData.items
    .map(
      (item) => `
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px; text-align: left;">${item.name}</td>
          <td style="padding: 12px; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px; text-align: right;">$${item.price.toFixed(2)}</td>
          <td style="padding: 12px; text-align: right;">$${(item.quantity * item.price).toFixed(2)}</td>
        </tr>
      `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Order - ${orderData.orderNumber}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 30px; text-align: center; margin-bottom: 30px; border-radius: 10px;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">🍕 New Order Alert!</h1>
        <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">You have received a new order on Dashi</p>
      </div>

      <div style="background-color: #f8fafc; padding: 25px; border-radius: 10px; margin-bottom: 25px;">
        <h2 style="color: #f97316; margin-top: 0; font-size: 22px;">Order Details</h2>
        <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
          <div>
            <p style="margin: 5px 0;"><strong>Order Number:</strong> ${orderData.orderNumber}</p>
            <p style="margin: 5px 0;"><strong>Restaurant:</strong> ${orderData.restaurantName}</p>
            <p style="margin: 5px 0;"><strong>Order Date:</strong> ${orderData.orderDate.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 25px; margin-bottom: 25px;">
        <h3 style="color: #f97316; margin-top: 0;">Customer Information</h3>
        <p style="margin: 5px 0;"><strong>Name:</strong> ${orderData.customerName}</p>
        ${orderData.customerEmail ? `<p style="margin: 5px 0;"><strong>Email:</strong> ${orderData.customerEmail}</p>` : ''}
        ${orderData.customerPhone ? `<p style="margin: 5px 0;"><strong>Phone:</strong> ${orderData.customerPhone}</p>` : ''}
        <p style="margin: 5px 0;"><strong>Delivery Address:</strong> ${orderData.deliveryAddress}</p>
        ${orderData.customerNotes ? `<p style="margin: 5px 0;"><strong>Special Instructions:</strong> ${orderData.customerNotes}</p>` : ''}
      </div>

      ${orderData.payment ? `
      <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 25px; margin-bottom: 25px;">
        <h3 style="color: #f97316; margin-top: 0;">Payment Information</h3>
        <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${orderData.payment.method}</p>
        ${orderData.payment.mobileNumber ? `<p style="margin: 5px 0;"><strong>Mobile Number:</strong> ${orderData.payment.mobileNumber}</p>` : ''}
        ${orderData.payment.providerName ? `<p style="margin: 5px 0;"><strong>Operator:</strong> ${orderData.payment.providerName}</p>` : ''}
        ${orderData.payment.transactionId ? `<p style="margin: 5px 0;"><strong>Reference Number:</strong> ${orderData.payment.transactionId}</p>` : ''}
      </div>
      ` : ''}

      <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 25px; margin-bottom: 25px;">
        <h3 style="color: #f97316; margin-top: 0;">Order Items</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f8fafc;">
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Item</th>
              <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb;">Qty</th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Price</th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #f97316;">
          <p style="text-align: right; font-size: 18px; font-weight: bold; color: #f97316; margin: 0;">
            Total Amount: $${orderData.totalAmount.toFixed(2)}
          </p>
        </div>
      </div>

      <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 10px; padding: 20px; margin-bottom: 25px;">
        <h3 style="color: #92400e; margin-top: 0;">⚡ Action Required</h3>
        <p style="color: #92400e; margin: 0;">Please log in to your restaurant dashboard to confirm this order and update its status.</p>
      </div>

      <div style="text-align: center; padding: 20px; border-top: 1px solid #e5e7eb; margin-top: 30px;">
        <p style="color: #6b7280; font-size: 14px; margin: 0;">
          This email was sent from <strong style="color: #f97316;">Dashi</strong> - Your Food Delivery Platform
        </p>
        <p style="color: #6b7280; font-size: 12px; margin: 5px 0 0 0;">
          Please do not reply to this email. For support, contact us through your restaurant dashboard.
        </p>
      </div>
    </body>
    </html>
  `;
};
