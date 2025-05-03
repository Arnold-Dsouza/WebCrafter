"use client";

import * as React from "react";
import type { z } from "zod";
import { DescriptionInput } from "@/components/description-input";
import { CodeDisplay } from "@/components/code-display";
import { generateCode, type GenerateCodeInput, type GenerateCodeOutput } from "@/ai/flows/generate-code-from-description";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggleButton } from "@/components/theme-toggle-button"; // Import the toggle button

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
    // Use bg-background, add overflow-hidden to prevent potential scrollbars
    <main className="flex flex-col md:flex-row min-h-screen p-4 md:p-6 gap-4 md:gap-6 bg-background relative overflow-hidden">
      {/* Add Theme Toggle Button */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggleButton />
      </div>
      {/* Ensure flex column layout and use theme spacing for max-height */}
      <div className="flex flex-col md:w-1/2 md:max-h-[calc(100vh-theme(spacing.12))]">
        <DescriptionInput
          onSubmit={handleGenerateCode}
          onDownload={handleDownload}
          isLoading={isLoading}
          hasGeneratedCode={hasGeneratedCode}
        />
      </div>
       {/* Ensure flex column layout and use theme spacing for max-height */}
      <div className="flex flex-col md:w-1/2 md:max-h-[calc(100vh-theme(spacing.12))]">
        <CodeDisplay
          html={generatedCode.html}
          css={generatedCode.css}
          javascript={generatedCode.javascript}
          isLoading={isLoading}
        />
      </div>

      {/* Footer with Made by Arnold text */}
      <div className="absolute bottom-2 left-0 right-0 text-center text-sm text-muted-foreground">
        Made by Arnold
      </div>
    </main>
  );
}
