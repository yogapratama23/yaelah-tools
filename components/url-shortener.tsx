"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Copy, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Url } from "@/lib/dto"
import { createUrl, deleteUrl } from "@/lib/actions/url.action"

export function UrlShortener() {
  const [longUrl, setLongUrl] = useState("")
  const [customAlias, setCustomAlias] = useState("")
  const [shortUrl, setShortUrl] = useState("")
  const [urlHistory, setUrlHistory] = useState<Url[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const storedHistory = localStorage.getItem("urlHistory")
    if (storedHistory) {
      setUrlHistory(JSON.parse(storedHistory))
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const alias = customAlias || Math.random().toString(36).substr(2, 6)
    const createdUrl = await createUrl({
      longUrl,
      alias,
    })

    if (!createdUrl.success) {
      toast({
        title: 'Failed to generate shortened URL',
        description: createdUrl.message,
      });
    } else {
      const updatedHistory = [createdUrl.data, ...urlHistory]
      setShortUrl(createdUrl.data.shortUrl)
      setUrlHistory(updatedHistory)
      localStorage.setItem("urlHistory", JSON.stringify(updatedHistory))

      toast({
        title: 'Shortened URL Created',
        description: createdUrl.message
      })
    }

    setLongUrl("")
    setCustomAlias("")
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    toast({
      title: "Copied to clipboard",
      description: "The shortened URL has been copied to your clipboard.",
    })
  }

  const deleteHistoryItem = async (id: number) => {
    const deletedUrl = await deleteUrl(id)
    if (deletedUrl.success) {
      const updatedHistory = urlHistory.filter((url) => url.id !== id)
      setUrlHistory(updatedHistory)
      localStorage.setItem("urlHistory", JSON.stringify(updatedHistory))

      toast({
        title: 'Shortened URL Deleted',
        description: deletedUrl.message,
      });
    }
  }

  return (
    <div className="space-y-6 rounded-lg bg-card p-4 shadow-md sm:p-6 md:p-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="long-url" className="text-foreground">
            Enter your long URL
          </Label>
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <Input
              id="long-url"
              type="url"
              placeholder="https://example.com/very/long/url"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              required
              className="flex-grow bg-background text-foreground"
            />
            <Button type="submit" className="w-full sm:w-auto bg-primary text-primary-foreground">
              Shorten
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="custom-alias" className="text-foreground">
            Custom alias (optional)
          </Label>
          <Input
            id="custom-alias"
            type="text"
            placeholder="my-custom-url"
            value={customAlias}
            onChange={(e) => setCustomAlias(e.target.value)}
            className="bg-background text-foreground"
          />
        </div>
      </form>

      {shortUrl && (
        <div className="space-y-2">
          <Label htmlFor="short-url" className="text-foreground">
            Your shortened URL
          </Label>
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <Input
              id="short-url"
              type="url"
              value={shortUrl}
              readOnly
              className="flex-grow bg-background text-foreground"
            />
            <Button
              variant="outline"
              onClick={() => copyToClipboard(shortUrl)}
              className="w-full sm:w-auto border-primary text-primary"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </Button>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold text-primary">Your URL History</h2>
        {urlHistory.length > 0 ? (
          <ul className="space-y-4">
            {urlHistory.map((item, index) => (
              <li
                key={index}
                className="flex flex-col space-y-2 rounded-md border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0"
              >
                <div className="flex-grow space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Original: {item.longUrl}</p>
                  <p className="text-sm font-medium text-foreground">Shortened: {item.shortUrl}</p>
                  <p className="text-xs text-muted-foreground">Created: {new Date(item.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(item.shortUrl)}
                    className="border-primary text-primary"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteHistoryItem(item.id)}
                    className="border-destructive text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">No URL history yet. Start shortening URLs to see your history here.</p>
        )}
      </div>
    </div>
  )
}

