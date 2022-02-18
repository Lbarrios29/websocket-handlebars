
            let socket = new io();
            let formProductos = document.getElementById("form-productos");
            let listadoProductos = document.getElementById("listado");
            let mensajesChat = document.getElementById("mensajes");
            let noProducts = document.getElementById("noProducts");
            let tabla = document.getElementById("tabla");

            // Escucha el evento submit del formulario y emite los datos en el canal from_front
            formProductos.addEventListener("submit", e => {

                e.preventDefault();

                let producto = {
                    nombre: e.target[0].value,
                    precio: e.target[1].value,
                    url: e.target[2].value
                }
                
                e.target[0].value ="";
                e.target[1].value ="";
                e.target[2].value="";

                if(producto.nombre == ""|| producto.precio == ""|| producto.url == ""){
                    window.location.reload();
                }
                socket.emit("from_front", producto);
            
            });
            
            // Escucha el canal fill_list y dibuja la tabla con los productos
            // sino existen productos muestra un mensaje
            socket.on("fill_list", productos => {

                let productosHtml =` `;
                
                if(productos.length > 0){
                    
                    for(const producto of productos){
                        productosHtml += `<tr>
                                            <td>${producto.nombre}</td>
                                            <td>${producto.precio}</td> 
                                            <td><img class="" width="50px"  src=${producto.url}></td>
                                          </tr>
                                         `;
                    }
                    listadoProductos.innerHTML = productosHtml;
                    tabla.style.visibility = "visible";
                    noProducts.style.visibility = "hidden";
                }    
                else{
                        tabla.style.visibility = "hidden";
                        noProducts.style.visibility = "visible";
                }
            
            });

            let form_chat = document.getElementById("chat_data");
            let inputEmail = document.getElementById("email");

            // Escucha el evento submit al enviar un mensaje en el chat
            form_chat.addEventListener("submit", e => {

                e.preventDefault();
                
                let chat = {
                    email: e.target[0].value,
                    mensaje: e.target[1].value,
                }
                
                e.target[1].value = "";
                inputEmail.disabled = true;

                // Emite el mensaje al chat
                socket.emit("chat_message",chat);

            });

            // Escucha el canal chat_message y muestra el mensaje del usuario
            socket.on("chat_message", data => {
                    
                let mensajes_html = ` `;
                for(const mensaje of data){
                    mensajes_html += `<p><span class="fw-bold text-primary">${mensaje.email}</span>
                                            <span class="text-danger fs-6">[${mensaje.date}]</span>: 
                                            <i class="text-success fs-6">${mensaje.mensaje}</i>
                                        </p>`;
                }
                mensajes.innerHTML = mensajes_html;
                
            });
