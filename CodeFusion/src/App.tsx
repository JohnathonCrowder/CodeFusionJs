import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app-container">
      <header>
        <h1>Welcome to My React App</h1>
      </header>

      <main>
        <div className="card">
          <h2>Interactive Counter</h2>
          <p>Current count is: {count}</p>
          <button onClick={() => setCount(count + 1)}>Increment</button>
          <button onClick={() => setCount(count - 1)}>Decrement</button>
          <button onClick={() => setCount(0)}>Reset</button>
        </div>
      </main>

      <footer>
        <p>Created with React + Vite</p>
      </footer>
    </div>
  );
}

export default App;
