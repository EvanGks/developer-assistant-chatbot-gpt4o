const OpenAI = require('openai');
const config = require('../config/config');

// Initialize OpenAI client with GitHub's endpoint
const openai = new OpenAI({
  apiKey: config.githubOpenaiApiKey,
  baseURL: config.githubOpenaiApiEndpoint
});

/**
 * Process chat messages and stream responses from GPT-4o via GitHub's OpenAI SDK API
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.streamChat = async (req, res, next) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({
        status: 'error',
        message: 'Message is required'
      });
    }

    // Set headers for Server-Sent Events
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    // Create a system message to guide the model's behavior
    const systemMessage = {
      role: "system",
      content: "You are a helpful AI assistant specializing in software development topics. Provide clear, concise, and accurate information about programming languages, frameworks, tools, and best practices. Your responses should be informative and educational."
    };

    // Call GitHub's OpenAI SDK API with streaming enabled
    const stream = await openai.chat.completions.create({
      model: "gpt-4o", // Using GPT-4o model
      messages: [
        systemMessage,
        { role: "user", content: message }
      ],
      max_tokens: 1000,
      temperature: 0.7,
      stream: true, // Enable streaming
    });

    // Stream the response chunks to the client
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      
      if (content) {
        // Send each chunk as an SSE event
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    // Signal the end of the stream
    res.write('data: [DONE]\n\n');
    res.end();
    
  } catch (error) {
    console.error('Error streaming chat:', error);
    
    // For streaming, we need to send errors as SSE events
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
      res.end();
    } else {
      // Handle OpenAI API specific errors
      if (error instanceof OpenAI.APIError) {
        return res.status(error.status || 500).json({
          status: 'error',
          message: 'Error communicating with GitHub OpenAI API',
          error: error.message
        });
      }
      
      next(error);
    }
  }
};