import "./ai.css";
import { useState } from "react";

function Ai() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  async function generateAnswer() {
    setAnswer("Loading ...");

    try {
      const requestData = {
        contents: [
          {
            parts: [
              {
                text: `Question: ${question}`,
              },
            ],
          },
        ],
      };

      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyDplmHAXBzIp6txPJAybdUUrPOQ-iLioFs",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAnswer(data.candidates[0].content.parts[0].text);
    } catch (error) {
      console.error("Error generating answer:", error);
      setAnswer("An error occurred. Please try again.");
    }
  }

  return (
    <div className="container">
      <h1 className="app-title">Farm Connect AI</h1>

      <div className="textarea-container">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          cols={30}
          rows={10}
          placeholder="Ask about crops, market prices, or farming tips..."
          className="question-input"
        ></textarea>
      </div>

      <div className="button-container">
        <button className="generate-button" onClick={generateAnswer}>
          {answer === "Loading ..." ? (
            <div className="loader"></div>
          ) : (
            "Generate Answer"
          )}
        </button>
      </div>

      {answer && <pre className="answer-box">{answer}</pre>}

      <div className="example-questions">
        <h2>Example Questions:</h2>
        <ul>
          <li>What are the best crops to plant in Nashik during monsoon?</li>
          <li>How much do tomatoes cost in the local market?</li>
          <li>What are the latest farming techniques for organic farming?</li>
          <li>What fertilizers are suitable for my soil type?</li>
          <li>How can I increase the yield of my crops?</li>
        </ul>
      </div>
    </div>
  );
}

export default Ai;
