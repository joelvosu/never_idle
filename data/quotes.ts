export interface Quote {
  id: number;
  quote: string;
  author: string;
}
export const quotes: Quote[] = [
  {
    id: 1,
    quote: 'Laziness casts one into a deep sleep, and an idle person will suffer hunger.',
    author: 'The Bible (Proverbs 19:15)',
  },
  {
    id: 2,
    quote: 'Do not love sleep, lest you come to poverty; Open you eyes, and you will be satisfied with bread',
    author: 'The Bible (Proverbs 20:13)',
  },
  {
    id: 3,
    quote:
      'A little sleep, a little slumber, A little folding of the hands to sleep — So shall your poverty come on you like a prowler, And your need like an armed man.',
    author: 'The Bible (Proverbs 6:10-11)',
  },
  {
    id: 4,
    quote: 'For even when we were with you, we commanded you this: If anyone will not work, neither shall he eat.',
    author: 'The Bible (2 Thessalonians 3:10)',
  },
];
