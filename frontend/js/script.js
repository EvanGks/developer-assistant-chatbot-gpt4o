// frontend/js/script.js
document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const chatForm = document.getElementById('chat-form');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');

    // Function to create a new message element
    function createMessageElement(isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageDiv.appendChild(messageContent);
        
        chatBox.appendChild(messageDiv);
        
        // Scroll to the bottom of the chat
        chatBox.scrollTop = chatBox.scrollHeight;
        
        return { messageDiv, messageContent };
    }

    // Function to append content to a message element
    function appendToMessage(messageContent, text) {
        let formattedText = text;
        
        // Handle complete code blocks
        const combinedText = messageContent.innerHTML + formattedText;
        
        // Check for complete code blocks
        if (combinedText.match(/```[\s\S]+?```/g)) {
            const updatedText = combinedText.replace(/```([\s\S]+?)```/g, '<pre><code>$1</code></pre>');
            messageContent.innerHTML = updatedText;
            return;
        }
        
        // Check for complete inline code
        if (combinedText.match(/`[^`]+`/g)) {
            const updatedText = combinedText.replace(/`([^`]+)`/g, '<code>$1</code>');
            messageContent.innerHTML = updatedText;
            return;
        }
        
        // If no complete formatting, just append the text
        messageContent.innerHTML += formattedText;
        
        // Scroll to the bottom of the chat
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Function to append a complete message 
    function appendMessage(content, isUser = false) {
        const { messageContent } = createMessageElement(isUser);
        
        // Handle markdown-like formatting for code
        let formattedContent = content;
        
        // Replace code blocks with proper HTML
        formattedContent = formattedContent.replace(/```([\s\S]+?)```/g, '<pre><code>$1</code></pre>');
        
        // Replace inline code with proper HTML
        formattedContent = formattedContent.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        messageContent.innerHTML = formattedContent;
        
        // Scroll to the bottom of the chat
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Function to process the form submission with streaming
    async function handleSubmit(e) {
        e.preventDefault();
        
        const message = messageInput.value.trim();
        if (!message) return;
        
        // Disable input and button while processing
        messageInput.disabled = true;
        sendButton.disabled = true;
        
        // Display user message
        appendMessage(message, true);
        
        // Clear input field
        messageInput.value = '';
        
        // Create bot message element for streaming response
        const { messageContent } = createMessageElement(false);
        
        try {
            // Use fetch to initiate streaming
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });
            
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
            
            // Process the stream
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            
            while (true) {
                const { value, done } = await reader.read();
                
                if (done) break;
                
                // Decode the chunk and add to buffer
                buffer += decoder.decode(value, { stream: true });
                
                // Process complete SSE messages
                const lines = buffer.split('\n\n');
                buffer = lines.pop() || ''; // Keep the incomplete chunk
                
                for (const line of lines) {
                    if (!line.startsWith('data: ')) continue;
                    
                    const data = line.slice(6); // Remove 'data: ' prefix
                    
                    if (data === '[DONE]') continue;
                    
                    try {
                        const parsed = JSON.parse(data);
                        
                        if (parsed.content) {
                            // Append the content
                            appendToMessage(messageContent, parsed.content);
                        }
                        
                        if (parsed.error) {
                            throw new Error(parsed.error);
                        }
                    } catch (err) {
                        console.error('Error parsing chunk:', err);
                    }
                }
            }
        } catch (error) {
            console.error('Streaming error:', error);
            
            // If no content was added yet, show error message
            if (!messageContent.textContent.trim()) {
                messageContent.innerHTML = 'Sorry, I encountered an error while processing your request. Please try again later.';
            }
        } finally {
            // Re-enable input and button
            messageInput.disabled = false;
            sendButton.disabled = false;
            messageInput.focus();
        }
    }

    // Event listeners
    chatForm.addEventListener('submit', handleSubmit);
    
    // Focus input on page load
    messageInput.focus();
});