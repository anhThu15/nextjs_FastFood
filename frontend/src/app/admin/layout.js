/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-sync-scripts */
import { Inter } from "next/font/google";
import "./globals.css";
import "../../public/bootstrap/css/bootstrap.min.css";
import Link from "next/link";
import HeaderUser from "./layout/user/headerUser";
import FooterUser from "./layout/user/footerUser";
// import 'aos/dist/aos.css';  
// import AOS from 'aos';
// import { useEffect } from 'react';


export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <HeaderUser></HeaderUser>

        {children}

        <FooterUser></FooterUser>

        <script src="/bootstrap/js/bootstrap.bundle.min.js"></script>
        <script src="https://kit.fontawesome.com/6895c8023a.js" crossorigin="anonymous"></script>
      </body>
    </html>
  );
}
