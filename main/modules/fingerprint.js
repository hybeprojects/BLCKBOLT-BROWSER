// main/modules/fingerprint.js - Fingerprint control module for BLCKBOLT-BROWSER
// Overrides user agent, screen size, timezone, etc.

const profiles = [
  {
    name: 'Chrome Windows',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    platform: 'Win32',
    vendor: 'Google Inc.',
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
  },
  {
    name: 'Safari macOS',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
    platform: 'MacIntel',
    vendor: 'Apple Computer, Inc.',
    deviceScaleFactor: 2,
    isMobile: false,
    hasTouch: false,
  },
  {
    name: 'iPhone Mobile',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    platform: 'iPhone',
    vendor: 'Apple Computer, Inc.',
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  },
];

class Fingerprint {
  constructor() {
    this.currentProfile = profiles[0];
  }

  setProfile(index) {
    if (profiles[index]) {
      this.currentProfile = profiles[index];
    }
  }

  randomize() {
    const index = Math.floor(Math.random() * profiles.length);
    this.currentProfile = profiles[index];
    return this.currentProfile;
  }

  getCurrent() {
    return this.currentProfile;
  }

  getAllProfiles() {
    return profiles;
  }

  applyToSession(ses) {
    if (this.currentProfile.userAgent) {
      ses.setUserAgent(this.currentProfile.userAgent);
    }
    // Note: Overriding other things (timezone, screen size) often requires
    // CDP or preload script overrides.
  }
}

module.exports = new Fingerprint();
