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
globalThis.ResizeObserver = globalThis.ResizeObserver || ObserverStub;
globalThis.IntersectionObserver = globalThis.IntersectionObserver || ObserverStub;

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
