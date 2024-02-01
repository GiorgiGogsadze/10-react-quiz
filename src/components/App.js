import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import FinishedScreen from "./FinishedScreen";
import Welcome from "./Welcome";
import Loader from "./Loader";
import UIError from "./Error";
import Question from "./Question";
import Progressbar from "./Progressbar";
import NextButton from "./NextButton";
import Timer from "./Timer";

const SECS_PER_QUESTION = 30;

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

export default function App() {
  const [game, disGame] = useReducer(redGame, initialGameState);
  const { status, questions, index, curPoints, answerI, highScore } = game;
  const numQuestions = questions.length;
  const maxPoints = questions.reduce((acc, el) => acc + el.points, 0);
  const curQuestion = questions[index];
  const maxTime = numQuestions * SECS_PER_QUESTION;

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
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <UIError />}
        {status === "ready" && (
          <Welcome numQuestions={numQuestions} disGame={disGame} />
        )}
        {status === "active" && (
          <>
            <Progressbar
              curValue={answerI === null ? index : index + 1}
              maxValue={numQuestions}
            >
              <p>
                Question <strong>{index + 1}</strong>/{numQuestions}
              </p>
              <p>
                <strong>{curPoints}</strong>/{maxPoints} points
              </p>
            </Progressbar>
            <Question
              curQuestion={curQuestion}
              disGame={disGame}
              answerI={answerI}
            />
            <footer>
              <Timer maxTime={maxTime} disGame={disGame} />
              <NextButton
                answerI={answerI}
                index={index}
                numQuestions={numQuestions}
                disGame={disGame}
              />
            </footer>
          </>
        )}
        {status === "finished" && (
          <FinishedScreen
            curPoints={curPoints}
            maxPoints={maxPoints}
            highScore={highScore}
            disGame={disGame}
          />
        )}
      </Main>
    </div>
  );
}
