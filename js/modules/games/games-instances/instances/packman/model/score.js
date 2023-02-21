import { Utils } from "../../../services/common.js";

export const scoreMethods = {
  loadBestScore,
  saveScore,
  checkNewHighScore
}

const STORAGE_KEY = 'Pacman_best_score';



async function loadBestScore() {
  return await Utils.loadFromStorage(STORAGE_KEY);
}

async function saveScore(score) {
  Utils.storeToStorage(STORAGE_KEY, score);
  return Promise.resolve();
}

async function checkNewHighScore(score) {
  var prevBest = await this.loadBestScore();
  if (!prevBest) return true;
  return (score > prevBest.score);
}