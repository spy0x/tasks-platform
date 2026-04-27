import './globals.css';

export const metadata = {
  title: 'Tasks Platform',
  description: 'Kanban + Eisenhower dashboard'
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
