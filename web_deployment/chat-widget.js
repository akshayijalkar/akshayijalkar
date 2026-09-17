(() => {
  const style = document.createElement('style');
  style.textContent = `
    #chat-button{position:fixed;right:25px;bottom:25px;background:#111827;color:#fff;border:0;border-radius:25px;padding:13px 20px;font-size:15px;cursor:pointer;z-index:1001}
    #chat-window{display:none;position:fixed;right:25px;bottom:85px;width:350px;height:450px;background:#fff;border-radius:10px;box-shadow:0 5px 25px rgba(0,0,0,.25);overflow:hidden;z-index:1000;font-family:Arial,sans-serif;color:#222}
    #chat-header{background:#111827;color:#fff;padding:15px;display:flex;justify-content:space-between;align-items:center}
    #chat-header button{background:none;border:0;color:#fff;font-size:20px;cursor:pointer}
    #chat-messages{height:320px;padding:15px;overflow-y:auto;font-size:14px;line-height:1.5}
    #chat-input-area{display:flex;padding:10px;border-top:1px solid #ddd}
    #chat-input{flex:1;padding:9px;border:1px solid #ccc;border-radius:5px;min-width:0}
    #chat-input-area button{margin-left:7px;background:#111827;color:#fff;border:0;border-radius:5px;padding:8px 12px;cursor:pointer}
    .user-message,.ai-message{margin:8px 0}
    @media(max-width:480px){#chat-window{right:10px;bottom:75px;width:calc(100% - 20px);height:440px}#chat-button{right:15px;bottom:15px}}
  `;
  document.head.appendChild(style);

  const button = document.createElement('button');
  button.id = 'chat-button';
  button.textContent = 'Ask AI';

  const chat = document.createElement('div');
  chat.id = 'chat-window';
  chat.innerHTML = `
    <div id="chat-header">Ask about Akshay's work <button id="chat-close" aria-label="Close chat">×</button></div>
    <div id="chat-messages"><p><strong>AI:</strong> Hi! Ask me about Akshay's research interests, projects, academic work, or technical interests.</p></div>
    <div id="chat-input-area"><input id="chat-input" type="text" placeholder="Ask a question..." aria-label="Ask a question"><button id="chat-send">Send</button></div>`;

  document.body.append(button, chat);

  const input = chat.querySelector('#chat-input');
  const messages = chat.querySelector('#chat-messages');
  const toggle = () => { chat.style.display = chat.style.display === 'block' ? 'none' : 'block'; if (chat.style.display === 'block') input.focus(); };
  button.addEventListener('click', toggle);
  chat.querySelector('#chat-close').addEventListener('click', toggle);

  async function sendMessage(){
    const message = input.value.trim();
    if(!message) return;
    const user = document.createElement('div'); user.className='user-message'; user.textContent='You: '+message; messages.appendChild(user);
    input.value='';
    const ai = document.createElement('div'); ai.className='ai-message'; ai.textContent='AI: Thinking...'; messages.appendChild(ai); messages.scrollTop=messages.scrollHeight;
    try{
      const response = await fetch('https://akshay-portfolio-ai.vercel.app/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message})});
      const data = await response.json();
      if(!response.ok) throw new Error(data.details || data.error || 'Request failed');
      ai.textContent='AI: '+data.answer;
    }catch(error){ console.error(error); ai.textContent="AI: Sorry, I couldn't process your request."; }
    messages.scrollTop=messages.scrollHeight;
  }
  chat.querySelector('#chat-send').addEventListener('click',sendMessage);
  input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();sendMessage();}});
})();
