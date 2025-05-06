"use client"

import * as React from "react"
import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog"

interface PreviewButtonProps {
  html: string;
  css: string;
  javascript: string;
  disabled?: boolean;
}

export function PreviewButton({ html, css, javascript, disabled = false }: PreviewButtonProps) {
  const [open, setOpen] = React.useState(false);
  
  // Only render the iframe content when the dialog is open to prevent unnecessary rendering
  const iframeContent = open ? `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Preview</title>
        <style>
        ${css}
        </style>
    </head>
    <body>
        ${html}
        <script>
        ${javascript}
        </script>
    </body>
    </html>
  ` : "";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 px-4"
          disabled={disabled || (!html && !css && !javascript)}
          title="Preview"
        >
          <span>Preview</span>
          <Eye className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Preview</span>
        </Button>
      </DialogTrigger>
      {open && (
        <DialogContent className="w-screen h-screen max-w-none p-0 border-none bg-white dark:bg-black sm:rounded-none">
          <div className="w-full h-full overflow-auto">
            <iframe
              srcDoc={iframeContent}
              className="w-full h-full border-0"
              title="Preview"
              sandbox="allow-scripts"
            />
          </div>
          <DialogClose className="absolute right-4 top-4 rounded-full w-8 h-8 flex items-center justify-center bg-background/80 backdrop-blur border hover:bg-background z-50">
            ✕
          </DialogClose>
        </DialogContent>
      )}
    </Dialog>
  )
}