 class productServiceDB{

    constructor(db,nameTable){
        
        this.db = db;
        this.nameTable = nameTable;
        // let tableExist;

        // this.db.schema.hasTable(this.nameTable)
        //     .then(()=> { 
        //         tableExist = true;
        //         return console.log("Tabla ya existe",tableExist)
        //     })
        //     .catch((err)=>{
        //         console.log("Catch hasTable",err)
        //     })
        //     .finally(()=>{
        //         this.db.destroy();
        //     });
        
        //     if(!tableExist){
                
        //         this.db.schema.createTable(this.nameTable, table =>{
        //                 table.increments("id").primary(),
        //                 table.string("nombre"),
        //                 table.float("precio"),
        //                 table.string("url")
        //         })
        //             .then(()=> console.log("tabla creada"))
        //             .catch((err)=>{
        //                 console.log("Catch",err)
        //             })
        //             .finally(()=>{
        //                 this.db.destroy();
        //             });
        //     }

            this.db.schema.hasTable(this.nameTable)
                .then( (exists) => {

                    if (!exists) {
                        return this.db.schema.createTable(this.nameTable, (table) => {
                            table.increments("id").primary(),
                            table.string("nombre"),
                            table.float("precio"),
                            table.string("url")
                        });
                    }

                });

    }

    async create(producto){

        try {

            let response = await this.db.from(this.nameTable).insert(producto);
            console.log(response);

            return response;
        
        } catch (error) {
            console.log("Error",error)
        }

    }

    async update(id,paramPrecio){

        try {
            
            let response = await this.db.from(this.nameTable).where("id","=",id).update({precio:paramPrecio});
            console.log(response);
            return response;
        
        } catch (error) {
            console.log(error);
        }

    }

    async getById(id){

        try {
         
            let contenido = await this.db.from(this.nameTable).select("*").where("id","=",id);
            console.table(contenido); 
            return contenido; 

        } catch (error) {
            console.log(error);
        }

    }

    async getAll(){

        try {

            let contenido = await this.db.from(this.nameTable);
            console.table(contenido);
            
            return contenido;
        
        } catch (error) {
            console.log('Error',error)
        }

    }

    async deleteById(id){

        try {
            
            let response = await this.db.from(this.nameTable).where("id","=",id).del();
            console.log(response);
            return response;

        } catch (error) {
            console.log(error);
        }

    }

    async deleteAll(){

        try {
            
            let response = await this.db.from(this.nameTable).del();
            
            return response;

        } catch (error) {
            console.log(error);
        }

    }

}

module.exports = productServiceDB;