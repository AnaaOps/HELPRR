// Import mock data
const { users } = require('./userController');
const { services } = require('./serviceController');
const { providers } = require('./providerController');

// Mock booking data for recommendations
const bookings = [
    { id: '1', userId: '1', serviceId: '1', providerId: '1', date: '2023-03-15T14:00:00Z', status: 'completed', rating: 5 },
    { id: '2', userId: '1', serviceId: '3', providerId: '3', date: '2023-03-20T10:00:00Z', status: 'completed', rating: 4 },
    { id: '3', userId: '1', serviceId: '5', providerId: '5', date: '2023-04-05T18:00:00Z', status: 'completed', rating: 5 },
    { id: '4', userId: '2', serviceId: '2', providerId: '2', date: '2023-03-18T09:00:00Z', status: 'completed', rating: 4 },
    { id: '5', userId: '2', serviceId: '4', providerId: '4', date: '2023-03-25T14:00:00Z', status: 'completed', rating: 5 },
    { id: '6', userId: '2', serviceId: '6', providerId: '6', date: '2023-04-10T11:00:00Z', status: 'completed', rating: 4 }
];

// @desc    Get personalized recommendations for a user
// @route   GET /api/recommendations/personalized/:userId
// @access  Private
const getPersonalizedRecommendations = (req, res) => {
    const userId = req.params.userId;
    
    // Check if user exists
    const user = users.find(user => user.id === userId);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    
    // Get user's past bookings
    const userBookings = bookings.filter(booking => booking.userId === userId);
    
    // If user has no bookings, return popular services
    if (userBookings.length === 0) {
        return res.json({
            message: 'No personalized recommendations available yet. Here are some popular services:',
            recommendations: getPopularServicesData()
        });
    }
    
    // Mock ML algorithm: Find categories the user has used before
    const userCategories = userBookings.map(booking => {
        const service = services.find(s => s.id === booking.serviceId);
        return service ? service.category : null;
    }).filter(Boolean);
    
    // Find additional services in those categories that the user hasn't tried yet
    const recommendedServices = services.filter(service => {
        // Service is in a category the user likes
        const categoryMatch = userCategories.includes(service.category);
        
        // User hasn't booked this service before
        const notBooked = !userBookings.some(booking => booking.serviceId === service.id);
        
        return categoryMatch && notBooked;
    });
    
    // If we don't have enough recommendations, add some popular services
    if (recommendedServices.length < 3) {
        const popularServices = getPopularServicesData()
            .filter(service => !recommendedServices.some(rec => rec.id === service.id));
        
        // Add enough popular services to get to 3 recommendations
        const neededCount = 3 - recommendedServices.length;
        recommendedServices.push(...popularServices.slice(0, neededCount));
    }
    
    res.json({
        message: 'Personalized recommendations based on your previous bookings:',
        recommendations: recommendedServices
    });
};

// @desc    Get most popular services
// @route   GET /api/recommendations/popular
// @access  Public
const getPopularServices = (req, res) => {
    res.json(getPopularServicesData());
};

// Helper function to get popular services
const getPopularServicesData = () => {
    // In a real system, this would query the database for most booked services
    // For this demo, we'll return a fixed set of "popular" services
    return [
        services.find(s => s.id === '1'), // Hair Styling
        services.find(s => s.id === '3'), // Car Maintenance
        services.find(s => s.id === '5'), // Meal Preparation
        services.find(s => s.id === '6')  // House Cleaning
    ].filter(Boolean);
};

// @desc    Get seasonal service recommendations
// @route   GET /api/recommendations/seasonal
// @access  Public
const getSeasonalRecommendations = (req, res) => {
    // In a real system, this would consider the current season/month
    const currentMonth = new Date().getMonth(); // 0-11 (Jan-Dec)
    
    let seasonalServices = [];
    
    // Mock seasonal recommendations based on current month
    if (currentMonth >= 2 && currentMonth <= 4) {
        // Spring (Mar-May): Cleaning and maintenance
        seasonalServices = services.filter(s => 
            s.category === 'Cleaning' || s.category === 'Plumbing');
    } else if (currentMonth >= 5 && currentMonth <= 7) {
        // Summer (Jun-Aug): Beauty and drivers
        seasonalServices = services.filter(s => 
            s.category === 'Beauty' || s.category === 'Drivers');
    } else if (currentMonth >= 8 && currentMonth <= 10) {
        // Fall (Sep-Nov): Car maintenance and cooking
        seasonalServices = services.filter(s => 
            s.category === 'Mechanics' || s.category === 'Cooking');
    } else {
        // Winter (Dec-Feb): Cooking and plumbing
        seasonalServices = services.filter(s => 
            s.category === 'Cooking' || s.category === 'Plumbing');
    }
    
    res.json({
        message: 'Seasonal service recommendations:',
        recommendations: seasonalServices
    });
};

