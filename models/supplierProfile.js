const mongoose = require('mongoose');

const supplierProfileSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    storeName: {
        type: String,
        required: true
    },
    description: String,
    logo: String,
    address: String,
    phone: String,
    socialMedia: {
        instagram: String,
        facebook: String,
        twitter: String
    },
    rating: {
        type: Number,
        default: 0
    },
    totalRatings: {
        type: Number,
        default: 0
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const SupplierProfile = mongoose.model('SupplierProfile', supplierProfileSchema);

module.exports = { SupplierProfile }; 