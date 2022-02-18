 class mensajesChat{

    constructor(fs,path){
        this.fs = fs;
        this.filePath = path;
    }

    async save(object){

        try {

            let contenido = [];
            let productId;

            const fileExists = await this.checkFileExists(this.filePath);

            // Verifica si existe el archivo
            if (fileExists) {    

                contenido = await this.getAll();

                if (contenido.length > 0) {
                    // Busca el maximo Id para agregarle 1
                    let id = Math.max.apply(Math, contenido.map(obj => obj.id));
                    object.id = id + 1;                    
                }
                else{
                    // No tiene contenido por eso inicializa en 1
                    object.id= 1;
                }

            
            }
            else{
            
                // Si no existe archivo agrega el id en 1
                object.id= 1;
            
            }

            productId = object.id;
            contenido.push(object);

            await this.fs.promises.writeFile(this.filePath,JSON.stringify(contenido, null, 2));
            return productId;
        
        } catch (error) {
            console.log("Error",error)
        }

    }

    async getAll(){

        try {

            let contenido=[];
            let contDefault = '[{"email":"Servidor","usuario":"Servidor","mensaje":"Bienvenido al chat","date":""}]'
            const fileExists = await this.checkFileExists(this.filePath);
            
            // Si no existe el archivo agrega contenido
            if (!fileExists) {
                this.fs.promises.writeFile(this.filePath,JSON.stringify(contDefault, null, 2));
            }

            const response = await this.fs.promises.readFile(this.filePath,'utf-8');
            if (response) {
                contenido = JSON.parse(response);  
            }
            
            return contenido;
        
        } catch (error) {
            console.log('Error al leer el archivo',error)
        }

    }

    async checkFileExists(path){
        
        try {
    
            const fileExist = await this.fs.existsSync(path); 

            if (fileExist) {
                return true;
            }
            return false;

        }     
        catch (error) {
            console.log(error);
        }
    }

}

module.exports = mensajesChat;