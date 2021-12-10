draggable-list
==============

A tiny vanilla draggable list built with HTML5 drag-n-drop.

Demo
====

https://eight04.github.io/draggable-list/

Installation
------------

*npm*

```
npm install draggable-list
```

*unpkg*

```html
<!-- export to global variable "DraggableList" -->
<script src="https://unpkg.com/eight04/draggable-list/dist/draggable-list.iife.js"></script>
```

```html
import DraggableList from "https://unpkg.com/eight04/draggable-list/dist/draggable-list.es.js";
const ul = document.querySelector("#demo1");
new DraggableList(ul);
```

Compatibility
-------------

Prebuilt dist is compiled with babel to support Chrome 55.

API
----

This module exports a default member.

### DraggableList

```js
new DraggableList(el: Element)
```

Convert an element to a draggable list.

Custom Events
-------------

### d:dragstart
### d:dragmove
### d:dragend

```js
e = {
  detail: {
    origin: Event,
    dragTarget: Element,

    // for d:dragmove
    startPos: {x, y},
    currentPos: {x, y},

    // for d:dragend
    originalIndex: Number,
    spliceIndex: Number,
    dropped: Boolean,
    insertBefore?: Element
  }
}
```

* `origin` - the raw `DragEvent`.
* `dragTarget` - the target that is being dragged. The parent of `dragTarget` is always the container.
* `startPos` - mouse position relative to the page when drag starts.
* `currentPos` - mouse position relative to the page when drag move.
* `originalIndex` - the index of `dragTarget`.
* `spliceIndex` - the index that can be used for splice, after removing `dragTarget` from the list.
* `insertBefore` - the element that can be used as the anchor of `Element.insertBefore`.
* `dropped` - if false then the item is dropped outside the list or is canceled via Esc.

Changelog
---------

* 0.2.0 (Dec 10, 2021)

  - Fix: catch dragenter & drop events.
  - Change: now only support Chrome 55+.

* 0.1.0 (Dec 10, 2021)

  - First release.
