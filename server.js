const express = require('express');
const moment = require('moment');
const fs = require('fs');
const productoFileService = require("./utils/productoFileService");
const mensajesChat = require("./utils/mensajesChat");
const app = express();
const hbs = require('express-handlebars'); 
let {Server: HttpServer} = require("http");
let {Server: SocketIO} = require("socket.io");
const { config } = require("./config");
const PORT = config.port;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let http = new HttpServer(app);
let socketIO = new SocketIO(http);
let productos = [];
let mensajes = [];

app.engine("handlebars", hbs.engine());
app.set("views", "./views/hbs");
app.set('view engine', 'handlebars');

socketIO.on('connection', async(socket) => {

  try {
    
    console.log('Nueva conexion');
    const productoFile = new productoFileService(fs,'./productos.txt');
    const msjChat = new mensajesChat(fs,'./mensajes.txt');

    // Obtiene los productos
    productos = await productoFile.getAll();
    // productos = JSON.parse(productos);

    // Emite en canal fill_list
    socket.emit('fill_list', productos);
    
    // Escucha canal from_front 
    socket.on('from_front', async(data) => {
      
      try {
        
        productos.push(data);
        await productoFile.save(data);

        // Emite en canal fill_list
        socketIO.sockets.emit('fill_list', productos);
      
      } catch (error) {
        console.log("catch",error)
      }
    
    });

    // Obtiene los mensajes
    mensajes = await msjChat.getAll();

    // Emite en canal chat_message
    socket.emit('chat_message', mensajes);
    
    // Escucha en canal chat_message
    socket.on('chat_message', (data) => {

      let aux = {...data, id:socket.id, date: moment().format("HH:mm DD-MM-YYYY") };
      mensajes.push(aux);
      msjChat.save(aux);
      socketIO.sockets.emit('chat_message', mensajes);

    });

  } catch (error) {
      console.log("catch",error);
  }

});

app.get('/', (req, res, next) =>  {
  res.render('index')
});

app.use((err, req, res, next) => {
    res.status(500).json({ error: err.message });
});
app.use((req, res, next) => {
    res.status(404).json({ error: '404 - not found' });
});
app.use((err, req, res, next) => {
    res.status(401).json({ error: '401 - not authorized' });
});
app.use((err, req, res, next) => {
    res.status(403).json({ error: '403 - forbidden' });
});

http.listen(PORT, err =>{
    console.log(`Server on http://localhost:${PORT}`);
})

