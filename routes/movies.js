const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");

router.get("/", async (req, res) => {
  const movies = await Movie.find().sort("name");
  res.send(movies);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre!");

  const movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });
  await movie.save();
  res.send(movie);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre!");

  let id = req.params.id;
  const movie = await Movie.findByIdAndUpdate(
    id,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    },
    { new: true, useFindAndModify: false }
  );

  if (!movie) return res.status(404).send("Movie not found");

  res.send(movie);
});

router.delete("/:id", auth, async (req, res) => {
  let id = req.params.id;
  const movie = await Movie.findByIdAndRemove(id, { useFindAndModify: false });

  if (!movie) return res.status(404).send("Movie not found");

  res.send(movie);
});

router.get("/:id", async (req, res) => {
  let id = req.params.id;
  const movie = await Movie.findById(id);

  if (!movie) return res.status(404).send("Movie not found");

  res.send(movie);
});

module.exports = router;
