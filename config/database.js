let {db} = require("./index");
let knex = require("knex");
let path = require("path");

var mysql = knex({
    client: 'mysql',
    connection: {
        ...db
    },
    pool: { min: 0, max: 7 }
  });

var sqlite3 = knex({
    client: 'sqlite3',
    connection: {
        filename: "./mydb.sqlite"
    },
    pool: { min: 0, max: 7 }
});

  class sqlite3Database {
      static client;
      constructor(){
          if(sqlite3Database.client){
              return sqlite3Database.client;
          }
          sqlite3Database.client = sqlite3;
          this.client = sqlite3Database.client;
      }
  }

  class mysqlDatabase {
      static client;
      constructor(){
          if(mysqlDatabase.client){
              return mysqlDatabase.client;
          }
          mysqlDatabase.client = mysql;
          this.client = mysqlDatabase.client;
      }
  }

module.exports = { sqlite3DB: new sqlite3Database().client, mysqlDB:new mysqlDatabase().client };


