const express = require(`express`),
      serve = express(),
      port = 3001;

serve.get('/chat',function(req,resp){
    resp.send(`Hola Mundo`);
});

serve.get('/usuarios', function(req,resp){
   resp.send('Bienvenidos al sitio de chats');
});

serve.listen(port,function(event){
console.log(`Server running on port $(port)`);
});