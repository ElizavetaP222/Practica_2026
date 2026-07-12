import React, { useState } from 'react';
import { MainMenu } from './components/MainMenu';
import { SimulationView } from './components/SimulationView';

function App() {
  // состояние для отслеживания, запущена ли игра
  const [gameStarted, setGameStarted] = useState(false);
  // состояние для хранения настроек игры
  const [config, setConfig] = useState(null);

  // обрабатывает запуск игры с переданными настройками
  const handleStartGame = (configData) => {
    setConfig(configData);      // сохраняем настройки
    setGameStarted(true);       // переключаем на экран симуляции
  };

  // возвращает в главное меню, сбрасывая игру
  const handleNewGame = () => {
    setGameStarted(false);      // возвращаемся в меню
    setConfig(null);            // очищаем настройки
  };

  return (
    <div>
      {/* если игра не запущена, показываем главное меню */}
      {!gameStarted && <MainMenu onStartGame={handleStartGame} />}
      {/* если игра запущена, показываем экран симуляции с настройками */}
      {gameStarted && <SimulationView config={config} onNewGame={handleNewGame} />}
    </div>
  );
}

export default App;