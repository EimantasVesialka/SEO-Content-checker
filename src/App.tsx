import React, { useState } from "react";
import "./App.css";
import Sidebar from "./Sidebar";
import Textarea from "./Textarea";

const App: React.FC = () => {
  const [value, setValue] = useState("");

  return (
    <div className="App">
      <h1>SEO Content Analysis</h1>
      <div className="App-content">
        <Textarea value={value} setValue={setValue} />
        <Sidebar textAreaValue={value} />
      </div>
    </div>
  );
};

export default App;
