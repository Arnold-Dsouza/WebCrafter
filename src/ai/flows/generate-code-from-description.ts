'use server';

/**
 * @fileOverview Generates HTML, CSS, and JavaScript code snippets based on a user's description.
 *
 * - generateCode - A function that handles the code generation process.
 * - GenerateCodeInput - The input type for the generateCode function.
 * - GenerateCodeOutput - The return type for the generateCode function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateCodeInputSchema = z.object({
  description: z
    .string()
    .describe('A description of the web page or component to generate code for.'),
});
export type GenerateCodeInput = z.infer<typeof GenerateCodeInputSchema>;

const GenerateCodeOutputSchema = z.object({
  html: z.string().describe('The generated HTML code.'),
  css: z.string().describe('The generated CSS code.'),
  javascript: z.string().describe('The generated JavaScript code.'),
});
export type GenerateCodeOutput = z.infer<typeof GenerateCodeOutputSchema>;

export async function generateCode(input: GenerateCodeInput): Promise<GenerateCodeOutput> {
  return generateCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCodePrompt',
  input: {
    schema: z.object({
      description: z
        .string()
        .describe('A description of the web page or component to generate code for.'),
    }),
  },
  output: {
    schema: z.object({
      html: z.string().describe('The generated HTML code.'),
      css: z.string().describe('The generated CSS code.'),
      javascript: z.string().describe('The generated JavaScript code.'),
    }),
  },
  // Updated prompt with specific styling instructions
  prompt: `You are a web development expert specializing in modern, clean design. Generate HTML, CSS, and JavaScript code based on the user's description. Return the code snippets in separate fields.

Description: {{{description}}}

Ensure the HTML is semantic and well-structured.
Style the CSS for a professional look using:
- Primary color: Slate gray (#334155) - Use for main elements, text, headers.
- Secondary color: Light gray (#cbd5e1) - Use for backgrounds, borders, subtle dividers.
- Accent color: Teal (#2dd4bf) - Use for buttons, links, interactive elements, highlights.
- Font: Use a clean, modern sans-serif font stack (e.g., system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif). Define this in the body or html selector.
Make sure the generated CSS adheres strictly to these color and font guidelines.
The JavaScript should enhance functionality if described, otherwise keep it minimal or empty if not needed.
Do not include comments like /* CSS code */ inside the CSS block.
Do not include comments like <!-- HTML code --> inside the HTML block.
Do not include comments like // JavaScript code inside the JavaScript block.
Return ONLY the raw code for each section.
`,
});

const generateCodeFlow = ai.defineFlow<
  typeof GenerateCodeInputSchema,
  typeof GenerateCodeOutputSchema
>(
  {
    name: 'generateCodeFlow',
    inputSchema: GenerateCodeInputSchema,
    outputSchema: GenerateCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    // Ensure output is not null and return, or provide default empty strings
    return output ?? { html: '', css: '', javascript: ''};
  }
);
