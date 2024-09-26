import React, { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as posenet from '@tensorflow-models/posenet';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

const Proctoring = ({ onAlert }) => {
  const videoRef = useRef(null);
  const alertCountRef = useRef(0);

  useEffect(() => {
    const setupCamera = async () => {
      const video = videoRef.current;
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
      return new Promise((resolve) => {
        video.onloadedmetadata = () => {
          resolve(video);
        };
      });
    };

    const loadModels = async () => {
      const posenetModel = await posenet.load();
      const cocoSsdModel = await cocoSsd.load();
      return { posenetModel, cocoSsdModel };
    };

    const detect = async (posenetModel, cocoSsdModel) => {
      const video = videoRef.current;
      const poses = await posenetModel.estimateSinglePose(video, { flipHorizontal: false });
      const predictions = await cocoSsdModel.detect(video);

      console.log('Poses:', poses);
      console.log('Predictions:', predictions);

      let mobileDetected = false;
      let audioDeviceDetected = false;
      let personDetected = false;
      const audioDevices = ['headphones', 'earbuds'];
      const deviceClasses = new Set(audioDevices);

      let detectedPeople = 0;

      predictions.forEach(prediction => {
        if (prediction.class === 'cell phone' || prediction.class === 'laptop' || prediction.class === 'keyboard' || prediction.class === 'remote' || prediction.class === 'mouse' || prediction.class === 'tablet' || prediction.class === 'camera') {
          mobileDetected = true;
        }

        if (deviceClasses.has(prediction.class)) {
          audioDeviceDetected = true;
        }

        if (prediction.class === 'person') {
          detectedPeople++;
        }
      });

      const keypoints = poses.keypoints;
      const faceDetected = keypoints.some(point => point.part === 'nose' && point.score > 0.5);

      if (mobileDetected) {
        onAlert('Electronic Device detected');
      } else if (audioDeviceDetected) {
        onAlert('Headphones or Earbuds detected');
      } else if (detectedPeople === 0 && !faceDetected) {
        onAlert('No person detected');
      } else if (detectedPeople > 1) {
        onAlert('More than one person detected');
      }

      requestAnimationFrame(() => detect(posenetModel, cocoSsdModel));
    };

    const main = async () => {
      await setupCamera();
      const { posenetModel, cocoSsdModel } = await loadModels();
      detect(posenetModel, cocoSsdModel);
    };

    main();
  }, [onAlert]);

  return (
    <div>
      <video ref={videoRef} autoPlay style={{ width: '200px', height: '150px', position: 'fixed', bottom: '10px', right: '10px', border: '1px solid black' }}></video>
    </div>
  );
};

export default Proctoring;
