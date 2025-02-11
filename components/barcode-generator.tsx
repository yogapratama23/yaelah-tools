"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import JsBarcode from "jsbarcode"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

type BarcodeType = "CODE128" | "CODE39" | "EAN13" | "UPC"

const barcodeTypes: { [key in BarcodeType]: string } = {
  CODE128: "Code 128",
  CODE39: "Code 39",
  EAN13: "EAN-13",
  UPC: "UPC-A",
}

export function BarcodeGenerator() {
  const [text, setText] = useState("")
  const [barcodeType, setBarcodeType] = useState<BarcodeType>("CODE128")
  const [barcode, setBarcode] = useState("")
  const [error, setError] = useState("")
  const svgRef = useRef<SVGSVGElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (barcode && svgRef.current) {
      try {
        JsBarcode(svgRef.current, barcode, {
          format: barcodeType,
          width: 2,
          height: 100,
          displayValue: true,
        })
        setError("")
      } catch (error) {
        setError("Invalid input for the selected barcode type.")
      }
    }
  }, [barcode, barcodeType])

  const validateInput = (input: string, type: BarcodeType): boolean => {
    switch (type) {
      case "UPC":
        return /^\d{11}$/.test(input)
      case "EAN13":
        return /^\d{12}$/.test(input)
      default:
        return true
    }
  }

  const calculateCheckDigit = (input: string, type: BarcodeType): string => {
    let sum = 0
    const digits = input.split("").map(Number)

    if (type === "UPC") {
      for (let i = 0; i < 11; i++) {
        sum += i % 2 === 0 ? digits[i] * 3 : digits[i]
      }
      const checkDigit = (10 - (sum % 10)) % 10
      return input + checkDigit
    } else if (type === "EAN13") {
      for (let i = 0; i < 12; i++) {
        sum += i % 2 === 0 ? digits[i] : digits[i] * 3
      }
      const checkDigit = (10 - (sum % 10)) % 10
      return input + checkDigit
    }
    return input
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateInput(text, barcodeType)) {
      const barcodeWithCheckDigit = calculateCheckDigit(text, barcodeType)
      setBarcode(barcodeWithCheckDigit)
      setError("")
    } else {
      setError(`Invalid input. ${getPlaceholder()}`)
    }

    toast({
      title: 'Barcode generated',
      description: 'Success generating barcode ' + barcodeType
    })
  }

  const downloadBarcode = () => {
    const svg = document.getElementById("barcode")
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
        downloadLink.download = `barcode-${barcodeType}.png`
        downloadLink.href = pngFile
        downloadLink.click()
      }
      img.src = "data:image/svg+xml;base64," + btoa(svgData)
    }
  }

  const getPlaceholder = () => {
    switch (barcodeType) {
      case "EAN13":
        return "Enter 12 digits (13th is auto-calculated)"
      case "UPC":
        return "Enter 11 digits (12th is auto-calculated)"
      default:
        return "Enter text here"
    }
  }

  return (
    <div className="space-y-6 rounded-lg bg-card p-4 shadow-md sm:p-6 md:p-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="barcode-type" className="text-foreground">
            Select barcode type
          </Label>
          <Select value={barcodeType} onValueChange={(value: BarcodeType) => setBarcodeType(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select barcode type" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(barcodeTypes).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="barcode-text" className="text-foreground">
            Enter text for barcode
          </Label>
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <Input
              id="barcode-text"
              type="text"
              placeholder={getPlaceholder()}
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              className="flex-grow bg-background text-foreground"
            />
            <Button type="submit" className="w-full sm:w-auto bg-primary text-primary-foreground">
              Generate Barcode
            </Button>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      </form>

      {barcode && !error && (
        <div className="flex flex-col items-center space-y-4">
          <svg id="barcode" ref={svgRef}></svg>
          <Button onClick={downloadBarcode} className="bg-primary text-primary-foreground">
            Download Barcode
          </Button>
        </div>
      )}
    </div>
  )
}

