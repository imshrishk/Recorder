// src/hooks/useRecorder.js

import { useState, useRef } from 'react';
import axios from 'axios';
import { generateUniqueFilename, handleError } from '../utils/helpers';

/**
 * useRecorder Hook
 *
 * Manages media recording functionality for screen, video, or combined recording.
 *
 * @param {string} mode - The recording mode: 'screen', 'video', or 'combined'.
 * @returns {object} - Contains recording state, video URL, filename, and control functions.
 */
const useRecorder = (mode = 'screen') => {
  const [recording, setRecording] = useState(false);
  const [videoURL, setVideoURL] = useState(null);
  const [filename, setFilename] = useState('');
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamsRef = useRef([]);

  /**
   * Starts the recording based on the selected mode.
   */
  const startRecording = async () => {
    try {
      let stream;

      if (mode === 'screen') {
        stream = await navigator.mediaDevices.getDisplayMedia({
          video: { mediaSource: 'screen' },
          audio: true,
        });
      } else if (mode === 'video') {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
      } else if (mode === 'combined') {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: { mediaSource: 'screen' },
          audio: true,
        });
        const webcamStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        // Combine streams
        stream = new MediaStream([
          ...screenStream.getVideoTracks(),
          ...webcamStream.getVideoTracks(),
          ...screenStream.getAudioTracks(),
          ...webcamStream.getAudioTracks(),
        ]);

        // Keep references to stop tracks later
        streamsRef.current = [screenStream, webcamStream];
      }

      // Initialize MediaRecorder
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' });
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      mediaRecorderRef.current.onstop = handleStop;
      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      handleError(err);
    }
  };

  /**
   * Stops the ongoing recording.
   */
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  /**
   * Handles the stop event of the MediaRecorder.
   */
  const handleStop = () => {
    const blob = new Blob(chunksRef.current, { type: 'video/webm' });
    chunksRef.current = [];
    const url = URL.createObjectURL(blob);
    const uniqueFilename = generateUniqueFilename(mode);
    setFilename(uniqueFilename);
    setVideoURL(url);
    uploadVideo(blob, uniqueFilename);
  };

  /**
   * Uploads the recorded video to the server.
   *
   * @param {Blob} blob - The recorded video blob.
   * @param {string} uniqueFilename - The filename for the recording.
   */
  const uploadVideo = async (blob, uniqueFilename) => {
    const formData = new FormData();
    formData.append('file', blob, uniqueFilename);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Upload successful:', response.data);
    } catch (error) {
      handleError(error);
    }
  };

  /**
   * Stops all active media streams.
   */
  const stopStreams = () => {
    if (streamsRef.current.length > 0) {
      streamsRef.current.forEach((stream) => {
        stream.getTracks().forEach((track) => track.stop());
      });
      streamsRef.current = [];
    }
  };

  return {
    recording,
    videoURL,
    filename,
    startRecording,
    stopRecording,
    stopStreams, // Exposed for clean-up if needed
  };
};

export default useRecorder;