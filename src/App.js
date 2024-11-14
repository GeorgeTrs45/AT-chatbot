import React from "react";
import Chat from "./chat";
import "./App.css";

function App() {
  const botName = "AT CHATBOT (v1)";
  return (
    <div className="App">
      <header className="App-header">
        <img src="/logo.svg" className="App-logo" alt="logo" />
        <h1 className="App-title">{botName}</h1>
      </header>
      <Chat />
    </div>
  );
}

export default App;
