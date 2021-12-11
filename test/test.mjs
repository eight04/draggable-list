/* eslint-env mocha */
import assert from "assert";
import {JSDOM} from "jsdom";
import {posToIndex, applyTransform} from "../lib/draggable-list.mjs";

describe('posToIndex', () => {
  it('size 90, gap 10', () => {
    const rects = [...generateRects(10, 90, 10)];
    assert.equal(posToIndex(rects, 0, 950), 9);
    assert.equal(posToIndex(rects, 0, 450), 4);
    assert.equal(posToIndex(rects, 0, 499), 4);
    assert.equal(posToIndex(rects, 0, 0), 0);
    assert.equal(posToIndex(rects, 0, 850), 8);
    assert.equal(posToIndex(rects, 0, 905), 9);
    assert.equal(posToIndex(rects, 4, 950), 9);
    assert.equal(posToIndex(rects, 4, 50), 0);
  });


  it('size 110, gap -10', () => {
    const rects = [...generateRects(10, 110, -10)];
    assert.equal(posToIndex(rects, 0, 950), 9);
    assert.equal(posToIndex(rects, 0, 450), 4);
    assert.equal(posToIndex(rects, 0, 499), 4);
    assert.equal(posToIndex(rects, 0, 0), 0);
    assert.equal(posToIndex(rects, 0, 850), 8);
    assert.equal(posToIndex(rects, 0, 905), 9);
    assert.equal(posToIndex(rects, 4, 950), 9);
    assert.equal(posToIndex(rects, 4, 50), 0);
  });
});

describe('applyTransform', () => {
  it("drag first, first to last", () => {
    const body = new JSDOM('<div></div>'.repeat(10)).window.document.body;
    applyTransform(body.children, 0, 0, 9, 100);
    assert.equal(body.innerHTML, '<div></div>' +
      '<div class="draggable-list-transformed" style="transform: translateY(-100px);"></div>'.repeat(9));
  });

  it("drag first, first to middle", () => {
    const body = new JSDOM('<div></div>'.repeat(10)).window.document.body;
    applyTransform(body.children, 0, 0, 4, 100);
    assert.equal(body.innerHTML, '<div></div>' +
      '<div class="draggable-list-transformed" style="transform: translateY(-100px);"></div>'.repeat(4) +
      '<div></div>'.repeat(5));
  });

  it("drag first, last to first", () => {
    const body = new JSDOM('<div></div>' + '<div class="draggable-list-transformed"></div>'.repeat(9)).window.document.body;
    applyTransform(body.children, 0, 9, 0, 100);
    assert.equal(
      body.innerHTML,
      '<div></div>' + 
      '<div class="" style=""></div>'.repeat(9));
  });

  it("drag first, last to second last", () => {
    const body = new JSDOM('<div></div>' + '<div class="draggable-list-transformed"></div>'.repeat(9)).window.document.body;
    applyTransform(body.children, 0, 9, 8, 100);
    assert.equal(
      body.innerHTML,
      '<div></div>' + 
      '<div class="draggable-list-transformed"></div>'.repeat(8) +
      '<div class="" style=""></div>'
    );
  });

  it("drag first, last to last", () => {
    const body = new JSDOM('<div></div>' + '<div class="draggable-list-transformed"></div>'.repeat(9)).window.document.body;
    applyTransform(body.children, 0, 9, 9, 100);
    assert.equal(
      body.innerHTML,
      '<div></div>' + 
      '<div class="draggable-list-transformed"></div>'.repeat(9) 
    );
  });

  it("drag middle, last to first", () => {
    const body = new JSDOM('<div></div>'.repeat(10)).window.document.body;
    applyTransform(body.children, 4, 9, 0, 100);
    assert.equal(body.innerHTML, 
      '<div class="draggable-list-transformed" style="transform: translateY(100px);"></div>'.repeat(4) +
      '<div></div>'.repeat(6));
  });
  
  it("drag middle, first to last", () => {
    const body = new JSDOM('<div class="draggable-list-transformed"></div>'.repeat(4) + '<div></div>'.repeat(6)).window.document.body;
    applyTransform(body.children, 4, 0, 9, 100);
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
