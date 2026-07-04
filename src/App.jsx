import React from 'react';
import { City } from './models/City';

function App() {
  try {
    const city = City.getInstance();
    console.log('Город создан:', city);
  } catch (error) {
    console.error('Ошибка при создании города:', error);
    return <h1>Ошибка: {error.message}</h1>;
  }

  return <h1>Симуляция работает!</h1>;
}

export default App;