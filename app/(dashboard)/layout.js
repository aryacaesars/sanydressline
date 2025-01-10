import "../globals.css";
import { UserProvider } from "@/context/UserContext";

export const metadata = {
  title: "Sanydressline",
  description: "Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
    <head>
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={metadata.description} />
    <meta name="keywords" content={metadata.keywords} />
    <meta name="author" content={metadata.author} />
    <title>{metadata.title}</title>
    <link rel="icon" href="/favicon.ico" />
    </head>
      <body>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
