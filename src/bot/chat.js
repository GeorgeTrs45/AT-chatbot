import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';

const Chat = ({
  width="800px",
  height="500px",
  question
}) => {
  const [messages, setMessages] = useState([]);
  const [isFetchingMessage, setIsFetchingMessage] = useState(false);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const messagesEndRef = useRef(null);

  // Array of predefined questions
  const quickReplies = [
    "How could you help me?",
    "Provide some healthcare service details",
    "How can I book an appointment?"
  ];

  useEffect(()=>{
    if(question){
      handleSendMessage(question)
    }  
  }, [question])

  const fetchAndUpdateMessages = async (apiUrl, query) => {
    setIsFetchingMessage(true)
    const newMessages = [...messages, { user: query, bot: '' }];
    setMessages(newMessages);
    const lastThree = getLastThreeElements(messages);
    try {
      setInput("")
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_query: query , lastThree}),
      });

      if (!response.body) {
        throw new Error('ReadableStream not yet supported in this browser.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      let botResponse = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setIsFetchingMessage(false)
        botResponse += decoder.decode(value);
        const filteredResponse = botResponse
          .split('\n')
          .map(line => line.replace(/[\*#"]/g, ''))
          .join('\n');
        const updatedMessages = newMessages.slice(0, -1);
        updatedMessages.push({ user: query, bot: filteredResponse });
        setMessages(updatedMessages);
      }
    } catch (error) {
      console.error('API communication failed:', error);
    } finally {
      setIsFetchingMessage(false)
    }

  };

  const handleSendMessage = async (query = input, model = selectedModel) => {
    if (query.length > 0 && query.length <= 300) {
      const apiUrl = model === 'gpt-3.5-turbo'
        ? 'http://0.0.0.0:8001/bot/conversation'
        : 'http://127.0.0.1:8000/bot/conversation';
      await fetchAndUpdateMessages(apiUrl, query);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function getLastThreeElements(arr) {
    // Check if the length of the array is 3 or more
    if (arr.length >= 3) {
      return arr.slice(-3); // Returns a new array with the last three elements
    }
    return arr; // Return the complete array if it's shorter than 3
  }

  return (
    <div className="">
      {/* <div className="quick-reply-container">
        {quickReplies.map((reply, index) => (
          <div key={index} className="quick-reply" onClick={() => handleSendMessage(reply, 'gpt-4')}>
            {reply}
          </div>
        ))}
      </div> */}

      <div className="chat-box" style={{ width, height }}>
        <div className="chat-header">Chat Assistant</div>
        <div className="chat-messages-container">
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className="chat-message">
                <p><strong>User:</strong> {msg.user}</p>
                <p><strong>Bot:</strong></p>  {isFetchingMessage && index == messages.length-1 ? <div class="loading-dots">
                  <div></div>
                  <div></div>
                  <div></div>
                </div> : null}
                <div className="bot-response" dangerouslySetInnerHTML={{ __html: msg.bot }} />
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>
        </div>
        <div className="chat-input-container">
          <input
            type="text"
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type message"
            // style={{ width:"300px"}}
          />
          <button
            onClick={() => handleSendMessage()}
            className="chat-button"
            disabled={input.length === 0 || input.length > 300}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
