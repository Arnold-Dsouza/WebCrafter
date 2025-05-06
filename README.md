# WebCrafter 
## Version 0.0.1

WebCrafter is an AI-powered web development tool that generates HTML, CSS, and JavaScript code from natural language descriptions. Perfect for quickly prototyping web components or learning web development.

## Features

- **AI-Powered Code Generation**: Transform natural language descriptions into functional web code
- **Multi-Language Output**: Generate HTML, CSS, and JavaScript simultaneously
- **Instant Preview**: See your generated code in action immediately
- **Download Options**: Export as a single HTML file or separate HTML/CSS/JS files
- **Dark/Light Theme**: Comfortable viewing experience in any environment
- **Mobile Responsive**: Works on devices of all sizes

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (v15)
- **UI Components**: Custom components built with [Radix UI](https://www.radix-ui.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [tailwind-merge](https://github.com/dcastil/tailwind-merge)
- **AI**: [GenKit](https://genkit.ai/) for AI model integration
- **State Management**: React Query (Tanstack)
- **Authentication**: Firebase

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/WebCrafter.git
   cd WebCrafter
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the required API keys (see `.env.example` for reference).

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:9002](http://localhost:9002) with your browser to see the application.

## Usage

1. Enter a description of the web component you want to create in the input field
2. Click "Generate Code" and wait for the AI to process your request
3. View the generated HTML, CSS, and JavaScript code in the code display panel
4. Use the preview tab to see how your component looks and functions
5. Download the code as a single HTML file or as separate HTML, CSS, and JS files

## Development

### Available Scripts

- `npm run dev` - Start the development server with Turbopack

### Version History

- **v0.0.1** - Initial release
  - Basic AI code generation
  - Preview functionality
  - Download options
  - Dark/Light theme toggle

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## Acknowledgments

- Built with ❤️ by Arnold
- Inspired by the need for rapid web component prototyping
- Thanks to the Next.js and React communities for the amazing tools
