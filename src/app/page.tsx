"use client";

import * as React from "react";
import type { z } from "zod";
import { DescriptionInput } from "@/components/description-input";
import { CodeDisplay } from "@/components/code-display";
import { generateCode, type GenerateCodeInput, type GenerateCodeOutput } from "@/ai/flows/generate-code-from-description";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggleButton } from "@/components/theme-toggle-button"; // Import the toggle button
import { PreviewButton } from "@/components/preview-button"; // Import the preview button

export default function Home() {
  const [generatedCode, setGeneratedCode] = React.useState<GenerateCodeOutput>({
    html: "",
    css: "",
    javascript: "",
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const handleGenerateCode = async (data: GenerateCodeInput) => {
    setIsLoading(true);
    setGeneratedCode({ html: "", css: "", javascript: "" }); // Clear previous code
    try {
      const result = await generateCode(data);
      setGeneratedCode(result);
      toast({
        title: "Code Generated Successfully!",
        description: "Review the generated code snippets.",
      });
    } catch (error) {
      console.error("Error generating code:", error);
      toast({
        variant: "destructive",
        title: "Error Generating Code",
        description: "An unexpected error occurred. Please try again.",
      });
      setGeneratedCode({ html: "", css: "", javascript: "" }); // Clear on error
    } finally {
      setIsLoading(false);
    }
  };

  const downloadFile = (filename: string, content: string, type: string) => {
    const blob = new Blob([content], { type });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const handleDownload = (format: 'html' | 'separate') => {
    if (format === 'html') {
      const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Component</title>
    <style>
${generatedCode.css}
    </style>
</head>
<body>
${generatedCode.html}
<script>
${generatedCode.javascript}
</script>
</body>
</html>`;
      downloadFile("generated_component.html", fullHtml, "text/html");
    } else if (format === 'separate') {
      downloadFile("index.html", generatedCode.html, "text/html");
      downloadFile("style.css", generatedCode.css, "text/css");
      downloadFile("script.js", generatedCode.javascript, "text/javascript");
    }
    toast({
      title: "Download Started",
      description: `Code files are being downloaded.`,
    });
  };

  const hasGeneratedCode = !!(generatedCode.html || generatedCode.css || generatedCode.javascript);

  return (
    // Use bg-background, add overflow-hidden to prevent potential scrollbars, add pb-16 for footer space
    <main className="flex flex-col md:flex-row min-h-screen p-4 md:p-6 pb-16 gap-4 md:gap-6 bg-background relative">
      {/* Add Theme Toggle Button and Preview Button */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <PreviewButton 
          html={generatedCode.html}
          css={generatedCode.css}
          javascript={generatedCode.javascript}
          disabled={isLoading || !hasGeneratedCode}
        />
        <ThemeToggleButton />
      </div>
      
      {/* Description input section - now smaller */}
      <div className="flex flex-col md:w-1/3 md:max-h-[calc(100vh-theme(spacing.24))]">
        <DescriptionInput
          onSubmit={handleGenerateCode}
          onDownload={handleDownload}
          isLoading={isLoading}
          hasGeneratedCode={hasGeneratedCode}
        />
      </div>
      
      {/* Code display section - now larger */}
      <div className="flex flex-col md:w-2/3 md:max-h-[calc(100vh-theme(spacing.24))]">
        <CodeDisplay
          html={generatedCode.html}
          css={generatedCode.css}
          javascript={generatedCode.javascript}
          isLoading={isLoading}
        />
      </div>

      {/* Footer with Made by Arnold text - now using fixed positioning */}
      <div className="fixed bottom-3 left-0 right-0 flex items-center justify-center space-x-2 py-2 z-10">
        <div className="bg-primary/10 backdrop-blur-sm px-4 py-2 rounded-full border border-primary/20 flex items-center gap-2 shadow-md">
          <span className="text-sm font-medium bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            Made with ❤️ by Arnold
          </span>
          <span className="text-xs text-muted-foreground px-2 border-l border-primary/20">V0.0.1</span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
        </div>
      </div>
    </main>
  );
}
