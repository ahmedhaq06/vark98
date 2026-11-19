// CDs for sale. Put real cover art in /public/cds/ and swap out the sample entries below.

export const cds = [
  {
    id: 'sample-cd-01',
    title: 'Sample Album CD #01',
    cover: '/placeholders/cd-1.svg',
    year: 2026,
    price: 499,
    tracks: ['Intro (Sample)', 'Track 02 (Sample)', 'Track 03 (Sample)', 'Outro (Sample)'],
    stock: 25,
    description: 'Sample placeholder CD. Cover art, tracklist, and pricing to be updated.',
    sample: true,
  },
  {
    id: 'sample-cd-02',
    title: 'Sample EP CD #02',
    cover: '/placeholders/cd-2.svg',
    year: 2025,
    price: 349,
    tracks: ['Track 01 (Sample)', 'Track 02 (Sample)', 'Track 03 (Sample)'],
    stock: 0,
    description: 'Sample placeholder CD demonstrating the Out of Stock state.',
    sample: true,
  },
];
