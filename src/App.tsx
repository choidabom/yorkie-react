import { useEffect, useState } from 'react';
import yorkie, { Document } from "yorkie-js-sdk";
import './App.css';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

const API_ADDR = import.meta.env.VITE_YORKIE_API_ADDR;
const API_KEY = import.meta.env.VITE_YORKIE_API_KEY;

const App = (): JSX.Element => {
  const [count, setCount] = useState(0);
  const [doc, setDoc] = useState<Document<{ count: number } | null>>();

  useEffect(() => {
    const initializeYorkie = async () => {
      const newClient = new yorkie.Client(API_ADDR, { apiKey: API_KEY });
      await newClient.activate();

      const doc = new yorkie.Document<{ count: number }>('counter', { enableDevtools: true });
      await newClient.attach(doc);

      doc.update((root) => {
        if (!root.count) {
          root.count = 0;
        } else {
          setCount(doc.getRoot().count)
        }
      }, 'create default count if not exists');

      setDoc(doc)
      doc.subscribe(() => {
        setCount(doc.getRoot().count)
      });
    }
    initializeYorkie();
  }, []);

  const handleIncrementCount = () => {
    if (doc) {
      doc.update((root) => {
        root.count += 1;
      });
    }
  };

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={handleIncrementCount}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App;
