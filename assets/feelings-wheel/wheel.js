/**
 * Rotation + color toggle adapted from https://feelingswheel.com/ (script.js).
 * Uses local asset paths and a LoneStar-specific localStorage key.
 */
const GRAPHIC_NEW = './feelings-wheel-new-2.webp';
const GRAPHIC_ORIGINAL = './feelings-wheel.jpg';
const STORAGE_KEY = 'lonestar-support-feelings-wheel-src';

function normalizeStored(url) {
  if (!url || typeof url !== 'string') return null;
  if (url === GRAPHIC_NEW || url.endsWith('feelings-wheel-new-2.webp')) return GRAPHIC_NEW;
  if (url === GRAPHIC_ORIGINAL || url.endsWith('feelings-wheel.jpg')) return GRAPHIC_ORIGINAL;
  return null;
}

var graphicToShow;
var toggleButton = document.querySelector('input[name=toggleSwitch]');
var img = document.querySelector('#wheelGraphic');
var storedInput = normalizeStored(localStorage.getItem(STORAGE_KEY));

toggleButton.addEventListener('change', function () {
  if (this.checked) {
    graphicToShow = GRAPHIC_NEW;
  } else {
    graphicToShow = GRAPHIC_ORIGINAL;
  }

  setGraphic();
  saveToLocal();
});

if (storedInput) {
  graphicToShow = storedInput;
  img.src = storedInput;

  if (storedInput === GRAPHIC_NEW) {
    toggleButton.checked = true;
  } else {
    toggleButton.checked = false;
  }
} else {
  graphicToShow = GRAPHIC_NEW;
  localStorage.setItem(STORAGE_KEY, graphicToShow);
  toggleButton.checked = true;
}

const saveToLocal = () => {
  localStorage.setItem(STORAGE_KEY, graphicToShow);
};

const setGraphic = () => {
  img.src = graphicToShow;
};

// --- Gesture state ---
let isPointerDown = false;
let startAngle = 0;
let currentDegree = 0;
let currentScale = 1;
const MIN_SCALE = 1;
const MAX_SCALE = 4;
const activePointers = new Map();
let pinchStartDistance = 0;
let pinchStartScale = 1;

img.ondragstart = function () {
  return false;
};

const getAngleFromEvent = (clientX, clientY, element) => {
  const rect = element.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = clientX - cx;
  const dy = clientY - cy;
  return Math.atan2(dy, dx);
};

const distanceBetween = (p1, p2) => Math.hypot(p2.x - p1.x, p2.y - p1.y);

const applyTransform = () => {
  img.style.transform = `rotateZ(${currentDegree}deg) scale(${currentScale})`;
};

const onPointerDown = (e) => {
  img.setPointerCapture?.(e.pointerId);
  activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

  if (activePointers.size === 1) {
    isPointerDown = true;
    startAngle = getAngleFromEvent(e.clientX, e.clientY, img);
  } else if (activePointers.size === 2) {
    isPointerDown = false;
    const [p1, p2] = Array.from(activePointers.values());
    pinchStartDistance = distanceBetween(p1, p2);
    pinchStartScale = currentScale;
  }
  e.preventDefault();
};

const onPointerMove = (e) => {
  if (!activePointers.has(e.pointerId)) return;
  activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

  if (activePointers.size === 1 && isPointerDown) {
    const { x, y } = activePointers.values().next().value;
    const now = getAngleFromEvent(x, y, img);
    const delta = now - startAngle;
    currentDegree += (delta * 180) / Math.PI;
    startAngle = now;
    applyTransform();
  } else if (activePointers.size === 2) {
    const [p1, p2] = Array.from(activePointers.values());
    const dist = distanceBetween(p1, p2);
    if (pinchStartDistance > 0) {
      let nextScale = pinchStartScale * (dist / pinchStartDistance);
      currentScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, nextScale));
      applyTransform();
    }
  }
  e.preventDefault();
};

const onPointerUpOrCancel = (e) => {
  activePointers.delete(e.pointerId);

  if (activePointers.size === 0) {
    isPointerDown = false;
  } else if (activePointers.size === 1) {
    const { x, y } = activePointers.values().next().value;
    startAngle = getAngleFromEvent(x, y, img);
    isPointerDown = true;
  }
};

img.addEventListener('pointerdown', onPointerDown, { passive: false });
img.addEventListener('pointermove', onPointerMove, { passive: false });
img.addEventListener('pointerup', onPointerUpOrCancel);
img.addEventListener('pointercancel', onPointerUpOrCancel);

img.addEventListener(
  'wheel',
  (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    currentScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, currentScale + delta));
    applyTransform();
  },
  { passive: false },
);
