import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 7173, // Change this to your desired port
    },
    define: {
        'process.env': {}
    },
    css: {
        preprocessorOptions: {
            // Enable preprocessor options if needed
        }
    },
    build: {
        // Configure Vite to suppress specific warnings
        rollupOptions: {
            onwarn(warning, warn) {
                if (warning.code === 'UNUSED_EXTERNAL_IMPORT') {
                    // Suppress this specific warning
                    return;
                }
                return;
                //warn(warning);
            }
        }
    }
})
