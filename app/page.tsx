"use client"

import { useState } from "react"
import { UrlShortener } from "@/components/url-shortener"
import { QrCodeGenerator } from "@/components/qr-code-generator"
import { BarcodeGenerator } from "@/components/barcode-generator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  const [activeTab, setActiveTab] = useState("shorten")

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-2xl">
        {/* <h1 className="mb-6 text-center text-3xl font-bold text-primary sm:mb-8 sm:text-4xl md:text-5xl">Yaelah Tools</h1> */}
        <img src="/logo.png" className="w-48 mx-auto mb-4" alt="yaelah-tools-logo" />
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted">
            <TabsTrigger value="shorten" className="data-[state=active]:bg-background">
              URL Shortener
            </TabsTrigger>
            <TabsTrigger value="qr" className="data-[state=active]:bg-background">
              QR Code
            </TabsTrigger>
            <TabsTrigger value="barcode" className="data-[state=active]:bg-background">
              Barcode
            </TabsTrigger>
          </TabsList>
          <TabsContent value="shorten" className="mt-4">
            <UrlShortener />
          </TabsContent>
          <TabsContent value="qr" className="mt-4">
            <QrCodeGenerator />
          </TabsContent>
          <TabsContent value="barcode" className="mt-4">
            <BarcodeGenerator />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

