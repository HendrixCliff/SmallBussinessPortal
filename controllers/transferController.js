const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config({path: "./config.env"});

const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY;
const FLW_BASE_URL = process.env.FLW_BASE_URL;

// 🔹 Send Money (Transfer)
exports.sendMoney = async (req, res) => {
  try {
    const { account_number, bank_code, amount, narration } = req.body;

    const payload = {
      account_bank: bank_code, // Receiver's bank code (e.g., "044" for Access Bank)
      account_number, // Receiver's account number
      amount, // Amount to transfer
      currency: process.env.BASE_CURRENCY || "NGN",
      narration, // Description of transfer
      reference: `TX-${Date.now()}`,
      callback_url: "https://yourwebsite.com/callback",
      debit_currency: process.env.BASE_CURRENCY || "NGN",
    };

    const response = await axios.post(`${FLW_BASE_URL}/transfers`, payload, {
      headers: { Authorization: `Bearer ${FLW_SECRET_KEY}` },
    });

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || "Transfer failed" });
  }
};

// 🔹 Fetch Business Account Balance
exports.getBalance = async (req, res) => {
  try {
    const response = await axios.get(`${FLW_BASE_URL}/balances/NGN`, {
      headers: { Authorization: `Bearer ${FLW_SECRET_KEY}` },
    });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || "Failed to fetch balance" });
  }
};

// 🔹 Verify Transfer Status
exports.verifyTransfer = async (req, res) => {
  try {
    const { transaction_id } = req.params;

    const response = await axios.get(`${FLW_BASE_URL}/transfers/${transaction_id}`, {
      headers: { Authorization: `Bearer ${FLW_SECRET_KEY}` },
    });

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || "Failed to verify transfer" });
  }
};
