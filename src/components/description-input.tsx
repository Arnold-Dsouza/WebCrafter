"use client";

import type * as React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Code, Download, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const FormSchema = z.object({
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
});

interface DescriptionInputProps {
  onSubmit: (data: z.infer<typeof FormSchema>) => void;
  onDownload: (format: 'html' | 'separate') => void;
  isLoading: boolean;
  hasGeneratedCode: boolean;
}

export function DescriptionInput({ onSubmit, onDownload, isLoading, hasGeneratedCode }: DescriptionInputProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      description: "",
    },
  });

  // Handle keyboard shortcuts for the textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // If Enter is pressed without Shift, and the form is valid, submit the form
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault(); // Prevent default behavior (adding a new line)
      
      // Check if the form is valid before submitting
      const descriptionValue = form.getValues('description');
      if (descriptionValue.length >= 10) {
        form.handleSubmit(onSubmit)();
      } else {
        // If not valid, trigger validation to show errors
        form.trigger('description');
      }
    }
    // When Shift+Enter is pressed, let the default behavior happen (new line)
  };

  return (
    <Card className="h-full flex flex-col"> {/* Make card a flex column */}
      <CardHeader>
        <CardTitle>WebCrafter</CardTitle> {/* Updated Card Title */}
        <CardDescription>Describe the web page or component you want to create.</CardDescription>
      </CardHeader>
      <Form {...form}>
        {/* Remove fixed height calculation, use flex-grow */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-grow">
          {/* Make CardContent grow and handle potential overflow */}
          <CardContent className="flex-grow flex flex-col">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                // Make FormItem grow
                <FormItem className="flex-grow flex flex-col">
                  <FormLabel>Component Description</FormLabel>
                  <FormControl className="flex-grow">
                    <Textarea
                      placeholder="e.g., A responsive navigation bar with a logo, three links, and a search bar"
                      className="resize-none flex-grow" // Use flex-grow for textarea height
                      {...field}
                      aria-label="Component Description Input"
                      onKeyDown={handleKeyDown} // Add onKeyDown handler
                    />
                  </FormControl>
                  <FormDescription className="pt-2"> {/* Add padding top */}
                    Be specific about the layout, content, and desired functionality.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4"> {/* Add border and padding */}
            <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Code className="mr-2 h-4 w-4" />
              )}
              Generate Code
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-accent text-accent hover:bg-accent/10 hover:text-accent" disabled={!hasGeneratedCode || isLoading}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onDownload('html')}>Download as HTML</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDownload('separate')}>Download Separate Files</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
