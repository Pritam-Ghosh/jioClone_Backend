const { WATCHMODE_ENDPOINT, watchmodeAPI } = require("../services/WatchmodeConfig")


const handleGetCurrentMovie = async (req, resp) => {
    try {
        const currentMovieList = await watchmodeAPI.get(WATCHMODE_ENDPOINT.fetchNowPlaying)

        resp.status(200).json({
            status: "success",
            message: currentMovieList

        })
    } catch (err) {
        console.log("Movie API Error:", err.message);

        resp.status(502).json({
            status: "failure",
            message: err.message
        });
    }
}

const handleGetMovieDetails = async (req, resp) => {
    try {
        const movieDetails = await watchmodeAPI.get(WATCHMODE_ENDPOINT.fetchMovieDetails(req.params.id))
console.log("Trailer data:", movieDetails);
        resp.status(200).json({
            status: "success",
            message: movieDetails
        })

    } catch (err) {
        resp.status(500).json({
            status: "failure",
            message: err.message
        });
    }
};

module.exports = { handleGetCurrentMovie, handleGetMovieDetails }