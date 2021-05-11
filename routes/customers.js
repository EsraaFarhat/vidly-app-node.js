const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const { Customer, validate } = require("../models/customer");

router.get("/", async (req, res) => {
  const customers = await Customer.find().sort("name");
  res.send(customers);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone,
  });
  await customer.save();
  res.send(customer);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let id = req.params.id;
  const customer = await Customer.findByIdAndUpdate(
    id,
    { name: req.body.name },
    { isGold: req.body.isGold },
    { phone: req.body.phone },
    { new: true, useFindAndModify: false }
  );

  if (!customer) return res.status(404).send("Customer not found");

  res.send(customer);
});

router.delete("/:id", auth, async (req, res) => {
  let id = req.params.id;
  const customer = await Customer.findByIdAndRemove(id, {
    useFindAndModify: false,
  });

  if (!customer) return res.status(404).send("Customer not found");

  res.send(customer);
});

router.get("/:id", async (req, res) => {
  let id = req.params.id;
  const customer = await Customer.findById(id);

  if (!customer) {
    return res.status(404).send("Customer not found");
  } else {
    res.send(customer);
  }
});

module.exports = router;
