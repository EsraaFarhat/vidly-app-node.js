const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
// const asyncMiddleware = require('../middleware/async');
const express = require("express");
const router = express.Router();
const { Genre, validate } = require("../models/genre");

router.get("/", async (req, res, next) => {
  const genres = await Genre.find().sort("name");
  res.send(genres);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = new Genre({
    name: req.body.name,
  });

  await genre.save();
  res.send(genre);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let id = req.params.id;
  const genre = await Genre.findByIdAndUpdate(
    id,
    { name: req.body.name },
    { new: true, useFindAndModify: false }
  );

  if (!genre) return res.status(404).send("Genre not found");

  res.send(genre);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  let id = req.params.id;
  const genre = await Genre.findByIdAndRemove(id, { useFindAndModify: false });

  if (!genre) {
    return res.status(404).send("Genre not found");
  }

  res.send(genre);
});

router.get("/:id", async (req, res) => {
  let id = req.params.id;
  const genre = await Genre.findById(id);

  if (!genre) {
    return res.status(404).send("Genre not found");
  } else {
    res.send(genre);
  }
});

module.exports = router;
