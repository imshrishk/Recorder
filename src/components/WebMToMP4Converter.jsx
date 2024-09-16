// src/components/WebMToMP4Converter.jsx
import React, { useState, useEffect } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const WebMToMP4Converter = () => {
  const [ffmpeg, setFfmpeg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadFFmpeg = async () => {
      try {
        const ffmpegInstance = createFFmpeg({ log: true });
        await ffmpegInstance.load();
        setFfmpeg(ffmpegInstance);
      } catch (err) {
        setError('Failed to load FFmpeg');
      }
    };
    loadFFmpeg();
  }, []);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setError('');
    setLoading(true);

    try {
      if (!ffmpeg) throw new Error('FFmpeg is not loaded');

      // Write the input file to the FFmpeg virtual file system
      ffmpeg.FS('writeFile', file.name, await fetchFile(file));
      
      // Run the FFmpeg command to convert the file
      await ffmpeg.run('-i', file.name, 'output.mp4');
      
      // Read the output file from the FFmpeg virtual file system
      const data = ffmpeg.FS('readFile', 'output.mp4');

      // Create a Blob and generate a URL for the video
      const videoBlob = new Blob([data.buffer], { type: 'video/mp4' });
      const videoUrl = URL.createObjectURL(videoBlob);
      setVideoUrl(videoUrl);
    } catch (err) {
      setError('Conversion failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>WebM to MP4 Converter</h1>
      <input type="file" accept="video/webm" onChange={handleFileChange} />
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {videoUrl && (
        <div>
          <video controls src={videoUrl} />
          <a href={videoUrl} download="converted.mp4">
            <button>Download MP4</button>
          </a>
        </div>
      )}
    </div>
  );
};

export default WebMToMP4Converter;
