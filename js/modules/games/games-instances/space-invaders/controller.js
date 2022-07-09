export class SpaceInvadersController {
  constructor(Emitter, popupInstance, containerSelector) {
    document.querySelector(containerSelector).innerHTML = 'Space-invaders is COMING SOON';
  }
}