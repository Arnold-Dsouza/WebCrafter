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
  // Pre-process the input to emphasize color requirements
  const enhancedInput = {
    description: enhanceColorDescription(input.description)
  };
  
  return generateCodeFlow(enhancedInput);
}

// Helper function to enhance color-related descriptions
function enhanceColorDescription(description: string): string {
  // Detect common color mentions in the description
  const colorKeywords = [
    { color: "purple", hex: "#800080" },
    { color: "blue", hex: "#0000FF" },
    { color: "red", hex: "#FF0000" },
    { color: "green", hex: "#008000" },
    { color: "yellow", hex: "#FFFF00" },
    { color: "orange", hex: "#FFA500" },
    { color: "black", hex: "#000000" },
    { color: "white", hex: "#FFFFFF" },
    { color: "gray", hex: "#808080" },
    { color: "pink", hex: "#FFC0CB" }
  ];
  
  let enhancedDesc = description;
  
  // Check if any color keywords are present and enhance the description
  colorKeywords.forEach(({ color, hex }) => {
    if (description.toLowerCase().includes(color)) {
      enhancedDesc += ` (Please ensure to use proper CSS color values for ${color} such as "${color}" or "${hex}" and apply it correctly to the specified elements)`;
    }
  });
  
  return enhancedDesc;
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
  // Enhanced prompt with stronger color handling instructions
  prompt: `You are a web development expert specializing in modern, clean design. Generate HTML, CSS, and JavaScript code based on the user's description. Return the code snippets in separate fields.

Description: {{{description}}}

IMPORTANT COLOR GUIDELINES:
When the user specifies colors (like purple, blue, red, etc.), ALWAYS use proper CSS color names or hex codes:
- purple: #800080 or purple
- blue: #0000ff or blue
- red: #ff0000 or red
- green: #008000 or green
- yellow: #ffff00 or yellow
- orange: #ffa500 or orange

ENSURE that colors are applied correctly and visibly in the CSS. For example, if asked for a "purple button":
- Use button { background-color: purple; } or button { background-color: #800080; }
- Make sure text has sufficient contrast (e.g., white text on dark buttons)
- Apply the color to the correct element as specified in the description

Ensure HTML is semantic and well-structured.
If no specific colors are requested, style the CSS using:
- Primary color: Slate gray (#334155)
- Secondary color: Light gray (#cbd5e1)
- Accent color: Teal (#2dd4bf)

Always use a clean, modern sans-serif font stack.
The JavaScript should enhance functionality if described, otherwise keep it minimal.

Do not include code section comments.
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
