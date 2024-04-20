const router = require("express").Router();
const UserController = require("../Controllers/UserController");
const { UserVerifyToken } = require("../Middleware/Auth");

router.post("/User-Register",UserController.UserRegister);
router.post("/User-Login",UserController.UserLogin);
router.put("/Change-Password",UserVerifyToken,UserController.ChangePassword);
router.put("/Update-User",UserVerifyToken,UserController.UpdatedUser);
router.delete("/Delete-User",UserVerifyToken,UserController.DeletedUser);
router.get("/Get-Users",UserVerifyToken,UserController.GetUsers);

router.post("/Add-Favorite-Movie",UserController.AddLikedMovie);
router.get("/Get-Favorite-Movie",UserController.GetFavoriteMovies);
router.delete("/Delete-Favorite-Movie",UserController.DeleteFavoriteMovie);

router.get("/Search-Movies",UserController.SearchMovies);

router.put("/Add-Rating",UserController.AddRating);
router.get("/Total-Rating",UserController.GetTotalRating);



module.exports = router;