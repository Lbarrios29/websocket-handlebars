 class MensajesChatServiceDB{

    constructor(db,nameTable){

        this.db = db;
        this.nameTable = nameTable;
        
        this.db.schema.hasTable(this.nameTable)
            .then( (exists) => {

                if (!exists) {
                    return this.db.schema.createTable(this.nameTable, (table) => {
                        table.increments("id").primary(),
                        table.string("email"),
                        table.string("mensaje"),
                        table.dateTime("date")
                    });
                }

            });    

    }

    async create(mensaje){

        try {

            let response = await this.db.from(this.nameTable).insert(mensaje);
            console.log(response);

            return response;            
        
        } catch (error) {
            console.log("Error",error)
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

}

module.exports = MensajesChatServiceDB;