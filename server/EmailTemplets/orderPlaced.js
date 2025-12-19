export const orderPlacedTemplate = ({ name, orderId, amount }) => `
  <h2>Hey ${name},</h2>
  <p>Your order <strong>#${orderId}</strong> has been placed successfully!</p>
  <p>Total Amount: ₹${amount}</p>
  <p>Thank you for shopping with us!</p>
`;
