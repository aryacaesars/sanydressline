import "./globals.css";

export const metadata = {
  title: "Sanydressline",
  description: "Dress",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Sanydressline - Best dresses for every occasion." />
        <meta name="keywords" content="dresses, fashion, Sanydressline, clothing" />
        <title>Sanydressline - Best dresses for every occasion</title>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
