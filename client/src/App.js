import './normal.css';
import './App.css';
import { useState, useEffect } from 'react';
import SideMenu from './SideMenu'
import ChatBox from './ChatBox'

function App() {

  useEffect(() => {
    getEngines();
  }, [])

  const [chatInput, setChatInput] = useState("");
  const [models, setModels] = useState([]);
  const [temperature, setTemperature] = useState(0.5);
  const [currentModel, setCurrentModel] = useState("text-davinci-003");
  const [chatLog, setChatLog] = useState([{
    user: "gpt",
    message: "How can I help you today?"
  }]);

  // clear chats
  function clearChat(){
    setChatLog([]);
  }

  function getEngines(){
    fetch("https://api.openai.com/v1/models")
    .then(res => res.json())
    .then(data => {
      console.log(data.models.data)
      // set models in order alpahbetically
      data.models.data.sort((a, b) => {
        if(a.id < b.id) { return -1; }
        if(a.id > b.id) { return 1; }
        return 0;
      })
      setModels(data.models.data)
    })
  }
  
  async function handleSubmit(e){
    e.preventDefault();
    let chatLogNew = [...chatLog, { user: "me", message: `${chatInput}`} ]
    setChatInput("");
    setChatLog(chatLogNew)

    const messages = chatLogNew.map((message) => message.message).join("\n")
    
    const response = await fetch("https://nightm4r.onrender.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: messages,
        currentModel,
       })
      });
    const data = await response.json();
    setChatLog([...chatLogNew, { user: "gpt", message: `${data.message}`} ])
    var scrollToTheBottomChatLog = document.getElementsByClassName("chat-log")[0];
    scrollToTheBottomChatLog.scrollTop = scrollToTheBottomChatLog.scrollHeight;
  }

  function handleTemp(temp) {
    if(temp > 1){
      setTemperature(1)
    } else if (temp < 0){
      setTemperature(0)
    } else {
      setTemperature(temp)
    }

  }

  return (
    <div className="App">
      <SideMenu
        currentModel={currentModel} 
        setCurrentModel={setCurrentModel} 
        models={models}
        setTemperature={handleTemp}
        temperature={temperature}
        clearChat={clearChat}
      />
      <ChatBox 
        chatInput={chatInput}
        chatLog={chatLog} 
        setChatInput={setChatInput} 
        handleSubmit={handleSubmit} />
    </div>
  );
}


export default App;
