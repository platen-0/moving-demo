import { TICKER_NAMES, TICKER_CITIES } from './constants';

/**
 * Generate a random activity ticker message for moving.
 */
export function generateTickerMessage(): string {
  const templates = [
    (name: string, city: string) => {
      const movers = randomBetween(3, 6);
      return `${name} from ${city} just compared ${movers} moving quotes`;
    },
    (name: string, city: string) => {
      const savings = randomBetween(3, 8) * 100;
      return `${name} from ${city} saved $${savings} by comparing movers`;
    },
    () => {
      const count = randomBetween(800, 1800);
      return `${count.toLocaleString()} people got moving quotes today`;
    },
    (name: string, city: string) => {
      const items = randomBetween(20, 60);
      return `${name} from ${city} is moving ${items} items this week`;
    },
    (name: string, city: string) => {
      return `${name} from ${city} found their perfect mover`;
    },
  ];

  const name = TICKER_NAMES[Math.floor(Math.random() * TICKER_NAMES.length)];
  const city = TICKER_CITIES[Math.floor(Math.random() * TICKER_CITIES.length)];
  const template = templates[Math.floor(Math.random() * templates.length)];

  return template(name, city);
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Get today's date formatted for display.
 */
export function getTodayFormatted(): string {
  return new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Generate a "people today" count that feels specific.
 */
export function getTodayCount(): string {
  const base = 1200 + Math.floor(Math.random() * 600);
  return base.toLocaleString();
}
