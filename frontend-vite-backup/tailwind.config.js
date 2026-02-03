/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'Noto Sans JP', 'sans-serif'],
            },
            colors: {
                glass: {
                    surface: 'rgba(255, 255, 255, 0.65)', // High transparency for glass
                    border: 'rgba(255, 255, 255, 0.4)',
                    text: '#1d1d1f',
                    textSecondary: '#86868b',
                },
                md: { // Keeping 'md' prefix for compatibility but mapping to new glass styles
                    background: 'transparent', // Background will be handled by CSS gradient
                    onBackground: '#1d1d1f',
                    surface: 'rgba(255, 255, 255, 0.65)', // Glassy Card
                    onSurface: '#1d1d1f',
                    surfaceVariant: 'rgba(255, 255, 255, 0.4)',
                    onSurfaceVariant: '#424245',
                    outline: 'rgba(0, 0, 0, 0.1)',

                    primary: '#00A3FF', // Cyan/Light Blue Accent
                    onPrimary: '#FFFFFF',
                    primaryContainer: 'rgba(0, 163, 255, 0.2)',
                    onPrimaryContainer: '#00588A',

                    secondary: '#5E5CE6',
                    onSecondary: '#FFFFFF',
                    secondaryContainer: 'rgba(94, 92, 230, 0.2)',
                    onSecondaryContainer: '#2A2875',

                    error: '#FF3B30',
                    onError: '#FFFFFF',
                    errorContainer: 'rgba(255, 59, 48, 0.2)',
                    onErrorContainer: '#8F0F09',
                }
            }
        },
        boxShadow: {
            'level-1': '0 1px 3px 1px rgba(0, 0, 0, 0.15), 0 1px 2px 0 rgba(0, 0, 0, 0.3)',
            'level-2': '0 2px 6px 2px rgba(0, 0, 0, 0.15), 0 1px 2px 0 rgba(0, 0, 0, 0.3)',
            'level-3': '0 4px 8px 3px rgba(0, 0, 0, 0.15), 0 1px 3px 0 rgba(0, 0, 0, 0.3)',
            'level-4': '0 6px 10px 4px rgba(0, 0, 0, 0.15), 0 2px 3px 0 rgba(0, 0, 0, 0.3)',
            'level-5': '0 8px 12px 6px rgba(0, 0, 0, 0.15), 0 4px 4px 0 rgba(0, 0, 0, 0.3)',
        },
        borderRadius: {
            'xl': '12px',
            '2xl': '16px',
            '3xl': '24px',
            '4xl': '32px', // For FABs and large containers
        }
    },
},
plugins: [],
}
