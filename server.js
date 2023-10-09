const express = require('express');
const ytdl = require('ytdl-core');
const app = express();
const port = 3001;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/download', async (req, res) => {
    try {
        const videoUrl = req.body.videoUrl;
        const format = req.body.format;

        if (!ytdl.validateURL(videoUrl)) {
            throw new Error('Invalid YouTube URL');
        }

        const info = await ytdl.getInfo(videoUrl);
        const title = info.videoDetails.title;

        // タイトルをエンコードして安全なファイル名を生成
        const safeFileName = encodeURIComponent(title);

        res.header('Content-Disposition', `attachment; filename="${safeFileName}.${format}"`);
        ytdl(videoUrl, { quality: 'highest' }).pipe(res);
    } catch (error) {
        console.error(error);
        res.status(500).sendFile(__dirname + '/error.html');
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}/`);
});
