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
    setConfig(configData);
    setGameStarted(true);
  };

  // возвращает в главное меню, сбрасывая игру
  const handleNewGame = () => {
    setGameStarted(false);
    setConfig(null);
  };

  return (
    <div>
      {/* если игра не запущена, показываем главное меню */}
      {!gameStarted ? (
        <MainMenu onStartGame={handleStartGame} />
      ) : (
        // иначе показываем экран симуляции
        <SimulationView config={config} onNewGame={handleNewGame} />
      )}
    </div>
  );
}

export default App;