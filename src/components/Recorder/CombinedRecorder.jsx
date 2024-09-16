import React, { useState, useEffect, useRef } from 'react';
import VideoPlayer from '../UI/VideoPlayer';
import Button from '../UI/Button';
import DownloadButton from '../UI/DownloadButton';
import axios from 'axios';
import styles from './Recorder.module.css';

const CombinedRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState(null);
  const [videoURL, setVideoURL] = useState(null);
  const [filename, setFilename] = useState(null);

  const canvasRef = useRef(null);
  const webcamVideoRef = useRef(null);
  const screenVideoRef = useRef(null);

  const screenStreamRef = useRef(null);
  const webcamStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const animationFrameIdRef = useRef(null);

  const startRecording = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: 'screen' },
        audio: true,
      });

      const webcamStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      screenStreamRef.current = screenStream;
      webcamStreamRef.current = webcamStream;

      const screenVideo = document.createElement('video');
      screenVideo.srcObject = screenStream;
      screenVideoRef.current = screenVideo;

      const webcamVideo = webcamVideoRef.current;
      webcamVideo.srcObject = webcamStream;

      // Ensure the videos are ready before starting recording
      await Promise.all([
        new Promise((resolve) => screenVideo.onloadedmetadata = resolve),
        new Promise((resolve) => webcamVideo.onloadedmetadata = resolve),
      ]);

      screenVideo.play();
      webcamVideo.play();

      drawCanvas();

      const canvasStream = canvasRef.current.captureStream(30);
      const combinedAudioTracks = [
        ...screenStream.getAudioTracks(),
        ...webcamStream.getAudioTracks(),
      ];

      const combinedStream = new MediaStream([
        ...canvasStream.getVideoTracks(),
        ...combinedAudioTracks,
      ]);

      mediaRecorderRef.current = new MediaRecorder(combinedStream, { mimeType: 'video/webm' });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = handleStop;
      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      console.error('Error starting combined recording:', err);
      alert(`Error: ${err.message}`);
      stopStreams();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const handleStop = () => {
    const blob = new Blob(chunksRef.current, { type: 'video/webm' });
    chunksRef.current = [];
    setVideoBlob(blob);
    const url = URL.createObjectURL(blob);
    setVideoURL(url);
    uploadVideo(blob);
    stopStreams();
  };

  const uploadVideo = async (blob) => {
    const formData = new FormData();
    const filename = `combined-recording-${Date.now()}.webm`;
    setFilename(filename);
    formData.append('file', blob, filename);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Upload successful:', response.data);
      alert('Recording uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      alert(`Upload failed: ${error.message}`);
    }
  };

  const stopStreams = () => {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }

    screenStreamRef.current?.getTracks().forEach((track) => track.stop());
    webcamStreamRef.current?.getTracks().forEach((track) => track.stop());

    if (screenVideoRef.current) {
      screenVideoRef.current.srcObject = null;
      screenVideoRef.current.remove();
    }

    if (webcamVideoRef.current) {
      webcamVideoRef.current.srcObject = null;
    }

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const webcamVideo = webcamVideoRef.current;
    const screenVideo = screenVideoRef.current;

    const draw = () => {
      if (!recording) return;

      if (screenVideo.readyState < 2 || webcamVideo.readyState < 2) {
        animationFrameIdRef.current = requestAnimationFrame(draw);
        return;
      }

      canvas.width = screenVideo.videoWidth;
      canvas.height = screenVideo.videoHeight;

      ctx.drawImage(screenVideo, 0, 0, canvas.width, canvas.height);

      const webcamWidth = canvas.width * 0.25;
      const webcamHeight = (webcamVideo.videoHeight / webcamVideo.videoWidth) * webcamWidth;
      const margin = 20;

      ctx.drawImage(webcamVideo, canvas.width - webcamWidth - margin, margin, webcamWidth, webcamHeight);

      animationFrameIdRef.current = requestAnimationFrame(draw);
    };

    animationFrameIdRef.current = requestAnimationFrame(draw);
  };

  useEffect(() => {
    return () => {
      stopStreams();
    };
  }, []);

  return (
    <div className={styles.recorderContainer}>
      <h2>Combined Screen & Video Recorder</h2>
      {!recording ? (
        <Button onClick={startRecording} label="Start Combined Recording" />
      ) : (
        <Button onClick={stopRecording} label="Stop Recording" color="red" />
      )}
      {videoURL && (
        <>
          <VideoPlayer src={videoURL} title="Combined Recording" />
          <DownloadButton webmUrl={videoURL} filename={filename} />
        </>
      )}
      <video ref={webcamVideoRef} style={{ display: 'none' }} />
      <video ref={screenVideoRef} style={{ display: 'none' }} />
      <canvas ref={canvasRef} style={{ visibility: 'hidden' }} />
    </div>
  );
};

export default CombinedRecorder;
