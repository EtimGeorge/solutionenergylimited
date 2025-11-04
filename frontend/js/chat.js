document.addEventListener('DOMContentLoaded', () => {
    const chatFab = document.getElementById('chat-fab');
    const chatWidget = document.getElementById('chat-widget');
    const closeBtn = document.getElementById('chat-close-btn');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    // Use the config for the backend URL
    const API_URL = window.BACKEND_URL || 'http://localhost:3000';

    // --- Event Listeners ---
    chatFab.addEventListener('click', () => toggleChatWidget(true));
    closeBtn.addEventListener('click', () => toggleChatWidget(false));
    chatForm.addEventListener('submit', handleFormSubmit);

    // --- Functions ---

    function toggleChatWidget(open) {
        if (open) {
            chatWidget.classList.add('open');
            chatFab.style.display = 'none';
        } else {
            chatWidget.classList.remove('open');
            chatFab.style.display = 'flex';
        }
    }

    function addMessage(text, type) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', type);

        if (type === 'bot') {
            const senderName = document.createElement('div');
            senderName.classList.add('sender-name');
            senderName.textContent = 'Raymond';
            messageElement.appendChild(senderName);
        }
        
        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        // Use marked.parse for bot messages to render Markdown
        messageContent.innerHTML = (type === 'bot') ? marked.parse(text) : text;
        messageElement.appendChild(messageContent);

        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll
        return messageElement;
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        const userQuery = chatInput.value.trim();
        if (!userQuery) return;

        addMessage(userQuery, 'user');
        chatInput.value = '';

        const typingIndicator = addMessage('Raymond is typing...', 'bot');

        try {
            const response = await fetch(`${API_URL}/api/v1/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_query: userQuery }),
            });

            // Remove typing indicator
            typingIndicator.remove();

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'The AI assistant is currently unavailable.');
            }

            const data = await response.json();
            addMessage(data.answer, 'bot');

        } catch (error) {
            console.error('Chat API Error:', error);
            // Ensure typing indicator is removed on error
            if(typingIndicator.parentNode) {
                typingIndicator.remove();
            }
            addMessage(`Sorry, I encountered an error: ${error.message}`, 'bot');
        }
    }
});
