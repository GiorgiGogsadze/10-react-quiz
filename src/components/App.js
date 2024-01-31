import { useEffect, useReducer, useState } from "react";
import Header from "./Header";
import Main from "./Main";
import FinishedScreen from "./FinishedScreen";
import Welcome from "./Welcome";
import Loader from "./Loader";
import UIError from "./Error";
import Question from "./Question";
import Progressbar from "./Progressbar";

const initialGameState = {
  questions: [],
  status: "loading", //loading, error, ready, active, finished
  index: 0,
  curPoints: 0,
  answerI: null,
  time: 600,
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
      if (state.index === state.questions.length - 1) {
        return {
          ...state,
          status: "finished",
          highScore:
            state.highScore <= state.curPoints
              ? state.curPoints
              : state.highScore,
        };
      }
      return {
        ...state,
        index: state.index + 1,
        answerI: null,
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
  const { status, questions, index, curPoints, time, answerI, highScore } =
    game;
  const numQuestions = questions.length;
  const maxPoints = questions.reduce((acc, el) => acc + el.points, 0);
  const curQuestion = questions[index];

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
            <div className="timer">
              {new Date(time * 1000).toISOString().slice(14, 19)}
            </div>
            {answerI !== null && (
              <button
                className="btn btn-ui"
                onClick={() => disGame({ type: "nextQuestion" })}
              >
                {index === numQuestions - 1 ? "Finish" : "Next"}
              </button>
            )}
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
