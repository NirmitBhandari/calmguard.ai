import "./globals.css";

export const metadata = {
  title: "CalmGuard AI",
  description: "AI-powered disaster safety training",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="main-container">
          {children}
        </div>
      </body>
    </html>
  );
}
