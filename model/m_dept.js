const mysql     = require ('mysql2')

// sambungkan ke mysql
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'jfd_belajar_database',
})

// menyambungkan atau membuka koneksi
db.connect( (error) => {
    if (error) {
        throw error
    } else {
        console.log('berhasil tersambung ke mysql')
    }
})

module.exports =
{
    getAll_departemen: function() {
        return new Promise( (resolve, reject) => {
            let sqlSyntax = 
            `SELECT * FROM departemen`
            db.query(sqlSyntax, function(errorSql, hasil) {
                if (errorSql) {
                    reject(errorSql)
                } else {
                    resolve(hasil)
                }
            })
        })
    }
}