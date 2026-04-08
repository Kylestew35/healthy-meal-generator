import "./globals.css";

export const metadata = {
  title: "Healthy Meal Generator",
  description: "Generate healthy meals, macros, and grocery lists instantly."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
