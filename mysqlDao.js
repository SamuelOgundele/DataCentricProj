var pmysql = require('promise-mysql');
var pool;


pmysql.createPool({

    connectionLimit :1,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'proj2024mysql'

})
.then((p)=> {
    pool = p;
})

.catch(e => {
    console.log("pool error" + e)
})