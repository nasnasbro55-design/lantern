import { expect, it } from 'vitest';
import { directorateShare, fairShare } from './allocator';

const claims = [{ level: 12, need: 20, weight: 3 }, { level: 1, need: 60, weight: 1 }];

it('splits weighted need and redistributes when a claim hits its cap', () => {
  expect(fairShare(30, claims)).toEqual({ 1: 15, 12: 15 });
  expect(fairShare(70, claims)).toEqual({ 1: 50, 12: 20 });
  expect(fairShare(200, claims)).toEqual({ 1: 60, 12: 20 });
});

it('serves upper levels first under Directorate rules', () => {
  expect(directorateShare(65, claims)).toEqual({ 1: 60, 12: 5 });
  expect(directorateShare(0, claims)).toEqual({ 1: 0, 12: 0 });
});
