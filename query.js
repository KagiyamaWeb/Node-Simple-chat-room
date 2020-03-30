const mysql = require('mysql')
let config = require('./config.js')

let connection = mysql.createConnection(config)


// connect to the MySQL server
connection.connect(function(err) {
    if (err) {
      return console.error('Error connecting to the database: ' + err.message);
    }
    console.log('Succsessfuly connected to MySQL server...')

    let createLog = `create table if not exists logs(
                          id int primary key auto_increment,
                          username varchar(255)not null,
                          message varchar(255)not null
                      )`;
    
    connection.query(createLog, function(err, results, fields) {
      if (err) {
        console.log(err.message);
      }
    });
   
    connection.end(function(err) {
      if (err) {
        return console.log(err.message);
      }
    });
  });