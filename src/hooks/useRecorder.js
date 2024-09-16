// src/hooks/useRecorder.js

import { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { generateUniqueFilename, handleError } from '../utils/helpers';

const useRecorder = (mode = 'screen') => {
  const [recording, setRecording] = useState(false);
  const [videoURL, setVideoURL] = useState(null);
  const [filename, setFilename] = useState('');
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamsRef = useRef([]);

  const startRecording = useCallback(async () => {
    try {
      let stream;

      switch (mode) {
        case 'screen':
          stream = await navigator.mediaDevices.getDisplayMedia({
            video: { mediaSource: 'screen' },
            audio: true,
          });
          break;
        case 'video':
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          break;
        case 'combined':
          const screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: { mediaSource: 'screen' },
            audio: true,
          });
          const webcamStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          stream = new MediaStream([
            ...screenStream.getVideoTracks(),
            ...webcamStream.getVideoTracks(),
            ...screenStream.getAudioTracks(),
            ...webcamStream.getAudioTracks(),
          ]);
          streamsRef.current = [screenStream, webcamStream];
          break;
        default:
          throw new Error('Invalid recording mode');
      }

      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });
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
  }, [mode]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  }, [recording]);

  const handleStop = useCallback(() => {
    const blob = new Blob(chunksRef.current, { type: 'video/webm' });
    chunksRef.current = [];
    const url = URL.createObjectURL(blob);
    const uniqueFilename = generateUniqueFilename(mode);
    setFilename(uniqueFilename);
    setVideoURL(url);
    uploadVideo(blob, uniqueFilename);
  }, [mode]);

  const uploadVideo = useCallback(async (blob, uniqueFilename) => {
    const formData = new FormData();
    formData.append('file', blob, uniqueFilename);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Upload successful:', response.data);
    } catch (error) {
      handleError(error);
    }
  }, []);

  const stopStreams = useCallback(() => {
    streamsRef.current.forEach((stream) => {
      stream.getTracks().forEach((track) => track.stop());
    });
    streamsRef.current = [];
  }, []);

  return {
    recording,
    videoURL,
    filename,
    startRecording,
    stopRecording,
    stopStreams,
  };
};

export default useRecorder;