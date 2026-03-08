import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// 1. Change BrowserRouter to HashRouter
import { HashRouter } from 'react-router-dom' 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. Wrap the App in HashRouter */}
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)