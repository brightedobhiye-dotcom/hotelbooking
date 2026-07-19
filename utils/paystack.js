// const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
// const paystack = require('paystack')(PAYSTACK_SECRET_KEY);

// /**
//  * Initialize a Paystack transaction
//  * @param {string} email - Customer email
//  * @param {number} amount - Amount in Naira (will be converted to kobo)
//  * @param {Object} metadata - Optional metadata
//  * @returns {Promise<Object>} - Paystack initialization response
//  */
// const initializeTransaction = async (email, amount, metadata = {}) => {
//   try {
//     const response = await paystack.transaction.initialize({
//       email,
//       amount: amount * 100, // Paystack expects amount in kobo
//       metadata: JSON.stringify(metadata),
//     });
//     return response;
//   } catch (error) {
//     console.error('Paystack initialization error:', error);
//     return { status: false, message: 'Initialization failed', error };
//   }
// };

// /**
//  * Verify a Paystack transaction
//  * @param {string} reference - Paystack transaction reference
//  * @returns {Promise<Object>} - Paystack verification response
//  */
// const verifyTransaction = async (reference) => {
//   try {
//     const response = await paystack.transaction.verify(reference);
//     return response;
//   } catch (error) {
//     console.error('Paystack verification error:', error);
//     return { status: false, message: 'Verification failed', error };
//   }
// };

// module.exports = {
//   initializeTransaction,
//   verifyTransaction,
// };
