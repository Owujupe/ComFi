import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/context/WalletContext"; // Adjust the import path as necessary
// import { FormProvider } from "@/context/FormContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Owujupe",
  description: "A community-sourced crowd funding platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          {/* <FormProvider> */}
            {children}
          {/* </FormProvider> */}
        </WalletProvider>
      </body>
    </html>
  );
}
