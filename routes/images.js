const { Router } = require("express");
const { check } = require("express-validator");
const { serveImage } = require("../controllers/image.controller");

const router = Router();

router.get("/:collection/:name", serveImage);

module.exports = router;
