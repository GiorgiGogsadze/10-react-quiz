export default function FinishedScreen({
  curPoints,
  maxPoints,
  disGame,
  highScore,
}) {
  const percentage = Math.round((curPoints / maxPoints) * 100);
  let emoji;
  if (percentage === 100) emoji = "🥇";
  if (percentage >= 80 && percentage < 100) emoji = "🎉";
  if (percentage >= 50 && percentage < 80) emoji = "🙃";
  if (percentage > 0 && percentage < 50) emoji = "🤨";
  if (percentage === 0) emoji = "🤦‍♂️";
  return (
    <>
      <div className="result">
        <p>
          {` ${emoji} `}
          You scored <strong>{curPoints}</strong> out of {maxPoints} (
          {percentage}%)
        </p>
      </div>
      <p className="highscore">(Highscore: {highScore} points)</p>
      <button
        className="btn btn-ui"
        onClick={() => disGame({ type: "restart" })}
      >
        Restart Quiz
      </button>
    </>
  );
}
