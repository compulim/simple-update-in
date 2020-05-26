/**
 * @jest-environment jsdom
 */

import 'regenerator-runtime';
import { join } from 'path';
import { JSDOM } from 'jsdom';

async function waitOnce(eventTarget, name) {
  return new Promise(resolve => eventTarget.addEventListener(name, resolve, { once: true }));
}

test('Able to load development bundle via window.simpleUpdateIn', async () => {
  const { window } = await JSDOM.fromFile(join(__dirname, 'dist.development.html'), {
    resources: 'usable',
    runScripts: 'dangerously'
  });

  await waitOnce(window, 'load');

  const actual = window.simpleUpdateIn({ one: 1, two: 2 }, ['three'], () => 3);

  expect(actual).toEqual({ one: 1, two: 2, three: 3 });
});

test('Able to load production bundle via window.simpleUpdateIn', async () => {
  const { window } = await JSDOM.fromFile(join(__dirname, 'dist.production.html'), {
    resources: 'usable',
    runScripts: 'dangerously'
  });

  await waitOnce(window, 'load');

  const actual = window.simpleUpdateIn({ one: 1, two: 2 }, ['three'], () => 3);

  expect(actual).toEqual({ one: 1, two: 2, three: 3 });
});
