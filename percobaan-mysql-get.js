// const { error }     = require('console')
const mysql         = require ('mysql2')
const filestream    = require('fs')
const http          = require('http')

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


function getAll_karyawan() {
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
}

http.createServer( async function(request, response) {
    response.writeHead(200, {'Content-type': 'text/html'})

    if (request.url == '/') {
        filestream.createReadStream('./view/halaman-utama.html').pipe(response)
    }
    else if (request.url == '/karyawan') {
        // tarik data dari db
        let data = await getAll_karyawan()
        
        let html_list_karyawan = ''
        for (const i in data) {
            html_list_karyawan +=
            `
            <b>Nama Lengkap</b>: ${data[i].Nama} <br>
            <b>Gender </b>: ${data[i].Gender} <br>
            <b>Alamat</b>: ${data[i].Alamat} <br>
            <b>NIP</b>: ${data[i].NIP} <br>
            <b>Jabatan</b>: ${data[i].nama_dept} <br>
            <b>Agama</b>: ${data[i].nama_agama} <br>
            <br>
            `
        }


        // kirim hasilnya ke front-end
        response.end(
            `<h1>Data Karyawan PT Data Informasi Teknologi</h1>
            <hr>
            ${html_list_karyawan}
            `
        )
    }
}).listen(9000, function() {
    console.log('Server  nyala, buka http://localhost:9000')
})
