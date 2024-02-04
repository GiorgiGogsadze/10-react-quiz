import { useGame } from "../contexts/GameContext";

function Progressbar({ children }) {
  const { curValue, numQuestions } = useGame();

  return (
    <header className="progress">
      <progress value={curValue} max={numQuestions} />
      {children}
    </header>
  );
}

export default Progressbar;
