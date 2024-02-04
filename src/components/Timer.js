import { useEffect, useState } from "react";
import { useGame } from "../contexts/GameContext";

function Timer() {
  const { maxTime, disGame } = useGame();
  const [time, setTime] = useState(maxTime);
  const mins = Math.trunc(time / 60);
  const secs = time % 60;
  useEffect(() => {
    let curSec = maxTime;
    const timerID = setInterval(() => {
      if (curSec === 1) disGame({ type: "finish" });
      else {
        curSec--;
        setTime((n) => n - 1);
      }
    }, 1000);
    return () => clearInterval(timerID);
  }, [disGame, maxTime]);
  return (
    <div className="timer">
      {mins < 10 && "0"}
      {mins}:{secs < 10 && "0"}
      {secs}
    </div>
  );
}

export default Timer;
