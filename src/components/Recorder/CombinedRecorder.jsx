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
      await waitForVideoReady(screenVideo);
      screenVideo.play();

      webcamVideoRef.current.srcObject = webcamStream;
      await waitForVideoReady(webcamVideoRef.current);
      webcamVideoRef.current.play();

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
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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

    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
    }

    if (webcamStreamRef.current) {
      webcamStreamRef.current.getTracks().forEach((track) => track.stop());
      webcamStreamRef.current = null;
    }

    if (screenVideoRef.current) {
      screenVideoRef.current.srcObject = null;
      screenVideoRef.current.remove();
      screenVideoRef.current = null;
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

      if (screenVideo.readyState !== 4 || webcamVideo.readyState !== 4) {
        animationFrameIdRef.current = requestAnimationFrame(draw);
        return;
      }

      // Set canvas dimensions to match the screen video
      canvas.width = screenVideo.videoWidth;
      canvas.height = screenVideo.videoHeight;

      // Draw the screen video
      ctx.drawImage(screenVideo, 0, 0, canvas.width, canvas.height);

      // Define the size and position of the webcam video overlay
      const webcamWidth = canvas.width * 0.25;
      const webcamHeight = (webcamVideo.videoHeight / webcamVideo.videoWidth) * webcamWidth;
      const margin = 20;

      // Draw the webcam video in the top-right corner
      ctx.drawImage(webcamVideo, canvas.width - webcamWidth - margin, margin, webcamWidth, webcamHeight);

      // Queue the next frame
      animationFrameIdRef.current = requestAnimationFrame(draw);
    };

    // Start the drawing loop
    animationFrameIdRef.current = requestAnimationFrame(draw);
  };

  const waitForVideoReady = (videoElement) => {
    return new Promise((resolve) => {
      videoElement.onloadedmetadata = () => {
        resolve();
      };
    });
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
        <Button onClick={stopRecording} label="Stop Recording" color="red" recording={recording} />
      )}
      {videoURL && (
        <>
          <VideoPlayer src={videoURL} title="Combined Recording" />
          <DownloadButton webmUrl={URL.createObjectURL(videoBlob)} filename={filename} />
        </>
      )}
      <video ref={webcamVideoRef} style={{ display: 'none' }} />
      <video ref={screenVideoRef} style={{ display: 'none' }} />
      <canvas ref={canvasRef} style={{ visibility: 'hidden' }} />
    </div>
  );
};

export default CombinedRecorder;