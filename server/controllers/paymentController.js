// Mock payment data for demo
const payments = [
    {
        id: '1',
        bookingId: '1',
        userId: '1',
        providerId: '1',
        amount: 50,
        status: 'completed',
        paymentMethod: 'credit_card',
        transactionId: 'txn_123456789',
        createdAt: '2023-03-15T15:30:00Z'
    },
    {
        id: '2',
        bookingId: '2',
        userId: '1',
        providerId: '3',
        amount: 100,
        status: 'pending',
        paymentMethod: null,
        transactionId: null,
        createdAt: '2023-03-20T10:15:00Z'
    },
    {
        id: '3',
        bookingId: '3',
        userId: '2',
        providerId: '2',
        amount: 80,
        status: 'refunded',
        paymentMethod: 'credit_card',
        transactionId: 'txn_987654321',
        createdAt: '2023-03-18T09:30:00Z'
    },
    {
        id: '4',
        bookingId: '4',
        userId: '2',
        providerId: '5',
        amount: 75,
        status: 'completed',
        paymentMethod: 'upi',
        transactionId: 'txn_567891234',
        createdAt: '2023-03-25T18:30:00Z'
    }
];

// Mock discount coupons
const coupons = [
    {
        code: 'WELCOME10',
        discount: 10, // percentage
        minAmount: 0,
        maxDiscount: 100,
        expiresAt: '2023-12-31T23:59:59Z',
        isActive: true
    },
    {
        code: 'PREMIUM20',
        discount: 20, // percentage
        minAmount: 50,
        maxDiscount: 200,
        expiresAt: '2023-12-31T23:59:59Z',
        isActive: true,
        premiumOnly: true
    },
    {
        code: 'SUMMER15',
        discount: 15, // percentage
        minAmount: 30,
        maxDiscount: 150,
        expiresAt: '2023-08-31T23:59:59Z',
        isActive: true
    }
];

// @desc    Create payment intent for Stripe
// @route   POST /api/payments/create-intent
// @access  Private
const createPaymentIntent = (req, res) => {
    const { bookingId, amount, couponCode } = req.body;
    
    // In a real application, we would create a Stripe payment intent here
    
    let finalAmount = amount;
    let appliedCoupon = null;
    
    // Apply coupon if provided
    if (couponCode) {
        const coupon = coupons.find(c => c.code === couponCode && c.isActive);
        
        if (coupon) {
            // Check if coupon is for premium users only
            if (coupon.premiumOnly) {
                // In a real application, we would check if the user is premium
                const { users } = require('./userController');
                const { bookings } = require('./bookingController');
                
                const booking = bookings.find(b => b.id === bookingId);
                if (booking) {
                    const user = users.find(u => u.id === booking.userId);
                    if (!user.isPremium) {
                        return res.status(400).json({
                            message: 'This coupon is only for premium users'
                        });
                    }
                }
            }
            
            // Check minimum amount
            if (amount < coupon.minAmount) {
                return res.status(400).json({
                    message: `Minimum amount for this coupon is $${coupon.minAmount}`
                });
            }
            
            // Calculate discount
            const discountAmount = (amount * coupon.discount) / 100;
            const capped = Math.min(discountAmount, coupon.maxDiscount);
            
            finalAmount = amount - capped;
            appliedCoupon = {
                code: coupon.code,
                discountAmount: capped
            };
        } else {
            return res.status(400).json({
                message: 'Invalid or expired coupon code'
            });
        }
    }
    
    // Create mock payment intent
    const intent = {
        id: `pi_${Math.random().toString(36).substr(2, 9)}`,
        amount: finalAmount,
        booking_id: bookingId,
        client_secret: `cs_${Math.random().toString(36).substr(2, 24)}`,
        coupon: appliedCoupon
    };
    
    res.status(200).json(intent);
};

