import { useRef, type PointerEvent, type RefObject } from 'react';

const SHEET_QUERY = '(max-width: 39.99rem)';
const DISMISS_DISTANCE = 110;
const DISMISS_VELOCITY = 0.55;
const SETTLE_TRANSITION = 'translate 360ms cubic-bezier(0.32, 0.72, 0, 1)';
const RUBBER_BAND = 0.2;

interface DragState {
  startY: number;
  pressY: number;
  lastY: number;
  lastTime: number;
  velocity: number;
  offset: number;
}

function moveSheet(element: HTMLElement | null, offset: number, settle: boolean) {
  if (!element) return;
  element.style.transition = settle ? SETTLE_TRANSITION : 'none';
  element.style.translate = offset === 0 ? '' : `0 ${offset}px`;
}

function pickUpSheet(element: HTMLElement) {
  const animations = element.getAnimations();
  if (animations.length === 0) return 0;
  const movingTop = element.getBoundingClientRect().top;
  animations.forEach((animation) => animation.cancel());
  element.style.transition = 'none';
  element.style.translate = '';
  return movingTop - element.getBoundingClientRect().top;
}

function canStartDrag(event: PointerEvent<HTMLElement>) {
  if (event.button !== 0 || event.currentTarget.dataset.state !== 'open') return false;
  if (!window.matchMedia(SHEET_QUERY).matches) return false;
  const target = event.target as HTMLElement;
  return target.closest('[data-sheet-handle]') !== null && target.closest('button, a, input, textarea, select') === null;
}

export function useSheetDrag(sheetRef: RefObject<HTMLElement | null>, onDismiss: () => void) {
  const drag = useRef<DragState | null>(null);

  const endDrag = (time: number) => {
    const state = drag.current;
    if (!state) return;
    drag.current = null;
    const dragged = Math.abs(state.lastY - state.pressY) > 4;
    const flicked = time - state.lastTime < 100 && state.offset > 24 && state.velocity > DISMISS_VELOCITY;
    if (!dragged || (state.offset <= DISMISS_DISTANCE && !flicked)) {
      moveSheet(sheetRef.current, 0, true);
      return;
    }
    if (sheetRef.current) sheetRef.current.style.transition = '';
    onDismiss();
    requestAnimationFrame(() => {
      if (sheetRef.current?.dataset.state === 'open') moveSheet(sheetRef.current, 0, true);
    });
  };

  return {
    onPointerDown(event: PointerEvent<HTMLElement>) {
      if (!canStartDrag(event)) return;
      const element = event.currentTarget;
      const offset = pickUpSheet(element);
      if (offset !== 0) moveSheet(element, offset, false);
      element.setPointerCapture(event.pointerId);
      drag.current = {
        startY: event.clientY - (offset > 0 ? offset : offset / RUBBER_BAND),
        pressY: event.clientY,
        lastY: event.clientY,
        lastTime: event.timeStamp,
        velocity: 0,
        offset,
      };
    },
    onPointerMove(event: PointerEvent<HTMLElement>) {
      const state = drag.current;
      if (!state) return;
      const distance = event.clientY - state.startY;
      const elapsed = event.timeStamp - state.lastTime;
      if (elapsed > 0) state.velocity = state.velocity * 0.3 + ((event.clientY - state.lastY) / elapsed) * 0.7;
      state.lastY = event.clientY;
      state.lastTime = event.timeStamp;
      state.offset = distance > 0 ? distance : distance * RUBBER_BAND;
      moveSheet(sheetRef.current, state.offset, false);
    },
    onPointerUp(event: PointerEvent<HTMLElement>) {
      endDrag(event.timeStamp);
    },
    onPointerCancel(event: PointerEvent<HTMLElement>) {
      if (drag.current) drag.current.offset = 0;
      endDrag(event.timeStamp);
    },
    onLostPointerCapture(event: PointerEvent<HTMLElement>) {
      endDrag(event.timeStamp);
    },
  };
}
