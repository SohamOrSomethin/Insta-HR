const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  orderId: { type: DataTypes.STRING, allowNull: false },
  paymentId: { type: DataTypes.STRING },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  currency: { type: DataTypes.STRING, defaultValue: 'INR' },
  plan: { type: DataTypes.ENUM('standard', 'premium', 'enterprise'), allowNull: false },
  planName: { type: DataTypes.STRING },
  status: { type: DataTypes.ENUM('created', 'success', 'failed'), defaultValue: 'created' },
  expiresAt: { type: DataTypes.DATE },
}, { tableName: 'Payments', timestamps: true });

module.exports = Payment;
