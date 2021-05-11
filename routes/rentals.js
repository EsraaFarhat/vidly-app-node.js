const auth = require("../middleware/auth");
const Fawn = require("fawn");
const express = require("express");
const router = express.Router();
const { Rental, validate } = require("../models/rental");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");
const mongoose = require("mongoose");

Fawn.init(mongoose);

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid customer!");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid movie!");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not in stock!");

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  new Fawn.Task()
    .save("rentals", rental)
    .update(
      "movies",
      { _id: movie._id },
      {
        $inc: { numberInStock: -1 },
      }
    )
    .run();

  res.send(rental);
});

router.get("/:id", async (req, res) => {
  let id = req.params.id;
  const rental = await Rental.findById(id);

  if (!rental) return res.status(404).send("Rental not found");

  res.send(rental);
});

module.exports = router;
