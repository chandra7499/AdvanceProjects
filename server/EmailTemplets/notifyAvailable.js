export const notifyAvailableTemplate = ({ name, productName }) => `
  <h2>Hi ${name},</h2>
  <p>Your requested product <strong>${productName}</strong> is now back in stock!</p>
  <p>You can purchase it now before it goes out of stock again.</p>
`;
