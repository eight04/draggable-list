var DraggableList = (function () {
  'use strict';

  /* eslint-env browser */
  function applyDragMove(list, rects, startIndex, oldY, overIndex, newY) {
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
          list[i].style.transform = "translateY(".concat(rects[startIndex].top - rects[startIndex + 1].top, "px)");
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
          list[i].style.transform = "translateY(".concat(rects[startIndex].bottom - rects[startIndex - 1].bottom, "px)");
        }

        overIndex = i;
      }
    }

    return overIndex;
  }
  function DraggableList(el, scrollingContainer) {
    for (const c of el.children) {
      c.draggable = true;
    }

    new MutationObserver(records => {
      for (const r of records) {
        for (const n of r.addedNodes) {
          n.draggable = true;
        }
      }
    }).observe(el, {
      childList: true
    });
    let startPos = null;
    let startIndex = 0;
    let dragOverIndex = 0;
    let dragOverPos = null;
    let rects = [];
    let dragTarget = null;
    let dropped = false;
    el.addEventListener('dragstart', e => {
      if (e.target.parentNode !== el) return;
      dragTarget = e.target;
      dropped = false;
      const scrollLeft = scrollingContainer ? scrollingContainer.scrollLeft : 0;
      const scrollTop = scrollingContainer ? scrollingContainer.scrollTop : 0;
      startPos = {
        x: e.pageX + scrollLeft,
        y: e.pageY + scrollTop
      };
      startIndex = [...el.children].indexOf(e.target);
      dragOverIndex = startIndex;
      dragOverPos = startPos;
      rects = [...el.children].map(el => {
        const r = el.getBoundingClientRect();
        return {
          top: r.top + window.scrollY + scrollTop,
          bottom: r.bottom + window.scrollY + scrollTop
        };
      });
      dragTarget.classList.add('draggable-list-target');
      el.classList.add('draggable-list-dragging');
      dispatch(e, 'd:dragstart');
    });
    el.addEventListener('dragenter', e => {
      if (dragTarget) {
        e.preventDefault();
        dispatch(e, 'd:dragmove');
      }
    });
    el.addEventListener('dragover', e => {
      if (!dragTarget) return;
      e.preventDefault();
      const scrollLeft = scrollingContainer ? scrollingContainer.scrollLeft : 0;
      const scrollTop = scrollingContainer ? scrollingContainer.scrollTop : 0;
      const newPos = {
        x: e.pageX + scrollLeft,
        y: e.pageY + scrollTop
      };
      dragOverIndex = applyDragMove(el.children, rects, startIndex, dragOverPos.y, dragOverIndex, newPos.y);
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
        spliceIndex: dragOverIndex,
        insertBefore: dragOverIndex < startIndex ? el.children[dragOverIndex] : el.children[dragOverIndex + 1],
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

    function dispatch(e, name, props) {
      const detail = {
        origin: e,
        startPos,
        currentPos: dragOverPos,
        dragTarget
      };

      if (props) {
        Object.assign(detail, props);
      }

      el.dispatchEvent(new CustomEvent(name, {
        detail
      }));
    }
  }

  return DraggableList;

})();
