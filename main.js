import './style.css'
import { setupCanvases } from './js/utils/canvasUtils.js'
import TabManager from './js/utils/tabManager.js'
import CircleAnimation from './js/animations/circleAnimation.js'
import TrajectoryAnimation from './js/animations/trajectoryAnimation.js'
import PhysicsAnimation from './js/animations/physicsAnimation.js'
import PythagoreanAnimation from './js/animations/pythagoreanAnimation.js'
import TransformAnimation from './js/animations/transformAnimation.js'

const tabManager = new TabManager();
setupCanvases();

const circleAnimation = new CircleAnimation('circleCanvas');
const trajectoryAnimation = new TrajectoryAnimation('trajectoryCanvas');
const physicsAnimation = new PhysicsAnimation('physicsCanvas');
const pythagoreanAnimation = new PythagoreanAnimation('theoremCanvas');
const transformAnimation = new TransformAnimation('transformCanvas');

document.getElementById('circleSpeed').addEventListener('input', (e) => {
  circleAnimation.setSpeed(Number(e.target.value));
});

document.getElementById('trajectoryComplexity').addEventListener('input', (e) => {
  trajectoryAnimation.setComplexity(Number(e.target.value));
});

document.getElementById('gravity').addEventListener('input', (e) => {
  physicsAnimation.setGravity(Number(e.target.value));
});

document.getElementById('bounce').addEventListener('input', (e) => {
  physicsAnimation.setBounce(Number(e.target.value));
});

document.getElementById('theoremAngle').addEventListener('input', (e) => {
  pythagoreanAnimation.setAngle(Number(e.target.value));
});

document.getElementById('transformSpeed').addEventListener('input', (e) => {
  transformAnimation.setSpeed(Number(e.target.value));
});

document.getElementById('resetCircle').addEventListener('click', () => {
  document.getElementById('circleSpeed').value = 5;
  circleAnimation.reset();
});

document.getElementById('resetTrajectory').addEventListener('click', () => {
  document.getElementById('trajectoryComplexity').value = 5;
  trajectoryAnimation.reset();
});

document.getElementById('resetPhysics').addEventListener('click', () => {
  document.getElementById('gravity').value = 9.8;
  document.getElementById('bounce').value = 0.8;
  physicsAnimation.reset();
});

document.getElementById('resetTheorem').addEventListener('click', () => {
  document.getElementById('theoremAngle').value = 45;
  pythagoreanAnimation.reset();
});

document.getElementById('resetTransform').addEventListener('click', () => {
  document.getElementById('transformSpeed').value = 5;
  transformAnimation.reset();
});

window.addEventListener('resize', () => {
  setupCanvases();
  circleAnimation.resize();
  trajectoryAnimation.resize();
  physicsAnimation.resize();
  pythagoreanAnimation.resize();
  transformAnimation.resize();
});

tabManager.onTabChange((tabId) => {
  circleAnimation.stop();
  trajectoryAnimation.stop();
  physicsAnimation.stop();
  pythagoreanAnimation.stop();
  transformAnimation.stop();
  
  setupCanvases();
  
  switch(tabId) {
    case 'circle': 
      circleAnimation.resize();
      circleAnimation.start(); 
      break;
    case 'trajectory': 
      trajectoryAnimation.resize();
      trajectoryAnimation.start(); 
      break;
    case 'physics': 
      physicsAnimation.resize();
      physicsAnimation.start(); 
      break;
    case 'theorem': 
      pythagoreanAnimation.resize();
      pythagoreanAnimation.start(); 
      break;
    case 'transform': 
      transformAnimation.resize();
      transformAnimation.start(); 
      break;
  }
});

const activeTabId = document.querySelector('.tab-btn.active').dataset.tab;
setupCanvases();
switch(activeTabId) {
  case 'circle': 
    circleAnimation.resize();
    circleAnimation.start(); 
    break;
  case 'trajectory': 
    trajectoryAnimation.resize();
    trajectoryAnimation.start(); 
    break;
  case 'physics': 
    physicsAnimation.resize();
    physicsAnimation.start(); 
    break;
  case 'theorem': 
    pythagoreanAnimation.resize();
    pythagoreanAnimation.start(); 
    break;
  case 'transform': 
    transformAnimation.resize();
    transformAnimation.start(); 
    break;
}