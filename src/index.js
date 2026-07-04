import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

console.log('1. index.js загружен');
console.log('2. Ищем root...');
const rootElement = document.getElementById('root');
console.log('3. rootElement:', rootElement);

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  console.log('4. root создан');
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('5. App отрендерен');
} else {
  console.error('6. Нет элемента с id="root"!');
}