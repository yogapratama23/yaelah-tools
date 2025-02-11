"use client"

import type React from "react"
import { useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export function QrCodeGenerator() {
  const [url, setUrl] = useState("")
  const [qrCode, setQrCode] = useState("")
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setQrCode(url)
  }

  const downloadQrCode = () => {
    const svg = document.getElementById("qr-code")
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg)
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const img = new Image()
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx?.drawImage(img, 0, 0)
        const pngFile = canvas.toDataURL("image/png")
        const downloadLink = document.createElement("a")
        downloadLink.download = "qrcode.png"
        downloadLink.href = pngFile
        downloadLink.click()
      }
      img.src = "data:image/svg+xml;base64," + btoa(svgData)
    }
  }

  return (
    <div className="space-y-6 rounded-lg bg-card p-4 shadow-md sm:p-6 md:p-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="url" className="text-foreground">
            Enter URL for QR Code
          </Label>
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <Input
              id="url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="flex-grow bg-background text-foreground"
            />
            <Button type="submit" className="w-full sm:w-auto bg-primary text-primary-foreground">
              Generate QR
            </Button>
          </div>
        </div>
      </form>

      {qrCode && (
        <div className="flex flex-col items-center space-y-4">
          <QRCodeSVG id="qr-code" value={qrCode} size={200} className="border border-primary p-2" />
          <Button onClick={downloadQrCode} className="bg-primary text-primary-foreground">
            Download QR Code
          </Button>
        </div>
      )}
    </div>
  )
}

