import { useReducer } from "react";
function counter(state, action) {
  if (action.type === "inc") return state + action.payload;
  if (action.type === "dec") return state - action.payload;
  if (action.type === "set") return action.payload;
}
function steper(state, action) {
  if (action.type === "set") return action.payload;
}
function DateCounter() {
  const [count, cCount] = useReducer(counter, 0);
  const [step, cStep] = useReducer(steper, 1);

  // This mutates the date object.
  const date = new Date("june 21 2027");
  date.setDate(date.getDate() + count);

  const dec = function () {
    cCount({ type: "dec", payload: step });
  };

  const inc = function () {
    cCount({ type: "inc", payload: step });
  };

  const defineCount = function (e) {
    cCount({ type: "set", payload: Number(e.target.value) });
  };

  const defineStep = function (e) {
    cStep({ type: "set", payload: Number(e.target.value) });
  };

  const reset = function () {
    cCount({ type: "set", payload: 0 });
    cStep({ type: "set", payload: 1 });
  };

  return (
    <div className="counter">
      <div>
        <input
          type="range"
          min="0"
          max="10"
          value={step}
          onChange={defineStep}
        />
        <span>{step}</span>
      </div>

      <div>
        <button onClick={dec}>-</button>
        <input value={count} onChange={defineCount} />
        <button onClick={inc}>+</button>
      </div>

      <p>{date.toDateString()}</p>

      <div>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
export default DateCounter;
