import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'ez-attendance',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // url: '172.16.5.4:8100',
    // cleartext: true
  }
};

export default config;
