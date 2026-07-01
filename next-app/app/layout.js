import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Art In The Wild",
  description: "Find and share murals in the wild",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
