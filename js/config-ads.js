// ==========================================
// ADVERTISING CONFIG
// ==========================================
// Ads are OFF by default. To turn them on:
//   1. Set `enabled: true`
//   2. Set `client` to your AdSense Publisher ID (looks like "ca-pub-1234567890123456")
//   3. Set each slot ID below to the matching Ad Unit's Slot ID from your AdSense dashboard
// Nothing renders (and no AdSense script loads) until `enabled` is true AND `client` has been
// changed from the placeholder -- so a half-finished setup can never show broken ad boxes to
// visitors. This file is only ever read on the News pages; no other page on the site loads it.
const AdsConfig = {
  enabled: true,
  client: 'ca-pub-4392970178902104',
  slots: {
    newsListTop: 'REPLACE-WITH-AD-SLOT-ID',   // one banner above the News list
    newsInFeed: 'REPLACE-WITH-AD-SLOT-ID',    // repeated in-feed unit, every few posts
    newsPost: 'REPLACE-WITH-AD-SLOT-ID'       // one unit below an individual news article
  }
};
