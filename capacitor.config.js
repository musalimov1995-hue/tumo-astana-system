/** @type {import('@capacitor/cli').CapacitorConfig} */
const config = {
  appId: 'kz.tumo.astana',
  appName: 'TUMO Astana',
  webDir: 'dist',
  server: {
    // Remove this block when building for production / App Store
    // Uncomment to use live-reload during development (replace IP with your Mac's local IP):
    // url: 'http://192.168.1.X:5173',
    // cleartext: true,
  },
  ios: {
    contentInset: 'always',       // respects iPhone notch / safe area
    backgroundColor: '#FAFAF8',
  },
  android: {
    backgroundColor: '#FAFAF8',
  },
  plugins: {
    Camera: {
      // Prompts shown when the app requests camera access
      permissionRequestAlert: 'TUMO Astana хочет использовать камеру для биометрической идентификации ученика.',
    },
  },
}

module.exports = config
