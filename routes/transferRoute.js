const express = require("express");
const { sendMoney, getBalance, verifyTransfer } = require("../controllers/transferController");

const router = express.Router();

router.post("/transfer", sendMoney);
router.get("/balance", getBalance);
router.get("/transfer/:transaction_id", verifyTransfer);

module.exports = router;
