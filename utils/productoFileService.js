 class productoFileService{

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

    async getById(id){

        try {
         
            const contenido = await this.getAll();
            const element = contenido.find( obj => obj.id === id);

            if (element) {
                return element;
            }
            return null;            

        } catch (error) {
            console.log(error);
        }

    }

    async getAll(){

        try {

            let contenido=[];
            const response = await this.fs.promises.readFile(this.filePath,'utf-8');
            if (response) {
                contenido = JSON.parse(response);
            }
            
            return contenido;
        
        } catch (error) {
            console.log('Error al leer el archivo',error)
        }

    }

    async deleteById(id){

        try {
            
            const contenido = await this.getAll();
            const index = contenido.findIndex( obj => obj.id === id );

            if (index >= 0) {
                contenido.splice(index, 1);
                await this.fs.promises.writeFile(this.filePath,JSON.stringify(contenido, null, 2));
                return true;

            }
            else{
                return false;
            }

        } catch (error) {
            console.log(error);
        }

    }

    async deleteAll(){

        try {
            
            const arrayEmpty=[];
            await this.fs.promises.writeFile(this.filePath,JSON.stringify(arrayEmpty, null, 2));
        } catch (error) {
            console.log(error);
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

module.exports = productoFileService;