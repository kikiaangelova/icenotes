import '@testing-library/jest-dom';

// jsdom ships neither observer, and Radix popups measure themselves with ResizeObserver.
class ObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
globalThis.ResizeObserver = (globalThis.ResizeObserver || ObserverStub) as unknown as typeof ResizeObserver;
globalThis.IntersectionObserver = (globalThis.IntersectionObserver || ObserverStub) as unknown as typeof IntersectionObserver;

// Radix popups use pointer capture and scrollIntoView, both missing from jsdom.
const elementProto = Element.prototype as Element & {
  hasPointerCapture?: (id: number) => boolean;
  setPointerCapture?: (id: number) => void;
  releasePointerCapture?: (id: number) => void;
  scrollIntoView?: () => void;
};
elementProto.hasPointerCapture = elementProto.hasPointerCapture || (() => false);
elementProto.setPointerCapture = elementProto.setPointerCapture || (() => {});
elementProto.releasePointerCapture = elementProto.releasePointerCapture || (() => {});
elementProto.scrollIntoView = elementProto.scrollIntoView || (() => {});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});
