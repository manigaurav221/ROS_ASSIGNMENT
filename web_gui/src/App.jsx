// App.jsx
//
// React GUI that connects to ROS 2 through rosbridge using roslibjs.
// Level 1 Extension:
// - Send Message to ROS
// - Start Recording
// - Stop Recording
// - Reset
//
// All buttons publish std_msgs/String messages to the /button_press topic.

import { useEffect, useRef, useState } from 'react';
import ROSLIB from 'roslib';

function defaultRosbridgeUrl() {
  if (typeof window !== 'undefined' && window.location) {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${wsProtocol}//${window.location.host}/rosbridge`;
  }
  return 'ws://localhost:9090';
}

const ROSBRIDGE_URL =
  import.meta.env.VITE_ROSBRIDGE_URL || defaultRosbridgeUrl();

export default function App() {
  const [status, setStatus] = useState('disconnected');
  const [clickCount, setClickCount] = useState(0);
  const [temperature, setTemperature] = useState('--');

  const rosRef = useRef(null);
  const topicRef = useRef(null);
  const temperatureTopicRef = useRef(null);

  useEffect(() => {
    const ros = new ROSLIB.Ros({
      url: ROSBRIDGE_URL,
    });

    rosRef.current = ros;

    ros.on('connection', () => setStatus('connected'));
    ros.on('error', () => setStatus('error'));
    ros.on('close', () => setStatus('disconnected'));

    topicRef.current = new ROSLIB.Topic({
      ros,
      name: '/button_press',
      messageType: 'std_msgs/String',
    });
    temperatureTopicRef.current = new ROSLIB.Topic({
      ros,
      name: '/sensor/temperature',
      messageType: 'std_msgs/Float32',
    });

    temperatureTopicRef.current.subscribe((message) => {
      setTemperature(message.data.toFixed(2));
    });

    return () => {
      ros.close();
    };
  }, []);

  // ----------------------------
  // Helper function to publish any message
  // ----------------------------
  const publishMessage = (text) => {
    const message = new ROSLIB.Message({
      data: text,
    });

    if (topicRef.current) {
      topicRef.current.publish(message);
    }
  };

  // ----------------------------
  // Button Handlers
  // ----------------------------

  const handleSendMessage = () => {
    const nextCount = clickCount + 1;
    setClickCount(nextCount);

    publishMessage(
      `Button clicked from React GUI. Count = ${nextCount}`
    );
  };

  const handleStartRecording = () => {
    publishMessage('START_RECORDING');
  };

  const handleStopRecording = () => {
    publishMessage('STOP_RECORDING');
  };

  const handleReset = () => {
    setClickCount(0);
    publishMessage('RESET');
  };

  // ----------------------------
  // Styles
  // ----------------------------

  const styles = {
    page: {
      fontFamily: 'system-ui, Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f4f6f8',
      color: '#1a1a1a',
      margin: 0,
    },

    card: {
      backgroundColor: '#ffffff',
      padding: '2.5rem',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      textAlign: 'center',
      maxWidth: '450px',
      width: '90%',
    },

    title: {
      marginTop: 0,
      fontSize: '1.6rem',
    },

    status: {
      display: 'inline-block',
      padding: '0.4rem 0.9rem',
      borderRadius: '999px',
      fontWeight: 600,
      fontSize: '0.9rem',
      marginBottom: '1.5rem',
      color: '#ffffff',
      backgroundColor:
        status === 'connected'
          ? '#22a06b'
          : status === 'error'
          ? '#d9480f'
          : '#868e96',
    },

    buttonContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },

    button: {
      fontSize: '1rem',
      fontWeight: 600,
      padding: '0.9rem 1.5rem',
      border: 'none',
      borderRadius: '8px',
      backgroundColor:
        status === 'connected'
          ? '#1971c2'
          : '#adb5bd',
      color: '#ffffff',
      cursor:
        status === 'connected'
          ? 'pointer'
          : 'not-allowed',
      transition: 'background-color 0.2s',
    },

    count: {
      marginTop: '1.5rem',
      fontSize: '0.95rem',
      color: '#495057',
    },

    hint: {
      marginTop: '1.5rem',
      fontSize: '0.8rem',
      color: '#868e96',
    },
  };

  const statusText =
    status === 'connected'
      ? 'Connected to ROS 2'
      : status === 'error'
      ? 'Connection error'
      : 'Disconnected';

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          ROS 2 + React Starter
        </h1>

        <div style={styles.status}>
          {statusText}
        </div>

        <div style={styles.buttonContainer}>
          <button
            style={styles.button}
            onClick={handleSendMessage}
            disabled={status !== 'connected'}
          >
            Send Message to ROS
          </button>

          <button
            style={styles.button}
            onClick={handleStartRecording}
            disabled={status !== 'connected'}
          >
            Start Recording
          </button>

          <button
            style={styles.button}
            onClick={handleStopRecording}
            disabled={status !== 'connected'}
          >
            Stop Recording
          </button>

          <button
            style={styles.button}
            onClick={handleReset}
            disabled={status !== 'connected'}
          >
            Reset
          </button>
        </div>

        <div style={styles.count}>
          Messages sent: {clickCount}
        </div>
        <div
          style={{
          marginTop: "10px",
          fontSize: "1.1rem",
          fontWeight: "bold",
          color: "#1971c2",
          }}
        >
          Temperature: {temperature} °C
        </div>

        <div style={styles.hint}>
          Publishing <code>std_msgs/String</code> to{' '}
          <code>/button_press</code>
          <br />
          rosbridge: <code>{ROSBRIDGE_URL}</code>
        </div>
      </div>
    </div>
  );
}