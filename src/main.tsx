import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// Import i18n configuration
import './lib/i18n';

createRoot(document.getElementById("root")!).render(<App />);
