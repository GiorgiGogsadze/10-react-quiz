import { useGame } from "../contexts/GameContext";

export default function Welcome() {
  const { numQuestions, disGame } = useGame();
  return (
    <div>
      <h2>Welcome to The React Quiz!</h2>
      <h3>{numQuestions} questions to test your React mastery</h3>
      <button className="btn" onClick={() => disGame({ type: "start" })}>
        Let's start
      </button>
    </div>
  );
}
