import { useGame } from "../contexts/GameContext";

export default function NextButton() {
  const { answerI, index, numQuestions, disGame } = useGame();
  if (answerI === null) return null;
  return index !== numQuestions - 1 ? (
    <button
      className="btn btn-ui"
      onClick={() => disGame({ type: "nextQuestion" })}
    >
      Next
    </button>
  ) : (
    <button className="btn btn-ui" onClick={() => disGame({ type: "finish" })}>
      Finish
    </button>
  );
}
