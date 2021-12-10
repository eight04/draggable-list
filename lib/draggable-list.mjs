/* eslint-env browser */
export function applyDragMove(list, rects, startIndex, oldY, overIndex, newY) {
  if (newY > oldY) {
    for (let i = overIndex; i < list.length; i++) {
      if (rects[i].top > newY) {
        break;
      }
      if (i < startIndex && rects[i].bottom < newY && list[i].classList.contains('draggable-list-transformed')) {
        list[i].classList.remove('draggable-list-transformed');
        list[i].style = '';
      } else if (i > startIndex && rects[i].top < newY && !list[i].classList.contains('draggable-list-transformed')) {
        list[i].classList.add('draggable-list-transformed');
        list[i].style.transform = `translateY(${rects[startIndex].top - rects[startIndex + 1].top}px)`;
      }
      overIndex = i;
    }
  } else {
    for (let i = overIndex; i >= 0; i--) {
      if (rects[i].bottom < newY) break;
      if (i > startIndex && rects[i].top > newY && list[i].classList.contains('draggable-list-transformed')) {
        list[i].classList.remove('draggable-list-transformed');
        list[i].style = '';
      } else if (i < startIndex && rects[i].bottom > newY && !list[i].classList.contains('draggable-list-transformed')) {
        list[i].classList.add('draggable-list-transformed');
        list[i].style.transform = `translateY(${rects[startIndex].bottom - rects[startIndex - 1].bottom}px)`;
      }
      overIndex = i;
    }
  }
  return overIndex;
}

export function DraggableList(el) {
  for (const c of el.children) {
    c.draggable = true;
  }
  new MutationObserver(records => {
    for (const r of records) {
      for (const n of r.addedNodes) {
        n.draggable = true;
      }
    }
  }).observe(el, {childList: true});
  let startPos = null;
  let startIndex = 0;
  let preIndex = 0;
  let dragOverPos = null;
  let dragTarget = null;
  let dropped = false;
  let rects = [];
  let transDownStyle;
  let transUpStyle;
  const indexMap = new Map;

  el.addEventListener('dragstart', e => {
    if (e.target.parentNode !== el) return;
    dragTarget = e.target;
    dropped = false;
    dragOverPos = startPos = {
      x: e.pageX,
      y: e.pageY
    };
    indexMap.clear();
    [...el.children].map((el, i) => {
      indexMap.set(el, i);
    });
    rects = [...el.children].map(e => e.getBoundingClientRect());
    transUpStyle = `translateY(${rects[startIndex].top - rects[startIndex + 1]?.top}px)`;
    transDownStyle = `translateY(${rects[startIndex].bottom - rects[startIndex - 1]?.bottom}px)`;
    preIndex = startIndex = indexMap.get(e.target);
    dragTarget.classList.add('draggable-list-target');
    el.classList.add('draggable-list-dragging');
    dispatch(e, 'd:dragstart');
  });

  el.addEventListener('dragenter', e => {
    if (!dragTarget) return;
    if (e.target.parentNode !== el) return;
    const index = indexMap.get(e.target);
    if (index === preIndex && index !== startIndex) {
      transform(!el.children[index].classList.contains('draggable-list-transformed'), index, index, index > startIndex ? transUpStyle : transDownStyle);
    } else if (index > startIndex) {
      if (preIndex < index) {
        transform(false, preIndex, startIndex - 1);
        transform(true, Math.max(startIndex + 1, preIndex + 1), index, transUpStyle);
      } else {
        transform(false, index + 1, preIndex);
      }
    } else {
      if (preIndex < index) {
        transform(false, preIndex, index - 1);
      } else {
        transform(true, index, Math.min(startIndex - 1, preIndex - 1), transDownStyle);
        transform(false, startIndex + 1, preIndex);
      }
    }
    preIndex = index;
    e.preventDefault();
    dispatch(e, 'd:dragmove');
  });

  el.addEventListener('dragover', e => {
    if (!dragTarget) return;
    e.preventDefault();
    const newPos = {
      x: e.pageX,
      y: e.pageY
    };
    dragOverPos = newPos;
    dispatch(e, 'd:dragmove');
  });

  document.addEventListener('dragend', e => {
    if (!dragTarget) return;
    for (const c of el.children) {
      c.classList.remove('draggable-list-transformed');
      c.style = '';
    }
    dragTarget.classList.remove('draggable-list-target');
    el.classList.remove('draggable-list-dragging');
    dispatch(e, 'd:dragend', {
      originalIndex: startIndex,
      spliceIndex: preIndex,
      insertBefore: preIndex < startIndex ? el.children[preIndex] : el.children[preIndex + 1],
      dropped
    });
    dragTarget = null;
  });

  el.addEventListener('drop', e => {
    if (dragTarget) {
      dropped = true;
      e.preventDefault();
    }
  });

  function transform(state, p, q, style) {
    for (let i = p; i <= q; i++) {
      if (state && !el.children[i].classList.contains('draggable-list-transformed')) {
        el.children[i].classList.add('draggable-list-transformed');
        el.children[i].style.transform = style;
      } else if (!state && el.children[i].classList.contains('draggable-list-transformed')) {
        el.children[i].classList.remove('draggable-list-transformed');
        el.children[i].style = '';
      }
    }
  }

  function dispatch(e, name, props) {
    const detail = {
      origin: e,
      startPos,
      currentPos: dragOverPos,
      dragTarget,
    };
    if (props) {
      Object.assign(detail, props);
    }
    el.dispatchEvent(new CustomEvent( name, {detail}));
  }
}

