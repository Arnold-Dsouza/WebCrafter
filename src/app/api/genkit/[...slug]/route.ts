import { NextRequest, NextResponse } from 'next/server';
import '@/ai/dev'; // Import flow definitions

// Instead of using defineGenkitHandler directly, let's implement 
// a simple handler that forwards requests to our AI flow
export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();
    
    // Import the generateCode function dynamically to avoid circular dependencies
    const { generateCode } = await import('@/ai/flows/generate-code-from-description');
    
    // Call our AI function with the input from the request body
    const result = await generateCode(body);
    
    // Return the result as JSON
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

// Also implement GET for completeness, though it's likely not used
export async function GET(req: NextRequest) {
  return NextResponse.json({ message: 'GenKit API is ready. Use POST requests to generate code.' });
}
