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
    getOne_karyawan: function ( id ) {
        return new Promise( (resolve, reject) => {
            let sqlSyntax = 
            `SELECT
                karyawan.*, 
                departemen.kode, departemen.nama AS nama_dept, 
                agama.nama AS nama_agama
            FROM karyawan
            LEFT JOIN departemen ON departemen.id = karyawan.departemenn_id
            LEFT JOIN agama ON agama.id = karyawan.agama_id
            WHERE karyawan.id = ?
            ORDER BY karyawan.nama`
            db.query(sqlSyntax, [id], function(errorSql, hasil) {
                if (errorSql) {
                    reject(errorSql)
                } else {
                    resolve(hasil)
                }
            })
        })
    },

    getAll_karyawan: function () {
        return new Promise( (resolve, reject) => {
            let sqlSyntax = 
            `SELECT
                karyawan.*, 
                departemen.kode, departemen.nama AS nama_dept, 
                agama.nama AS nama_agama
            FROM karyawan
            LEFT JOIN departemen ON departemen.id = karyawan.departemenn_id
            LEFT JOIN agama ON agama.id = karyawan.agama_id
            ORDER BY karyawan.nama`
            db.query(sqlSyntax, function(errorSql, hasil) {
                if (errorSql) {
                    reject(errorSql)
                } else {
                    resolve(hasil)
                }
            })
        })
    },

    insert_karyawan: function ( req ) {
        return new Promise( (resolve, reject) => {
            let sqlSyntax = 
            `INSERT INTO karyawan
            (Nama, Gender, Alamat, NIP, departemenn_id, agama_id)
            VALUES
            (?, ?, ?, ?, ?, ?)`
    
            let sqlData = [
                req.body.form_nama_lengkap,
                req.body.form_gender,
                req.body.form_alamat,
                req.body.form_NIP,
                req.body.form_jabatan,
                req.body.form_agama
            ]
    
            db.query(sqlSyntax,sqlData, function(errorSql, hasil) {
                if (errorSql) {
                    reject(errorSql)
                } else {
                    resolve(hasil)
                }
            })
        })
    },

    update_karyawan: function (req) {
        return new Promise( (resolve, reject) => {
            let sqlSyntax = 
            `UPDATE karyawan SET ? WHERE id = ?`
    
            let sqlData = {
                Nama            : req.body.form_nama_lengkap,
                Gender          : req.body.form_gender,
                Alamat          : req.body.form_alamat,
                NIP             : req.body.form_NIP,
                departemenn_id  : req.body.form_jabatan,
                agama_id        : req.body.form_agama
            }
    
            db.query(sqlSyntax,[sqlData, req.params.id], function(errorSql, hasil) {
                if (errorSql) {
                    reject(errorSql)
                } else {
                    resolve(hasil)
                }
            })
        })
    },

    hapusKaryawan: function ( id ) {
        return new Promise( (resolve, reject) => {
            let sqlSyntax = 
            `DELETE FROM karyawan WHERE id = ?`
    
            db.query(sqlSyntax, [id], function(errorSql, hasil) {
                if (errorSql) {
                    reject(errorSql)
                } else {
                    resolve(hasil)
                }
            })
        })
    }
    
}