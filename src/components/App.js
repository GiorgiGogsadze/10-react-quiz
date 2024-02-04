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
import { useGame } from "../contexts/GameContext";

export default function App() {
  const { status, index, numQuestions, curPoints, maxPoints } = useGame();

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <UIError />}
        {status === "ready" && <Welcome />}
        {status === "active" && (
          <>
            <Progressbar>
              <p>
                Question <strong>{index + 1}</strong>/{numQuestions}
              </p>
              <p>
                <strong>{curPoints}</strong>/{maxPoints} points
              </p>
            </Progressbar>
            <Question />
            <footer>
              <Timer />
              <NextButton />
            </footer>
          </>
        )}
        {status === "finished" && <FinishedScreen />}
      </Main>
    </div>
  );
}
