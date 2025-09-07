# BTHSHub-App
Copyright (c) 2025 ZarmDev. All rights reserved.
1. Run ```bun install```
2. Add your Google Maps API key in a .env file
3. Add the first IP address that appears when running ```ipconfig``` (your localhost IP address)
   ```
   GOOGLE_MAP_KEY=yourapikey
   EXPO_PUBLIC_SERVER_URL=192.168.x.x
   ```

4. Start the app

   ```bash
   npx expo start OR bunx expo start
   ```
5. When running with the server, you must follow the server instructions AND disable your firewall if you are on Windows. If you are on linux, then no further action is needed except running the server
