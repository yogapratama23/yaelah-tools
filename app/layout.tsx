import type React from "react"
import "@/app/globals.css"
import { Noto_Sans } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
})

export const metadata = {
  title: "Yaelah Tools",
  description: "Shorten URLs and generate QR codes with ease",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${notoSans.className} bg-background text-foreground`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}

