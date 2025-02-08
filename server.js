const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"; // Replace with your API key

app.post("/calculate-distance", async (req, res) => {
    try {
        const { pickup, dropoff } = req.body;

        if (!pickup || !dropoff) {
            return res.status(400).json({ error: "Pickup and dropoff addresses are required." });
        }

        const response = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json`, {
            params: {
                origins: pickup,
                destinations: dropoff,
                key: GOOGLE_MAPS_API_KEY
            }
        });

        if (response.data.status !== "OK") {
            return res.status(500).json({ error: "Failed to fetch distance." });
        }

        const distanceInMeters = response.data.rows[0].elements[0].distance.value;
        const distanceInKm = distanceInMeters / 1000;
        const fare = distanceInKm * 50; // R50 per km

        res.json({
            distance: `${distanceInKm.toFixed(2)} km`,
            fare: `R${fare.toFixed(2)}`
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
