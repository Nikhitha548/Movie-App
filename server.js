const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
const PORT = 3000;


app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));


mongoose.connect(
    "mongodb+srv://<db_username>:<db_password>@cluster0.crltcsk.mongodb.net/?appName=Cluster0"
)
.then(() => {
    console.log("MongoDB connected successfully");
})
.catch((error) => {
    console.log("MongoDB connection error:", error);
});


const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
});


const Movie = mongoose.model("Movie", movieSchema);


app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "public", "index.html")
    );
});


app.get("/api/movies", async (req, res) => {
    try {
        const movies = await Movie.find();

        res.json(movies);
    } catch (error) {
        res.status(500).json({
            error: "Could not get movies"
        });
    }
});


app.post("/api/movies", async (req, res) => {
    try {
        const movie = new Movie({
            title: req.body.title,
            description: req.body.description,
            image: req.body.image
        });

        await movie.save();

        res.status(201).json(movie);
    } catch (error) {
        res.status(500).json({
            error: "Could not add movie"
        });
    }
});

app.delete("/api/movies/:id", async (req, res) => {
    try {
        await Movie.findByIdAndDelete(req.params.id);

        res.json({
            message: "Movie deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            error: "Could not delete movie"
        });
    }
});


app.listen(PORT, () => {
    console.log(
        `CineVerse running at http://localhost:${PORT}`
    );
});