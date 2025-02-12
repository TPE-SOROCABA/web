import withMT from "@material-tailwind/react/utils/withMT";
 
export default withMT({
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
  	extend: {
  		colors: {
  			primary: {
  				'50': '#f3f6ff',
  				'100': '#e8eaf6',
  				'200': '#c5cee0',
  				'300': '#a2aebb',
  				'400': '#5c6b7b',
  				'500': '#374192',
  				'600': '#333d88',
  				'700': '#2d3477',
  				'800': '#272b66',
  				'900': '#1f1f4d'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
});