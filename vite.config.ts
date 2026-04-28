import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          attendance: path.resolve(__dirname, 'attendance.html'),
          clubs: path.resolve(__dirname, 'clubs.html'),
          complaints: path.resolve(__dirname, 'complaints.html'),
          events: path.resolve(__dirname, 'events.html'),
          leave: path.resolve(__dirname, 'leave.html'),
          marks: path.resolve(__dirname, 'marks.html'),
          notes: path.resolve(__dirname, 'notes.html'),
          notices: path.resolve(__dirname, 'notices.html'),
          parent: path.resolve(__dirname, 'parent-portal.html'),
          profile: path.resolve(__dirname, 'profile.html'),
          calendar: path.resolve(__dirname, 'calendar.html'),
          quiz: path.resolve(__dirname, 'quiz.html'),
          reading: path.resolve(__dirname, 'reading.html'),
          wall_of_fame: path.resolve(__dirname, 'wall-of-fame.html')
        }
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