// @desc    Process payment
// @route   POST /api/payments/process
// @access  Private
const processPayment = (req, res) => {
    const { bookingId, paymentMethod, transactionId } = req.body;
    
    // Check if booking exists
    const { bookings } = require('./bookingController');
    
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) {
        res.status(404);
        throw new Error('Booking not found');
    }
    
    // Check if payment already exists
    const paymentExists = payments.find(p => p.bookingId === bookingId && p.status === 'completed');
    if (paymentExists) {
        res.status(400);
        throw new Error('Payment already processed for this booking');
    }
    
    // Create new payment
    const newPayment = {
        id: (payments.length + 1).toString(),
        bookingId,
        userId: booking.userId,
        providerId: booking.providerId,
        amount: booking.amount,
        status: 'completed',
        paymentMethod,
        transactionId: transactionId || `txn_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString()
    };
    
    payments.push(newPayment);
    
    // Update booking payment status
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);
    if (bookingIndex !== -1) {
        bookings[bookingIndex].paymentStatus = 'paid';
    }
    
    res.status(201).json(newPayment);
};

// @desc    Get payment by ID
// @route   GET /api/payments/:id
// @access  Private
const getPaymentById = (req, res) => {
    const paymentId = req.params.id;
    const payment = payments.find(payment => payment.id === paymentId);
    
    if (!payment) {
        res.status(404);
        throw new Error('Payment not found');
    }
    
    res.json(payment);
};

// @desc    Get user's payment history
// @route   GET /api/payments/user/:userId
// @access  Private
const getUserPayments = (req, res) => {
    const userId = req.params.userId;
    const userPayments = payments.filter(payment => payment.userId === userId);
    
    // Sort by date (newest first)
    userPayments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(userPayments);
};

// @desc    Refund a payment
// @route   POST /api/payments/:id/refund
// @access  Private/Admin
const refundPayment = (req, res) => {
    const paymentId = req.params.id;
    
    const paymentIndex = payments.findIndex(payment => payment.id === paymentId);
    
    if (paymentIndex === -1) {
        res.status(404);
        throw new Error('Payment not found');
    }
    
    // Check if payment can be refunded
    if (payments[paymentIndex].status !== 'completed') {
        res.status(400);
        throw new Error('Only completed payments can be refunded');
    }
    
    // Update payment status
    payments[paymentIndex].status = 'refunded';
    
    // Update booking payment status
    const { bookings } = require('./bookingController');
    const bookingId = payments[paymentIndex].bookingId;
    
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);
    if (bookingIndex !== -1) {
        bookings[bookingIndex].paymentStatus = 'refunded';
    }
    
    res.json(payments[paymentIndex]);
};

// @desc    Get provider's payout history
// @route   GET /api/payments/provider/:providerId/payouts
// @access  Private
const getProviderPayouts = (req, res) => {
    const providerId = req.params.providerId;
    
    // For this demo, provider payouts are just completed payments to the provider
    const providerPayments = payments.filter(
        payment => payment.providerId === providerId && payment.status === 'completed'
    );
    
    // Calculate total earnings
    const totalEarnings = providerPayments.reduce((sum, payment) => sum + payment.amount, 0);
    
    // In a real application, we would apply service fees, etc.
    const serviceFeePercentage = 10;
    const providerPayouts = providerPayments.map(payment => ({
        id: `payout_${payment.id}`,
        paymentId: payment.id,
        bookingId: payment.bookingId,
        amount: payment.amount * (1 - serviceFeePercentage / 100),
        serviceFee: payment.amount * (serviceFeePercentage / 100),
        status: 'completed',
        createdAt: new Date(new Date(payment.createdAt).getTime() + 86400000).toISOString() // one day after payment
    }));
    
    res.json({
        payouts: providerPayouts,
        totalEarnings,
        totalPayouts: providerPayouts.reduce((sum, payout) => sum + payout.amount, 0)
    });
};

// @desc    Apply discount coupon
// @route   POST /api/payments/apply-coupon
// @access  Private
const applyDiscountCoupon = (req, res) => {
    const { couponCode, amount, userId } = req.body;
    
    // Find the coupon
    const coupon = coupons.find(c => c.code === couponCode && c.isActive);
    
    if (!coupon) {
        return res.status(400).json({
            message: 'Invalid or expired coupon code'
        });
    }
    
    // Check if minimum amount is met
    if (amount < coupon.minAmount) {
        return res.status(400).json({
            message: `Minimum amount for this coupon is $${coupon.minAmount}`
        });
    }
    
    // Check if coupon is for premium users only
    if (coupon.premiumOnly) {
        const { users } = require('./userController');
        const user = users.find(u => u.id === userId);
        
        if (!user || !user.isPremium) {
            return res.status(400).json({
                message: 'This coupon is only for premium users'
            });
        }
    }
    
    // Calculate discount
    const discountAmount = (amount * coupon.discount) / 100;
    const finalDiscount = Math.min(discountAmount, coupon.maxDiscount);
    const finalAmount = amount - finalDiscount;
    
    res.json({
        original: amount,
        discount: finalDiscount,
        final: finalAmount,
        coupon: {
            code: coupon.code,
            discount: coupon.discount,
            maxDiscount: coupon.maxDiscount
        }
    });
};

module.exports = {
    createPaymentIntent,
    processPayment,
    getPaymentById,
    getUserPayments,
    refundPayment,
    getProviderPayouts,
    applyDiscountCoupon
}; 