const express = require("express");
const purchaseController = require("../controller/purchase");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.get("/premium-membership", authMiddleware.athenticate, purchaseController.premiumPurchase);

router.post("/premium-membership", authMiddleware.athenticate, purchaseController.premiumPayment);
router.post("/premium-membership-fail", authMiddleware.athenticate, purchaseController.premiumfails);

module.exports = router ;