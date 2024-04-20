const router = require("express").Router();
const MovieController = require("../Controllers/MoviesController");
const upload = require("../Middleware/Upload");

router.post("/Import-Movie",upload,MovieController.ImportMovie);
router.put("/Update-Movie",MovieController.UpdateMovie);
router.delete("/Delete-Movie",MovieController.DeleteMovieById);
router.delete("/Delete-Movies",MovieController.DeleteAllMovies);
router.get("/Get-Movies",MovieController.GetMovies);
router.get("/Get-Movie",MovieController.GetMovieById);


module.exports = router