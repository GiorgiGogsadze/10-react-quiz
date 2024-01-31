function Progressbar({ curValue, maxValue, children }) {
  return (
    <header className="progress">
      <progress value={curValue} max={maxValue} />
      {children}
    </header>
  );
}

export default Progressbar;
