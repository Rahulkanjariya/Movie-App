const Movies = require("../Models/Movies");

exports.ImportMovie = async (req,res) => {
    try {
        let { name } = req.body;
        let existingMovie = await Movies.findOne({ name })

        if(existingMovie){
            return res.status(400).json({
                success:false,
                message:"Movie already exists!"
            });
        }
        let imagepath = req.file.path;

        const newMovie = new Movies({
            userId:req.body.userId,
            name,
            desc:req.body.desc,
            category:req.body.category,
            language:req.body.language,
            date:req.body.date,
            video:req.body.video,
            image:imagepath
        });

        const savedMovie = await newMovie.save();

        res.status(200).json({
            success:true,
            message:"Movie added successfully",
            data:savedMovie
        });
    } catch (err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:"Server error"
        });
    }
};

exports.UpdateMovie = async (req,res) => {
    try {
        const movieId = req.body.movieId;
        const updatedMovieData = req.body;

        const updatedMovie = await Movies.findByIdAndUpdate(
            movieId,
            updatedMovieData,
            { new:true }
        )
        if(!updatedMovie){
            return res.status(404).json({
                success:false,
                message:"Movie not found!"
            });
        } else {
            res.status(200).json({
                success:true,
                message:"Movie updated successfully",
                movie:updatedMovie
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

exports.DeleteMovieById = async (req,res) => {
    try {
        const movieId = req.body.movieId;
        const deletedMovie = await Movies.findByIdAndDelete(movieId);

        if(!deletedMovie){
            return res.status(404).json({
                success:false,
                message:"Movie not found"
            });
        } else {
            res.status(200).json({
                success:true,
                message:"Movie deleted successfully",
                data:deletedMovie
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

exports.DeleteAllMovies = async (req,res) => {
    try {
        const movieCount = await Movies.countDocuments();
        
        if(!movieCount){
            return res.status(404).json({
                success:false,
                message:"Movie not found!"
            });
        } else {
            const deletedMovies = await Movies.deleteMany({});
            res.status(200).json({
                success:true,
                message:"All Movies deleted successfully",
                deletedCount:deletedMovies.deletedCount
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

exports.GetMovies = async (req,res) => {
    try {
        let { page=1, pageSize=10 } = req.query;

        page = parseInt(page);
        pageSize = parseInt(pageSize);

        const skipCount = (page - 1) * pageSize;

        let movies = await Movies.find()
        .skip(skipCount)
        .limit(pageSize);

        if(!movies){
            return res.status(404).json({
                success:false,
                message:"No movies found for the given page"
            });
        }
        const totalMoviesCount = await Movies.countDocuments();
        const totalPages = Math.ceil(totalMoviesCount / pageSize);
        
        res.status(200).json({
            success:true,
            "message":"Movie find successfully",
            movies,
            page,
            totalPages,
            totalMoviesCount
        });
    
    } catch (err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:"Server error"
        });
    }
};

exports.GetMovieById = async (req,res) => {
    try {
        const movieId = req.body.movieId;
        const movie = await Movies.findById(movieId);

        if(!movie){
            return res.status(404).json({
                success:false,
                message:"Movie not found!"
            });
        } else {
            res.status(200).json({
                success:true,
                message:"Movie find successfully",
                movie
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


