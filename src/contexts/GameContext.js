import { createContext, useContext, useEffect, useReducer } from "react";

const GameContext = createContext();

const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) throw new Error("game context is undefined");
  return context;
};

const initialGameState = {
  questions: [],
  status: "loading", //loading, error, ready, active, finished
  index: 0,
  curPoints: 0,
  answerI: null,
  highScore: 0,
};

const redGame = (state, action) => {
  switch (action.type) {
    case "loading":
      return { ...state, status: "loading" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "dataReceived":
      return {
        ...state,
        status: "ready",
        questions: action.payload,
      };
    case "start":
      return { ...state, status: "active" };
    case "newAnswer": {
      const currentQuestion = state.questions[state.index];
      const newCurPoints =
        action.payload === currentQuestion.correctOption
          ? state.curPoints + currentQuestion.points
          : state.curPoints;
      return {
        ...state,
        curPoints: newCurPoints,
        answerI: action.payload,
      };
    }
    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,
        answerI: null,
      };
    case "finish":
      return {
        ...state,
        status: "finished",
        highScore:
          state.highScore <= state.curPoints
            ? state.curPoints
            : state.highScore,
      };
    case "restart":
      return {
        ...initialGameState,
        status: "ready",
        questions: state.questions,
        highScore: state.highScore,
      };
    default:
      throw new Error("Unrecognized Game type");
  }
};

const SECS_PER_QUESTION = 30;

function GameProvider({ children }) {
  const [game, disGame] = useReducer(redGame, initialGameState);
  const { status, questions, index, curPoints, answerI, highScore } = game;
  const numQuestions = questions.length;
  const maxPoints = questions.reduce((acc, el) => acc + el.points, 0);
  const curQuestion = questions[index];
  const maxTime = numQuestions * SECS_PER_QUESTION;
  const curValue = answerI === null ? index : index + 1;
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:8000/questions");
        const data = await res.json();
        disGame({ type: "dataReceived", payload: data });
      } catch (err) {
        disGame({ type: "dataFailed" });
      }
    })();
  }, []);
  return (
    <GameContext.Provider
      value={{
        game,
        disGame,
        status,
        questions,
        index,
        curPoints,
        answerI,
        highScore,
        numQuestions,
        maxPoints,
        curQuestion,
        maxTime,
        curValue,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export { useGame, GameProvider };
