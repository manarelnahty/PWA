# PWA Lab Assignment

A Progressive Web App demonstrating installability and offline functionality using vanilla JavaScript.

## Features Implemented

### ✅ Core Requirements

1. **Installability**
   - Properly configured `manifest.webmanifest` with all required fields
   - Multiple icon sizes (16px to 512px) for different devices
   - Standalone display mode for app-like experience
   - Theme colors and branding

2. **Offline Functionality**
   - Service Worker caching strategy
   - Cache-first approach for fast loading
   - Network fallback when resource not cached
   - Automatic caching of visited resources

### ✨ Bonus Features

3. **Cache Update Handling**
   - **Stale-While-Revalidate Strategy**: Serves cached content immediately while fetching fresh content in the background
   - **Automatic Cache Cleanup**: Removes old cache versions on service worker activation
   - **Version Management**: Cache versioning system (increment `CACHE_VERSION` to force updates)
   - **Manual Cache Updates**: Message-based cache update triggering
   - **Update Notifications**: User prompt when new version is available
   - **Periodic Update Checks**: Automatic service worker update checks every minute

## How It Works

### Service Worker Lifecycle

1. **Install Phase**
   - Caches essential files for offline use
   - Uses `skipWaiting()` to activate immediately

2. **Activate Phase**
   - Cleans up old caches
   - Takes control of all pages with `clients.claim()`

3. **Fetch Phase**
   - Intercepts network requests
   - Serves from cache if available
   - Fetches from network as fallback
   - Updates cache in background (stale-while-revalidate)

### Cache Update Detection

The service worker automatically detects when cached files change:
- Compares cache responses with network responses
- Updates cache with fresh content in the background
- Maintains fast load times while keeping content fresh

## Testing the PWA

### Test Installability
1. Open the app in Chrome/Edge
2. Look for the install button in the address bar
3. Click to install the app
4. App should open in standalone window

### Test Offline Functionality
1. Open the app and navigate between pages
2. Open DevTools > Network tab
3. Set throttling to "Offline"
4. Reload the page - it should still work
5. Navigate between pages - all cached pages accessible

### Test Cache Updates
1. Make changes to any cached file
2. Reload the page (while online)
3. Check console - you'll see cache update messages
4. The new content is cached for next offline use

## Files Modified

- **`manifest/manifest.webmanifest`**: Complete rewrite with proper PWA configuration
- **`sw.js`**: Complete rewrite with comprehensive caching and update strategies
- **`index.html`**: Enhanced service worker registration with update handling

## Technical Details

### Caching Strategy
- **Cache First, Network Fallback**: Fast performance, works offline
- **Background Updates**: Fresh content without blocking user
- **Dynamic Caching**: New resources automatically cached on first visit

### Cache Versioning
```javascript
const CACHE_VERSION = 'v1'; // Increment to force cache update
```

Change this value to force all clients to download fresh content.

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (iOS 11.3+)

## Author

PWA Lab Assignment - ITI Course
