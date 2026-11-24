// Site-wide settings. Edit here — no need to touch components.
export const site = {
  artist: 'VARK',
  tagline: 'Artist / Expressionist',
  email: 'vark19team@gmail.com', // shown on the Contact window
  socials: [
    { label: 'Spotify', sub: 'Stream VARK on Spotify', url: 'https://open.spotify.com/artist/1ZPrQdzfOL25ppQa4LlkpJ?si=i2akyy_nRmKVZ12p87JTmg&utm_source=copy-link&sci=spotify%3Acard-config%3A0LbWbIoKXlIzHghf7dglIz' },
    { label: 'Apple Music', sub: 'Listen on Apple Music', url: 'https://music.apple.com/in/artist/vark/1494625555?ls' },
    { label: 'YouTube', sub: '@vark_19', url: 'https://youtube.com/@vark_19?si=xJZYMdlgS1JGScAA' },
    { label: 'Instagram', sub: '@vark_19', url: 'https://www.instagram.com/vark_19?knvt=dnM4OHZhNm1yd2pu' },
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
