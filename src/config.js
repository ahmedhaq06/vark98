// Site-wide settings. Edit here — no need to touch components.
export const site = {
  artist: 'VARK',
  tagline: 'Desi Hip Hop / Rap',
  email: '', // e.g. 'bookings@vark.in' — shown on the Contact window when set
  socials: [
    // { label: 'Instagram', url: 'https://instagram.com/...' },
    // { label: 'Spotify', url: 'https://open.spotify.com/artist/...' },
    // { label: 'YouTube', url: 'https://youtube.com/@...' },
  ],
};

export const shop = {
  currency: 'INR',
  shippingRegion: 'All India',
  payments: {
    // Flip to true once CCAvenue is integrated (Netlify Function + merchant credentials).
    enabled: false,
    provider: 'CCAvenue',
  },
};

// Boot screen: shown once per browser session. Add ?boot to the URL to force it.
export const boot = {
  durationMs: 3800,
  oncePerSession: true,
};
