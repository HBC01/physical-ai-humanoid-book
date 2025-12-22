/**
 * Jest Setup
 * Global test configuration and mocks
 */

// Mock Docusaurus components and hooks
jest.mock('@docusaurus/Link', () => {
  return ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>;
});

jest.mock('@docusaurus/router', () => ({
  useLocation: () => ({
    pathname: '/docs/intro',
    search: '',
    hash: '',
  }),
  useHistory: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    goBack: jest.fn(),
  }),
}));

jest.mock('@docusaurus/useDocusaurusContext', () => ({
  __esModule: true,
  default: () => ({
    siteConfig: {
      title: 'Physical AI & Humanoid Robotics',
      tagline: 'An AI-Native Textbook',
      url: 'https://example.com',
      baseUrl: '/',
    },
    i18n: {
      defaultLocale: 'en',
      currentLocale: 'en',
      locales: ['en', 'ur'],
    },
  }),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
