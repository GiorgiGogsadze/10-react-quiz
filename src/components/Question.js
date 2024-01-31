function Question({ curQuestion, disGame, answerI }) {
  return (
    <>
      <h4>{curQuestion.question}</h4>
      <div className="options">
        {curQuestion.options.map((el, i) => (
          <button
            className={`btn btn-option ${answerI === i ? "answer" : ""} ${
              answerI === null
                ? ""
                : i === curQuestion.correctOption
                ? "correct"
                : "wrong"
            }`}
            key={el}
            onClick={() => disGame({ type: "newAnswer", payload: i })}
            disabled={answerI !== null}
          >
            {el}
          </button>
        ))}
      </div>
    </>
  );
}

export default Question;
