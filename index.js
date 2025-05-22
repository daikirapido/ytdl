const express = require('express');
const axios = require('axios');
const app = express();

app.get('/', async (req, res) => {
    try {
        const link = req.query.url;
        if (!link) return res.status(400).json({ error: 'No url provided.' });

        const rapido = `https://rapido.zetsu.xyz/api/ytdl?url=${encodeURIComponent(link)}`;
        const api = await axios.get(rapido);

        const video = await axios.get(api.data.url, { responseType: 'arraybuffer' });

        res.set('Content-Type', 'video/mp4');
        res.send(Buffer.from(video.data));

    } catch (error) {
        res.json({ error: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});