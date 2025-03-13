# GPT-4o Developer Assistant Chatbot

A clean, minimalist chatbot that can answer software development-related questions using OpenAI's GPT-4o model. Built with Node.js, Express.js, and vanilla JavaScript.

## Features

- 💬 Instant responses to software development questions
- 🧠 Powered by OpenAI's advanced GPT-4o model via GitHub's OpenAI SDK API
- 🔍 Specialized knowledge of programming languages, frameworks, and development tools
- 💻 Clean, responsive UI for desktop and mobile devices
- 🔒 Secure API key handling through environment variables

## Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **API**: GitHub's OpenAI SDK API with GPT-4o model

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- GitHub OpenAI API key and endpoint access

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/EvanGks/developer-assistant-chatbot-gpt4o.git
   cd developer-assistant-chatbot-gpt4o

2. Install dependencies:

    ```bash
    npm install

3. Create a .env file in the root directory based on .env.example:

    GITHUB_OPENAI_API_KEY=your_github_openai_api_key_here 
    GITHUB_OPENAI_API_ENDPOINT=https://models.inference.ai.azure.com
    PORT=3000 
    NODE_ENV=development

4. Start the server:
    ```bash
    npm start

5. Open your browser and navigate to http://localhost:3000

### Development Mode

To run the server in development mode with automatic restart on file changes:

    ```bash
    npm run dev

### Usage

Simply type your software development-related question in the input field and press Enter or click the send button. The chatbot specializes in answering questions about:

- Programming languages
- Frameworks and libraries
- Development tools
- Coding best practices
- Software architecture
- Debugging and troubleshooting

Example questions:

"What is the difference between let and const in JavaScript?"
"How do I set up a React project?"
"Explain the MVC architecture pattern"
"What are the benefits of using TypeScript?"

### Project Structure

developer-assistant-chatbot-gpt4o/
├── .env.example          # Example environment variables
├── .gitignore            # Git ignore file
├── LICENSE               # MIT License
├── README.md             # Project documentation
├── package.json          # Project dependencies and scripts
├── backend/              # Backend code
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   ├── routes/           # API routes
│   └── server.js         # Express server setup
└── frontend/             # Frontend code
    ├── css/              # Stylesheets
    ├── js/               # Client-side JavaScript
    └── index.html        # Main HTML file

### Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'Add some amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request

### License

This project is licensed under the MIT License - see the LICENSE file for details.

### Acknowledgments
- GitHub for providing the OpenAI SDK API access
- OpenAI for the GPT-4o model
- Express.js for the web framework
- Font Awesome for the icons