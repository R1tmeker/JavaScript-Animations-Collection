import { setupCanvases } from './utils/canvasUtils.js';
import TabManager from './utils/tabManager.js';
import CircleAnimation from './animations/circleAnimation.js';
import TrajectoryAnimation from './animations/trajectoryAnimation.js';
import PhysicsAnimation from './animations/physicsAnimation.js';
import PythagoreanAnimation from './animations/pythagoreanAnimation.js';
import TransformAnimation from './animations/transformAnimation.js';

const animations = {
  circle: new CircleAnimation('circleCanvas'),
  trajectory: new TrajectoryAnimation('trajectoryCanvas'),
  physics: new PhysicsAnimation('physicsCanvas'),
  theorem: new PythagoreanAnimation('theoremCanvas'),
  transform: new TransformAnimation('transformCanvas')
};

function setupAnimation(id) {
  setupCanvases();
  Object.values(animations).forEach(anim => anim.stop());
  animations[id].resize();
  animations[id].start();
}

document.getElementById('circleSpeed').addEventListener('input', (e) => {
  animations.circle.setSpeed(Number(e.target.value));
});

document.getElementById('trajectoryComplexity').addEventListener('input', (e) => {
  animations.trajectory.setComplexity(Number(e.target.value));
});

document.getElementById('gravity').addEventListener('input', (e) => {
  animations.physics.setGravity(Number(e.target.value));
});

document.getElementById('bounce').addEventListener('input', (e) => {
  animations.physics.setBounce(Number(e.target.value));
});

document.getElementById('theoremAngle').addEventListener('input', (e) => {
  animations.theorem.setAngle(Number(e.target.value));
});

document.getElementById('transformSpeed').addEventListener('input', (e) => {
  animations.transform.setSpeed(Number(e.target.value));
});

const resetButtons = {
  circle: { value: 5, control: 'circleSpeed' },
  trajectory: { value: 5, control: 'trajectoryComplexity' },
  physics: { value: { gravity: 9.8, bounce: 0.8 }, control: ['gravity', 'bounce'] },
  theorem: { value: 45, control: 'theoremAngle' },
  transform: { value: 5, control: 'transformSpeed' }
};

Object.entries(resetButtons).forEach(([id, config]) => {
  document.getElementById(`reset${id.charAt(0).toUpperCase() + id.slice(1)}`).addEventListener('click', () => {
    if (Array.isArray(config.control)) {
      config.control.forEach((ctrl, i) => {
        document.getElementById(ctrl).value = Object.values(config.value)[i];
      });
    } else {
      document.getElementById(config.control).value = config.value;
    }
    animations[id].reset();
  });
});

window.addEventListener('resize', () => {
  const activeId = document.querySelector('.tab-btn.active').dataset.tab;
  setupAnimation(activeId);
});

const tabManager = new TabManager();
tabManager.onTabChange(setupAnimation);

setupAnimation(document.querySelector('.tab-btn.active').dataset.tab);