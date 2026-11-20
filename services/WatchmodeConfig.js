
const headers = {
    accept: "application/json",
    "X-API-Key": process.env.WATCHMODE_API_KEY
};

const watchmodeBASEURL = "https://api.watchmode.com/v1";

console.log(
    "API key loaded:",
    process.env.WATCHMODE_API_KEY ? "YES" : "NO"
);

const WATCHMODE_ENDPOINT = {
    fetchSearch: "/search/",
    fetchAutoComplete: "/autocomplete-search/",
    fetchNowPlaying: "/list-titles/?types=movie&sort_by=release_date_desc&page=1",
    fetchMovieDetails: (id) => `/title/${id}/details/`,
};

const watchmodeAPI = {
    get: async (endpoint) => {
        const url = watchmodeBASEURL + endpoint;

        const response = await fetch(url, {
            method: "GET",
            headers
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(
                `Watchmode Error ${response.status}: ${errorData}`
            );
        }

        return await response.json();
    }
};

module.exports = {watchmodeAPI,WATCHMODE_ENDPOINT}

// export { WATCHMODE_ENDPOINT };
// export default watchmodeAPI;
