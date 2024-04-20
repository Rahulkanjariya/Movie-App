const bcrypt = require("bcrypt");
const User = require("../Models/User");
const Movies = require("../Models/Movies");
const { UserJwtToken } = require("../Utils/Jwt");

exports.UserRegister = async (req,res) => {
    try {
        const { email, password, mobile } = req.body;

        const existingUser = await User.findOne({
            $or: [
                { email },
                { mobile }
            ]
        });

        if(existingUser){
            return res.status(400).json({
                success:false,
                message:`User ${email}, ${mobile} already exists!`
            })
        }

        if(password.length < 6){
            return res.status(400).json({
                success:false,
                message:"Password must be at least 6 characters"
            })
        }

        if (!/^\d{10}$/.test(mobile)) {
            return res.status(400).json({
                succuss:false,
                message:'Mobile number must be exactly 10 digits'
            });
        }

        const hash = await bcrypt.hash(password,10);

        const newUser = new User({
            fullName:req.body.fullName,
            email,
            password:hash,
            mobile,
            address:req.body.address
        });

        const savedUser = await newUser.save();

        res.status(200).json({
            success:true,
            message:"User register successfully",
            data:savedUser
        });
    } catch (err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:"Server error",
        });
    }
};

exports.UserLogin = async (req,res) => {
    try {
        const { email, password } = req.body;
        let userData = await User.findOne({ email });

        if(!userData){
            res.status(400).json({
                success:false,
                message:"Email is incorrect"
            });
        }
        const passwordMatch = await bcrypt.compare(password,userData.password);
        let token = await UserJwtToken(userData.id)

        if(!passwordMatch){
            res.status(400).json({
                success:false,
                message:"Invalid password"
            });
        } else {
            res.status(200).json({
                success:true,
                message:"User login successfully",
                userData,
                token
            });
        }
    } catch (err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:"Server error",
        });
    }
};

exports.ChangePassword = async (req,res) => {
    try {
        let { userId, currentPassword, newPassword } = req.body;
        let user = await User.findById(userId);

        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found!"
            });
        }
        let isPasswordValid = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if(!isPasswordValid){
            return res.status(400).json({
                success:false,
                message:"Current password is incorrect"
            });
        }
        let hashedPassword = await bcrypt.hash(newPassword,10);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            success:true,
            message:"Password updated successfully"
        });
    } catch (err){
        console.log(err);
        res.status(500).json({
            success:true,
            message:"Server error"
        });
    }
};


exports.UpdatedUser = async (req,res) => {
    try {
        let userId = req.body.userId;
        let user = await User.findById(userId);

        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found!"
            });
        }

        let updatedUser = await User.findByIdAndUpdate(
            userId,
            req.body,
            { new:true }
        );
        res.status(200).json({
            success:true,
            message:"User updated successfully",
            data:updatedUser
        });
    } catch (err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:"Server error"
        });
    }
};

exports.DeletedUser = async (req,res) => {
    try {
        let userId = req.body.userId;
        let user = await User.findByIdAndDelete(userId);

        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found!"
            });
        } else {
            res.status(200).json({
                success:true,
                message:"User deleted successfully",
                data:user
            });
        }
    } catch (err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:"Server error"
        });
    }
};

exports.GetUsers = async (req,res) => {
    try {
        let user = await User.find();
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found!"
            });
        } else {
            res.status(200).json({
                success:true,
                message:"User find successfully",
                data:user
            });
        }
    } catch (err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:"Server error"
        });
    }
};

exports.AddLikedMovie = async (req,res) => {
    try {
        const userId = req.body.userId;
        const movieId = req.body.movieId;

        const user = await User.findById(userId);

        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found!"
            });
        }
        if(user.likedMovies.includes(movieId)){
            return res.status(400).json({
                success:false,
                message:"Movie already liked by the user"
            });
        }
        user.likedMovies.push(movieId);
        await user.save();

        res.status(200).json({
            success:true,
            message:"Movie added to liked movies successfully",
            data:user
        })
    } catch (err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:"Server error"
        });
    }
};

exports.GetFavoriteMovies = async (req,res) => {
    try {
        const userId = req.body.userId;

        const user = await User.findById(userId).populate("likedMovies");

        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found!"
            });
        } else {
            res.status(200).json({
                success:true,
                favoriteMovies:user.likedMovies
            });
        }
    } catch (err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:"Server error"
        });
    }
};

exports.DeleteFavoriteMovie = async (req,res) => {
    try {
        const userId = req.body.userId;
        const movieId = req.body.movieId;

        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found!"
            });
        }
        const index = user.likedMovies.indexOf(movieId);
        if(index === -1){
            return res.status(404).json({
                success:false,
                message:"Movie not found in liked movies"
            });
        }
        user.likedMovies.splice(index,1);
        await user.save();

        res.status(200).json({
            success:true,
            message:"Favorite movie deleted successfully"
        });
    } catch (err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:"Server error"
        });
    }
};


exports.SearchMovies = async (req,res) => {
    try {
        const { name, category, date } = req.query;
        let query = {};

        if(name){
            query.name = name;
        }
        if(category){
            query.category = category;
        }
        if(date){
            query.date = date
        }

        const movies = await Movies.find(query);

        if(!movies){
            return res.status(404).json({
                success:false,
                message:"No movies found"
            });
        } else {
            res.status(200).json({
                success:true,
                message:"Movies found successfully",
                data:movies
            })
        }
    } catch (err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:"Server error"
        });
    }
};

exports.AddRating = async (req,res) => {
    try {
        let { movieId, star, comment, userId } = req.body;
        let movies = await Movies.findById(movieId);

        if(!movies){
            return res.status(404).json({
                success:false,
                message:"Movie not found!"
            });
        }
        movies.ratings.push({ star, comment, postedby:userId });
        await movies.save();

        const totalRatings = movies.ratings.length;
        const totalStars = movies.ratings.reduce((acc, curr) => acc + curr.star, 0);
        const totalRating = totalStars / totalRatings;

        movies.totalrating = totalRating;
        await movies.save();

        res.status(200).json({
            success:true,
            message:"Rating added successfully",
            data:movies.totalrating
        });
    } catch (err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:"Server error"
        });
    }
};

exports.GetTotalRating = async (req,res) => {
    try {
        let { movieId } = req.body;
        let movies = await Movies.findById(movieId);

        if(!movies){
            return res.status(404).json({
                success:false,
                message:"Movie not found!"
            });
        } else {
            res.status(200).json({
                success:true,
                message:"Total rating retrieved successfully",
                data:movies.totalrating
            });
        }
    } catch (err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:"Server error"
        });
    }
};

