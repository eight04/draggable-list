/* eslint-env mocha */
import assert from "assert";
import {JSDOM} from "jsdom";
import {applyDragMove} from "../lib/draggable-list.mjs";

describe("applyDragMove", () => {

  it("drag first, first to last", () => {
    const body = new JSDOM('<div></div>'.repeat(10)).window.document.body;
    const rects = [...generateRects(10, 90, 10)];
    const index = applyDragMove(body.children, rects, 0, 50, 0, 950);
    assert.equal(index, 9);
    assert.equal(body.innerHTML, '<div></div>' +
      '<div class="draggable-list-transformed" style="transform: translateY(-100px);"></div>'.repeat(9));
  });

  it("drag first, first to middle", () => {
    const body = new JSDOM('<div></div>'.repeat(10)).window.document.body;
    const rects = [...generateRects(10, 90, 10)];
    const index = applyDragMove(body.children, rects, 0, 50, 0, 450);
    assert.equal(index, 4);
    assert.equal(body.innerHTML, '<div></div>' +
      '<div class="draggable-list-transformed" style="transform: translateY(-100px);"></div>'.repeat(4) +
      '<div></div>'.repeat(5));
  });

  it("drag first, first to middle gap", () => {
    const body = new JSDOM('<div></div>'.repeat(10)).window.document.body;
    const rects = [...generateRects(10, 90, 10)];
    const index = applyDragMove(body.children, rects, 0, 50,0, 499);
    assert.equal(index, 4);
    assert.equal(body.innerHTML, '<div></div>' +
      '<div class="draggable-list-transformed" style="transform: translateY(-100px);"></div>'.repeat(4) +
      '<div></div>'.repeat(5));
  });

  it("drag first, last to first", () => {
    const body = new JSDOM('<div></div>' + '<div class="draggable-list-transformed"></div>'.repeat(9)).window.document.body;
    const rects = [...generateRects(10, 90, 10)];
    const index = applyDragMove(body.children, rects, 0, 950, 9, 0);
    assert.equal(index, 0);
    assert.equal(
      body.innerHTML,
      '<div></div>' + 
      '<div class="" style=""></div>'.repeat(9));
  });

  it("drag middle, last to first", () => {
    const body = new JSDOM('<div></div>'.repeat(10)).window.document.body;
    const rects = [...generateRects(10, 90, 10)];
    const index = applyDragMove(body.children, rects, 4, 950, 9, 50);
    assert.equal(index, 0);
    assert.equal(body.innerHTML, 
      '<div class="draggable-list-transformed" style="transform: translateY(100px);"></div>'.repeat(4) +
      '<div></div>'.repeat(6));
  });
  
  it("drag middle, first to last", () => {
    const body = new JSDOM('<div class="draggable-list-transformed"></div>'.repeat(4) + '<div></div>'.repeat(6)).window.document.body;
    const rects = [...generateRects(10, 90, 10)];
    const index = applyDragMove(body.children, rects, 4, 50, 0, 950);
    assert.equal(index, 9);
    assert.equal(
      body.innerHTML, 
      '<div class="" style=""></div>'.repeat(4) +
      '<div></div>' +
      '<div class="draggable-list-transformed" style="transform: translateY(-100px);"></div>'.repeat(5)
    );
  });
});

function *generateRects(n, size, gap) {
  for (let i = 0; i < n; i++) {
    yield {
      top: i * (size + gap),
      bottom: i * (size + gap) + size
    };
  }
}
