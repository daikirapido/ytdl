const express = require('express');
const axios = require('axios');
const app = express();

app.get('/', async (req, res) => {
    try {
        const link = req.query.url;
        if (!link) return res.status(400).json({ error: 'No url provided' });

        const rapido = `https://rapido.zetsu.xyz/api/ytdl?url=${encodeURIComponent(link)}`;
        const apiResponse = await axios.get(rapido);

        if (!apiResponse.data.url) {
            return res.status(500).json({ error: 'Failed to get video URL' });
        }

        const videoResponse = await axios({
            method: 'get',
            url: apiResponse.data.url,
            responseType: 'stream',
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });

        res.set({
            'Content-Type': 'video/mp4',
            'Content-Disposition': 'attachment'
        });

        videoResponse.data.pipe(res);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});