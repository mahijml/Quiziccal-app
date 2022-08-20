
import './App.css';
import { useState } from 'react';
import EntryPage from './Components/EntryPage';
import QuizPage from './Components/QuizPage';

function App() {
  const [start, setStart] = useState(false);
   const startHandling = () =>{
    setStart(true);
   }
  return (
    <div className="App">
      {!start ? 
      <EntryPage startHandling={startHandling}/> 
      : <QuizPage />}
    </div>
  );
}

export default App;
