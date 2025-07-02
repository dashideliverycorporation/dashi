/**
 * Customer order confirmation email template
 * Template for notifying customers about their order placement
 */

import { PaymentMethod } from '@/prisma/app/generated/prisma/client';

/**
 * Customer order confirmation email template data interface
 */
export interface CustomerOrderConfirmationEmailData {
  orderNumber: string;
  customerName: string;
  restaurantName: string;
  restaurantImage?: string;
  restaurantPhone?: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  deliveryAddress: string;
  customerNotes?: string;
  orderDate: Date;
  estimatedDeliveryTime?: string;
  payment?: {
    method: PaymentMethod;
    mobileNumber?: string;
    providerName?: string;
    transactionId?: string;
  };
}

/**
 * Creates HTML email template for customer order confirmations
 * 
 * @param orderData - Data needed to generate the customer order confirmation email
 * @returns HTML string for the email
 */
export const createCustomerOrderConfirmationEmail = (orderData: CustomerOrderConfirmationEmailData): string => {
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
      <title>Your Order - ${orderData.orderNumber}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 30px; text-align: center; margin-bottom: 30px; border-radius: 10px;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">🎉 Order Confirmed!</h1>
        <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Thank you for ordering with Dashi</p>
      </div>

      <div style="background-color: #f8fafc; padding: 25px; border-radius: 10px; margin-bottom: 25px;">
        <h2 style="color: #f97316; margin-top: 0; font-size: 22px;">Order Details</h2>
        <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
          <div>
            <p style="margin: 5px 0;"><strong>Order Number:</strong> ${orderData.orderNumber}</p>
            <p style="margin: 5px 0;"><strong>Order Date:</strong> ${orderData.orderDate.toLocaleString()}</p>
            ${orderData.estimatedDeliveryTime ? `<p style="margin: 5px 0;"><strong>Estimated Delivery:</strong> ${orderData.estimatedDeliveryTime}</p>` : ''}
          </div>
        </div>
      </div>

      <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 25px; margin-bottom: 25px;">
        <h3 style="color: #f97316; margin-top: 0;">Restaurant Information</h3>
        <p style="margin: 5px 0;"><strong>Name:</strong> ${orderData.restaurantName}</p>
        ${orderData.restaurantPhone ? `<p style="margin: 5px 0;"><strong>Phone:</strong> ${orderData.restaurantPhone}</p>` : ''}
        <p style="margin: 5px 0;"><strong>Delivery Address:</strong> ${orderData.deliveryAddress}</p>
        ${orderData.customerNotes ? `<p style="margin: 5px 0;"><strong>Special Instructions:</strong> ${orderData.customerNotes}</p>` : ''}
      </div>

      ${orderData.payment ? `
      <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 25px; margin-bottom: 25px;">
        <h3 style="color: #f97316; margin-top: 0;">Payment Information</h3>
        <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${orderData.payment.method}</p>
        ${orderData.payment.mobileNumber ? `<p style="margin: 5px 0;"><strong>Mobile Number:</strong> ${orderData.payment.mobileNumber}</p>` : ''}
        ${orderData.payment.providerName ? `<p style="margin: 5px 0;"><strong>Provider:</strong> ${orderData.payment.providerName}</p>` : ''}
        ${orderData.payment.transactionId ? `<p style="margin: 5px 0;"><strong>Reference Number:</strong> ${orderData.payment.transactionId}</p>` : ''}
      </div>
      ` : ''}

      <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 25px; margin-bottom: 25px;">
        <h3 style="color: #f97316; margin-top: 0;">Your Order Items</h3>
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

      <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 10px; padding: 20px; margin-bottom: 25px;">
        <h3 style="color: #166534; margin-top: 0;">📱 Track Your Order</h3>
        <p style="color: #166534; margin: 0;">You can check the status of your order anytime by logging into your Dashi account and visiting your order history.</p>
      </div>

      <div style="text-align: center; padding: 20px; border-top: 1px solid #e5e7eb; margin-top: 30px;">
        <p style="color: #6b7280; font-size: 14px; margin: 0;">
          This email was sent from <strong style="color: #f97316;">Dashi</strong> - Your Food Delivery Platform
        </p>
        <p style="color: #6b7280; font-size: 12px; margin: 5px 0 0 0;">
          For support, please contact us through the app or reply to this email.
        </p>
      </div>
    </body>
    </html>
  `;
};
