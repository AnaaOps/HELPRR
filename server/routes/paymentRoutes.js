const express = require('express');
const router = express.Router();

// Mock payment controller functions (in production, these would be imported from controllers)
const {
    createPaymentIntent,
    processPayment,
    getPaymentById,
    getUserPayments,
    refundPayment,
    getProviderPayouts,
    applyDiscountCoupon
} = require('../controllers/paymentController');

// @route   POST /api/payments/create-intent
// @desc    Create payment intent for Stripe
// @access  Private
router.post('/create-intent', createPaymentIntent);

// @route   POST /api/payments/process
// @desc    Process payment
// @access  Private
router.post('/process', processPayment);

// @route   GET /api/payments/:id
// @desc    Get payment by ID
// @access  Private
router.get('/:id', getPaymentById);

// @route   GET /api/payments/user/:userId
// @desc    Get user's payment history
// @access  Private
router.get('/user/:userId', getUserPayments);

// @route   POST /api/payments/:id/refund
// @desc    Refund a payment
// @access  Private/Admin
router.post('/:id/refund', refundPayment);

// @route   GET /api/payments/provider/:providerId/payouts
// @desc    Get provider's payout history
// @access  Private
router.get('/provider/:providerId/payouts', getProviderPayouts);

// @route   POST /api/payments/apply-coupon
// @desc    Apply discount coupon
// @access  Private
router.post('/apply-coupon', applyDiscountCoupon);

module.exports = router; 