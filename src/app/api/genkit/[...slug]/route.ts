import { defineGenkitHandler } from "@genkit-ai/next";
import '@/ai/dev'; // Ensure this imports your flow definitions

export const { GET, POST } = defineGenkitHandler();
