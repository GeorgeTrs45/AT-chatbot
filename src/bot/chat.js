import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';
import { TbRobot } from "react-icons/tb";
import { FaUserDoctor } from "react-icons/fa6";
import { BiSolidPaperPlane } from "react-icons/bi";

const Chat = ({url="http://127.0.0.1:8000/bot/conversation", height="150px"}) => {
  const [messages, setMessages] = useState([{bot:'How can I help you?', user:''}]);
  const [isFetchingMessage, setIsFetchingMessage] = useState(false);
  const [input, setInput] = useState('');
  const [question, setQuestion] = useState("");
  const selectedModel='gpt-4';
  const messagesEndRef = useRef(null);

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

  const handleSendMessage = async (query = input) => {
    if (query.length > 0 && query.length <= 500) {
      await fetchAndUpdateMessages(url, query);
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
        <div className="App">
          <div className="chat-container">

            <div className="chat-box"> 
              <div className='top-hero'>
                <div className='flex-row'>
                  <img src="../logo.svg" className="App-logo" alt="logo" />
                  <h1 className="App-title">Abelmed Assistant</h1>
                </div>
                <div className="quick-reply-container">
                  {quickReplies.map((reply, index) => (
                    <div
                      key={index}
                      className="quick-reply"
                      onClick={() => setQuestion(reply)}
                    >
                      {reply}
                    </div>
                  ))}
                </div>
              </div>
              <div className="chat-messages-container" style={{height: `${height}`}}>
                <div className="chat-messages">
                  {messages.map((msg, index) => (
                    <div key={index} className="chat-message">
                      {index===0 ? null: 
                        <div className='flex-user'>
                          <div className='round-border'>
                            <FaUserDoctor size={"20px"}/>
                          </div>
                          <div className='user-response-block'>
                            <p className='text-end'><strong>User</strong></p>
                            <p className='user-response'>{msg.user}</p>
                          </div>

                        </div>
                      }
                      {isFetchingMessage && index === messages.length-1 ? <div className="loading-dots"></div> : null}
                      <div className='flex-bot'>
                          <div className='round-border'>
                            <TbRobot size={"25px"}/>
                          </div>
                          <div className='bot-response-block'>
                            <p><strong>Medi</strong></p>
                            <div className="bot-response" dangerouslySetInnerHTML={{ __html: msg.bot }} />
                          </div>
                        </div>
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
                  placeholder="Compose your message..."
                  // style={{ width:"300px"}}
                />
                <button
                  onClick={() => handleSendMessage()}
                  className="chat-button"
                  disabled={input.length === 0 || input.length > 500}
                >
                  <BiSolidPaperPlane size={"20px"}/>
                </button>
              </div>
            </div>
          </div>
        </div>
  );
};

export default Chat;
