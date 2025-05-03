"use client";

import type * as React from 'react';
import { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeDisplayProps {
  html: string;
  css: string;
  javascript: string;
  isLoading: boolean;
}

export function CodeDisplay({ html, css, javascript, isLoading }: CodeDisplayProps) {
  const [combinedPreview, setCombinedPreview] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("html");
  const [copied, setCopied] = useState(false);
  
  // Combine HTML, CSS, and JavaScript for the preview whenever they change
  useEffect(() => {
    const combined = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>${css}</style>
      </head>
      <body>
        ${html}
        <script>${javascript}</script>
      </body>
      </html>
    `;
    setCombinedPreview(combined);
  }, [html, css, javascript]);

  // Get current content based on active tab
  const getCurrentContent = () => {
    switch(activeTab) {
      case "html": return html;
      case "css": return css;
      case "javascript": return javascript;
      default: return html;
    }
  };

  // Get current label based on active tab
  const getCurrentLabel = () => {
    switch(activeTab) {
      case "html": return "Generated HTML Code";
      case "css": return "Generated CSS Code";
      case "javascript": return "Generated JavaScript Code";
      default: return "Generated HTML Code";
    }
  };

  // Copy code to clipboard
  const copyToClipboard = () => {
    const content = getCurrentContent();
    if (content) {
      navigator.clipboard.writeText(content)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
        });
    }
  };

  if (isLoading) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <Skeleton className="h-6 w-1/4 mb-1" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="flex-grow flex flex-col space-y-4 p-6 pt-0">
           <Skeleton className="h-10 w-full max-w-[200px]" />
           <div className="flex-grow border rounded-md p-2">
             <Skeleton className="h-full w-full" />
           </div>
        </CardContent>
      </Card>
    );
  }

   if (!html && !css && !javascript && !isLoading) {
     return (
        <Card className="h-full flex flex-col items-center justify-center">
            <CardContent className="text-center p-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mx-auto h-12 w-12 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  aria-hidden="true"
                 >
                 <path
                   strokeLinecap="round"
                   strokeLinejoin="round"
                    d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.351-.026.692-.042 1.048-.042h.003c.356 0 .7.016 1.048.042.72.054 1.35.368 1.804.87l1.367 1.368c.45.45.756 1.05.87 1.71.026.351.042.692.042 1.048v1.392M8.25 10.5h7.5m-7.5 3h7.5M3.375 19.5h17.25c.621 0 1.125-.504 1.125-1.125V6.375c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125z"
                 />
                </svg>
                <CardTitle className="mt-4 text-lg font-semibold">No Code Generated Yet</CardTitle>
                <CardDescription className="mt-1 text-sm text-muted-foreground">
                    Enter a description and click "Generate" to see the code here.
                </CardDescription>
            </CardContent>
        </Card>
     )
   }

  return (
    <Card className="h-full flex flex-col overflow-hidden">
       <CardHeader className="pb-2">
        <CardTitle>Generated Code</CardTitle>
        <CardDescription>Review the HTML, CSS, and JavaScript generated below.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4 p-4 pt-0 overflow-hidden">
        {/* Code Section - Use flex-grow and min-height to ensure proper sizing */}
        <div className="flex flex-col min-h-[40%] flex-grow-0 overflow-hidden">
          {/* Properly structured Tabs component */}
          <Tabs defaultValue="html" className="flex-grow flex flex-col w-full" onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-2">
              <TabsList className="grid w-[300px] grid-cols-3 shrink-0">
                <TabsTrigger value="html">HTML</TabsTrigger>
                <TabsTrigger value="css">CSS</TabsTrigger>
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              </TabsList>
              
              {/* Copy Button */}
              <Button
                size="sm"
                variant="outline"
                className={cn(
                  "h-8 px-3 transition-all",
                  copied ? "bg-green-500/20 text-green-700 hover:bg-green-500/20 hover:text-green-700 border-green-500" : ""
                )}
                onClick={copyToClipboard}
                disabled={!getCurrentContent()}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    <span>Copy</span>
                  </>
                )}
              </Button>
            </div>
            
            {/* Enhanced code display area */}
            <div className="flex-grow flex flex-col border rounded-md overflow-hidden relative bg-muted/30">
              <ScrollArea className="h-[250px] w-full">
                <pre 
                  className="font-mono text-sm p-4 whitespace-pre-wrap"
                  aria-label={getCurrentLabel()}
                >
                  <code className="block w-full">{getCurrentContent() || `// No ${activeTab} code generated yet.`}</code>
                </pre>
              </ScrollArea>
            </div>

            {/* Hidden TabsContent elements to satisfy the Tabs API requirements */}
            <TabsContent value="html" className="hidden"></TabsContent>
            <TabsContent value="css" className="hidden"></TabsContent>
            <TabsContent value="javascript" className="hidden"></TabsContent>
          </Tabs>
        </div>
        
        {/* Separator between code and preview */}
        <Separator className="my-1" />
        
        {/* Preview Section - Use flex-grow to fill remaining space */}
        <div className="flex flex-col min-h-[40%] flex-grow overflow-hidden">
          <h3 className="text-lg font-semibold mb-2">Preview</h3>
          <div className="border rounded-md overflow-hidden flex-grow">
            <iframe
              srcDoc={combinedPreview}
              title="Code Preview"
              className="w-full h-full border-0"
              sandbox="allow-scripts"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
