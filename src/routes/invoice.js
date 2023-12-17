const { Router } = require("express");
const { config } = require("dotenv");
config();
const path = require("path");
const { userAuth } = require("../middlewares/auth-middleware");

const {
  getAllInvoices,
  getInvoice,
  deleteInvoice,
  updateInvoice,
  createInvoice,
} = require("../controllers/invoice");

const router = Router();

router.post("/invoiceCreate", createInvoice);
router.put("/invoiceUpdate/:id", updateInvoice);

router.get("/allInvoices", getAllInvoices);
router.get("/:id", getInvoice);
router.delete("/deleteInvoice/:id", deleteInvoice);

module.exports = router;
