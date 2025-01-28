
# AT-chatbot

`AT-chatbot` is a lightweight, customizable React component for integrating a chatbot into your applications. It provides an easy-to-use interface for interacting with your backend, which includes ChatGPT integration.

## Installation

Install the package via npm:

```bash
npm install at-chatbot
```

## Usage

You can import the `Chat` component and use it in your React project as follows:

```jsx
import React from "react";
import { Chat } from "at-chatbot";

function App() {
  return (
    <div>
      <h1>Welcome to My App</h1>
      <Chat height="500px" url="https://your-backend-url.com/api/chat" />
    </div>
  );
}

export default App;
```

### Props

| Prop     | Type   | Default         | Description                                                                                   |
|----------|--------|-----------------|-----------------------------------------------------------------------------------------------|
| `height` | String | `"400px"`       | Height of the chatbot box. You can provide any valid CSS height value, e.g., `"300px"`, `"100%"`. |
| `url`    | String | `""`            | URL of the deployed backend that integrates with ChatGPT. If not provided, the chatbot won't make API calls. |

### Example with Default Props

If you don't provide any props, the chatbot will use its default height and won't connect to a backend:

```jsx
<Chat />
```

## Features

- **Customizable Dimensions**: Adjust the height of the chatbot box to fit your application's layout.
- **Backend Integration**: Easily integrate with a backend powered by ChatGPT.
- **Plug-and-Play**: Start using the chatbot with minimal setup.

## License

This project is licensed under the MIT License.
