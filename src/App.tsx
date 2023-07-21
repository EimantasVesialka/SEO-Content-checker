import React from 'react';
import './App.css';
import Sidebar from './Sidebar';
import Textarea from './Textarea';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>SEO Content Analysis</h1>
      <div className="App-content">
        <Textarea />
        <Sidebar />
      </div>
    </div>
  );
}

export default App;
