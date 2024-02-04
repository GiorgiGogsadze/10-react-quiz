import { useGame } from "../contexts/GameContext";

function Progressbar({ children }) {
  const { answerI, index, numQuestions } = useGame();
  const curValue = answerI === null ? index : index + 1;

  return (
    <header className="progress">
      <progress value={curValue} max={numQuestions} />
      {children}
    </header>
  );
}

export default Progressbar;
