const express   = require ('express')
const app       = express()
const port      = 8000


app.set('view engine', 'ejs') // setting penggunaan template engine untuk express
app.set('views', './view-ejs') // setting penggunaan folder untuk menyimpan file .ejs

// function render ('nama-file')
// nama file wajib berekstensi .ejs
// otomotis mengambil file .ejs yg ada di folder view-ejs

app.get('/', function(req,res) {
    res.render('beranda')
})

app.get ('/pendidikan', (req,res) => {
    let profil = {
        nama: 'Haruto',
        s1: 'Universitas Tokyo, Teknik Informatika',
        smk: 'SMA Karasuno'
    }
    res.render('page-pendidikan', profil)
})

app.get('/karyawan', (req,res) => {
    res.render('page-karyawan')
})

app.listen(port, () => {
    console.log('Server  nyala, buka http://localhost:' + port)
})