// @desc    Get location-based service recommendations
// @route   GET /api/recommendations/location/:locationId
// @access  Public
const getLocationBasedServices = (req, res) => {
    const locationId = req.params.locationId;
    
    // In a real system, this would query providers near the location
    // For this demo, we'll simulate by returning providers with specific IDs
    const nearbyProviderIds = ['1', '3', '5']; // Mock nearby providers
    
    // Get services offered by nearby providers
    const nearbyServices = [];
    
    nearbyProviderIds.forEach(providerId => {
        const provider = providers.find(p => p.id === providerId);
        if (provider) {
            provider.services.forEach(serviceId => {
                const service = services.find(s => s.id === serviceId);
                if (service && !nearbyServices.some(ns => ns.id === service.id)) {
                    nearbyServices.push(service);
                }
            });
        }
    });
    
    res.json({
        message: `Recommended services near location ${locationId}:`,
        recommendations: nearbyServices
    });
};

// @desc    Get similar providers to a given provider
// @route   GET /api/recommendations/providers/similar/:providerId
// @access  Public
const getSimilarProviders = (req, res) => {
    const providerId = req.params.providerId;
    
    // Check if provider exists
    const provider = providers.find(p => p.id === providerId);
    if (!provider) {
        res.status(404);
        throw new Error('Provider not found');
    }
    
    // Get the services offered by this provider
    const providerServices = provider.services;
    
    // Find providers offering similar services but excluding the current provider
    const similarProviders = providers.filter(p => 
        p.id !== providerId && // Not the same provider
        p.services.some(serviceId => providerServices.includes(serviceId)) // Offers at least one similar service
    );
    
    res.json({
        message: `Providers similar to ${provider.name}:`,
        recommendations: similarProviders
    });
};

// @desc    Get recommended service packages for a user
// @route   GET /api/recommendations/packages/:userId
// @access  Private
const getRecommendedPackages = (req, res) => {
    const userId = req.params.userId;
    
    // Check if user exists
    const user = users.find(user => user.id === userId);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    
    // Define some mock service packages
    const packages = [
        {
            id: 'pkg1',
            name: 'Home Care Package',
            services: ['2', '6'], // Plumbing and Cleaning
            discount: 15, // 15% discount
            description: 'Complete home care package including plumbing service and house cleaning.'
        },
        {
            id: 'pkg2',
            name: 'Personal Care Package',
            services: ['1', '5'], // Beauty and Cooking
            discount: 10, // 10% discount
            description: 'Self-care package with beauty services and meal preparation.'
        },
        {
            id: 'pkg3',
            name: 'Transportation Package',
            services: ['3', '4'], // Car Maintenance and Driver
            discount: 12, // 12% discount
            description: 'Complete transportation solution with car maintenance and personal driver service.'
        }
    ];
    
    // In a real ML system, we'd recommend packages based on user behavior
    // For this demo, recommend based on user's premium status
    let recommendedPackages;
    
    if (user.isPremium) {
        // Premium users get all packages with extra discount
        recommendedPackages = packages.map(pkg => ({
            ...pkg,
            discount: pkg.discount + 5, // Extra 5% discount for premium users
            premiumExclusive: true
        }));
    } else {
        // Non-premium users get only basic packages
        recommendedPackages = packages.filter((_, index) => index < 2);
    }
    
    res.json({
        message: `Recommended service packages for ${user.name}:`,
        recommendations: recommendedPackages
    });
};

module.exports = {
    getPersonalizedRecommendations,
    getPopularServices,
    getSeasonalRecommendations,
    getLocationBasedServices,
    getSimilarProviders,
    getRecommendedPackages
}; 