import React, { useState } from "react";

function App() {
  const [description, setDescription] = useState("");
  const [prompts, setPrompts] = useState([]);
  const [images, setImages] = useState(null);
  const [submitMessage, showSubmitMessage] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [userInput, setUserInput] = useState("");
  const linkUrlPrompt =
    process.env.NODE_ENV === "Production"
      ? "generate-prompts"
      : "http://localhost:3003/generate-prompts";

  const linkUrlImage =
    process.env.NODE_ENV === "Production"
      ? "images"
      : "http://localhost:3003/images";
  const handleInputChange = (event) => {
    setDescription(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    setUserInput(description);
    setDescription("");

    try {
      const response = await fetch(linkUrlPrompt, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: description }),
      });
      const data = await response.json();
      setPrompts(data.responses);
      showSubmitMessage(true);
      setSelectedPrompt("");
      setImages(null);
    } catch (error) {
      console.error(error);
    }
  };

  const getImages = async (prompt) => {
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          message1: prompt,
        }),
        headers: {
          "Content-type": "application/json",
        },
      };
      const response = await fetch(linkUrlImage, options);
      const data = await response.json();
      console.log(data);
      setImages(data);
      setSelectedPrompt(prompt);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="app">
      <section className="search-section">
        <p>Give your description here</p>
        <form onSubmit={handleFormSubmit}>
          <div className="input-container">
            <input
              value={description}
              onChange={handleInputChange}
              placeholder="ex: A cat sitting on a car in rain"
            />
            <button type="submit">Generate</button>
          </div>
        </form>
      </section>

      {images && (
        <section className="image-section">
          {images?.map((image, _index) => (
            <img key={_index} src={image.url} alt="Generated" />
          ))}
        </section>
      )}

      {userInput && <h3>{userInput}</h3>}

      {submitMessage && (
        <section>
          <p className="select-message">
            Select a suitable prompt to generate an image
          </p>
        </section>
      )}

      <section className="prompt-section">
        <ul>
          {prompts?.map((prompt, index) => (
            <button
              className={selectedPrompt === prompts[index] ? "highlighted" : ""}
              onClick={() => getImages(prompt)}
            >
              <li key={index}>{prompt}</li>
            </button>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;
