import { useEffect, useState } from 'react';
import './App.css';

function App() {
  // State for tracking time in milliseconds
  const [time, setTime] = useState(0);

  // State to track whether the stopwatch is running
  const [isRunning, setIsRunning] = useState(false);

  // State to keep track of laps
  const [laps, setLaps] = useState([]);

  // Functions to format time into hours, minutes, and seconds
  const getH = ms => ('0' + (ms / 10) % 100).slice(-2);
  const getS = ms => ('0' + Math.floor((ms / 1000) % 60)).slice(-2);
  const getM = ms => ('0' + Math.floor((ms / 1000 / 60) % 60)).slice(-2);

  // Function to format milliseconds into a time string
  const formatTime = ms => `${getM(ms)}:${getS(ms)}:${getH(ms)}`;

  // useEffect hook to handle the stopwatch functionality
  useEffect(() => {
    let interval;

    // If the stopwatch is running, increment the time every 10ms
    if (isRunning) {
      interval = setInterval(() => setTime(time => time + 10), 10);
    }

    // Clean up interval on component unmount or when the stopwatch stops
    return () => { clearInterval(interval); }
  }, [isRunning]);

  // useEffect hook to update laps
  useEffect(() => {
    if (time) {
      // Calculate the time for the latest lap
      const rest = laps.slice(0, laps.length - 1);
      const last = time - rest.reduce((acc, v) => acc + v, 0);
      setLaps([...rest, last]);
    } else {
      // Reset laps when time is reset
      setLaps([]);
    }
  }, [time]);

  return (
    <div className="App">
      {/* Display formatted time */}
      <div className='display'>{formatTime(time)}</div>
      
      {/* Buttons for controlling the stopwatch */}
      <div className='buttons'>
        {!isRunning && !time && <button onClick={() => setIsRunning(true)}>Start</button>}
        {!isRunning && time > 0 && <button onClick={() => setIsRunning(true)}>Resume</button>}
        {isRunning && time > 0 && <button onClick={() => setLaps([...laps, 0])}>Lap</button>}
        {isRunning && <button onClick={() => setIsRunning(false)}>Stop</button>}
        {!isRunning && time > 0 && <button onClick={() => setTime(0)}>Reset</button>}
      </div>

      {/* Display laps */}
      <div className='laps'>
        {laps.map((lap, i) => <div key={i}>Lap {i + 1}: {formatTime(lap)}</div>)}
      </div>
    </div>
  );
}

export default App;
