"use strict";
const squares = Array.from(document.querySelectorAll(".square"));

// Critérios de Resultados
const draw = 0;
const p1Victory = 1;
const p2Victory = 2;

// Contador de cliques
let qtClicks = 0;

// Contador de scores
let p1Score = 0;
let p2Score = 0;

/** TURNOS DO JOGO
 * 1 - Rodada do jogador 1
 * 2 - Rodada do jogador 2
 */

let playerTurn = 1;

/**
 * Função que verifica se um elemento está disponível para ser selecionado.
 * 0 -> Disponível;
 * 1 -> Marcado pelo Player 1;
 * 2 -> Marcado pelo Player 2;
 */
const isDisponible = (element) => element.dataset.use === "0";

// Função que bloqueia um elemento caso não esteja disponível
const blockElement = (element) => {
  if (!isDisponible(element)) {
    element.disable = true;
    element.style.cursor = "default";
  }
};

// Função que marca uma resposta do jogador
const playerAnswer = (element) => {
  const p1Answer = element.children[0];
  const p2Answer = element.children[1];

  if (playerTurn === 1) {
    if (isDisponible(element)) {
      p1Answer.style.display = "block";
      element.dataset.use = "1";
      blockElement(element);
      playerTurn = 2;
    }
  } else if (playerTurn === 2) {
    if (isDisponible(element)) {
      p2Answer.style.display = "block";
      element.dataset.use = "2";
      blockElement(element);
      playerTurn = 1;
    }
  }
};

const checkVictory = () => {
  const answers = getAnswers();

  const line = getWinner(checkLines(answers).filter(getResult));
  const column = getWinner(checkColumns(answers).filter(getResult));
  const diagonal = getWinner(checkDiagonals(answers).filter(getResult));

  if (line !== draw) {
    return line;
  }
  if (column !== draw) {
    return column;
  }
  if (diagonal !== draw) {
    return diagonal;
  }
};

const getWinner = (result) => {
  if (result[0] === p1Victory) {
    return p1Victory;
  } else if (result[0] === p2Victory) {
    return p2Victory;
  }
  return draw;
};

const getAnswers = () => squares.map((sqr) => Number(sqr.dataset.use));

const getResult = (n) => n === 1 || n === 2;

const checkLines = (result) => {
  const line1 = [result[0], result[1], result[2]].filter(getResult);
  const line2 = [result[3], result[4], result[5]].filter(getResult);
  const line3 = [result[6], result[7], result[8]].filter(getResult);

  return [checkResult(line1), checkResult(line2), checkResult(line3)];
};

const checkColumns = (result) => {
  const column1 = [result[0], result[3], result[6]].filter(getResult);
  const column2 = [result[1], result[4], result[7]].filter(getResult);
  const column3 = [result[2], result[5], result[8]].filter(getResult);

  return [checkResult(column1), checkResult(column2), checkResult(column3)];
};

const checkDiagonals = (result) => {
  const pDiagonal = [result[0], result[4], result[8]].filter(getResult);
  const sDiagonal = [result[2], result[4], result[6]].filter(getResult);

  return [checkResult(pDiagonal), checkResult(sDiagonal)];
};

const checkResult = (result) => {
  if (result.length !== 3) {
    return draw;
  }

  if (result.filter((number) => number === 1).length === 3) {
    return p1Victory;
  } else if (result.filter((number) => number === 2).length === 3) {
    return p2Victory;
  }
};

// Evento para cada campo do jogo
squares.forEach((sqr) => {
  sqr.addEventListener("click", () => {
    qtClicks++;
    playerAnswer(sqr);
    playAudio();
    if (qtClicks >= 5) {
      let winner = checkVictory();

      if (winner !== undefined) {
        incrementScore(winner);
        winnerPhrase(winner);
        openModal();
      }
    }
    
    if (qtClicks === 9 && checkVictory() === undefined) {
      openModal();
      drawPhrase();
    }
  });
});

const playAudio = () => {
  const audio = document.querySelector("#player-turn");
  audio.currentTime = 0;
  audio.play();
}

const incrementScore = (winner) => {
  if (winner === p1Victory) {
    p1Score++;
  } else if (winner === p2Victory) {
    p2Score++;
  }
}

const winnerPhrase = (winner) => {
  const h2 = document.querySelector(".modal-content > h2");
  h2.innerHTML = `Player ${winner} wins!`;
}

const drawPhrase = () => {
  const h2 = document.querySelector(".modal-content > h2");
  h2.innerHTML = "Draw!";
}

// Função que reseta o jogo
const resetGame = () => {
  squares.forEach((sqr) => {
    let [p1Answer, p2Answer] = sqr.children;
    
    p1Answer.style.display = "none";
    p2Answer.style.display = "none";

    sqr.dataset.use = "0";
    sqr.disable = false;
    sqr.style.cursor = "pointer";
  });

  playerTurn = 1;
  qtClicks = 0;
};

const modal = document.querySelector(".modal");

const openModal = () => {
  modal.classList.remove("hidden");
};

const closeModal = () => {
  modal.classList.add("hidden");
};

const updateScore = () => {
  const score1 = document.querySelector("#p1");
  const score2 = document.querySelector("#p2");

  score1.innerHTML = p1Score;
  score2.innerHTML = p2Score;
}

document.querySelector("#confirm").addEventListener("click", () => {
  closeModal();
  resetGame();
  updateScore();
});
