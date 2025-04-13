import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { configureApiBaseUrl } from './services/api.ts';
configureApiBaseUrl('http://localhost:8080/atlas');
createRoot(document.getElementById("root")!).render(<App />);
