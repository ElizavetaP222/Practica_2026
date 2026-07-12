import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Отладочные сообщения для проверки загрузки
console.log('1. index.js загружен');
console.log('2. Ищем root...');

// Находим элемент с id="root" в HTML
const rootElement = document.getElementById('root');
console.log('3. rootElement:', rootElement);

if (rootElement) {
  // Создаём корневой элемент React для рендеринга
  const root = ReactDOM.createRoot(rootElement);
  console.log('4. root создан');
  
  // Рендерим приложение в корневой элемент
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('5. App отрендерен');
} else {
  // Если элемент #root не найден — выводим ошибку
  console.error('6. Нет элемента с id="root"!');
}