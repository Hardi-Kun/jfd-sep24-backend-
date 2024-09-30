// memanggil modul bawaan dari node.js  yaitu http
// untuk membuat server htttp
const http  = require('http')
const filestream  = require('fs')

http.createServer( function(request, response) {
    console.log(request.url)
    response.writeHead(200, {'Content-type': 'text/html'})

    // Halaman utama
    if(request.url == '/'){
        filestream.createReadStream('./view/beranda.html').pipe(response)
    }
    // halaman profil
    else if (request.url == '/profil') {
        let tahun_lahir = 1990
        let tahun_ini = 2024
        let umur = tahun_ini- tahun_lahir
        filestream.createReadStream('./view/profil.html').pipe(response)
    }
    // hunbungi-saya
    else if (request.url == '/hubungi') {
        let kontak = {
            WA: '0948478334',
            email: 'Haruto@gmail.com',
            linkedin: 'linkedin.com/haruto',
            ig: '@ruutooo_'
        }
        response.end(
            `<ul>
                <li>Whatsapp: ${kontak.WA}</li>
                <li>Email: ${kontak.email}</li>
                <li>Instagram: ${kontak.linkedin}</li>
                <li>Linkedin: ${kontak.ig}</li>
            </ul>`
        )
    }
    // untuk menganggapi URL yg tidak ada
    else {
        response.end(`<h1>404: Halaman tidak ditemukan</h1><hr>`)
    }
}).listen(8000, function() {
    console.log('Server  nyala, buka http://localhost:8000')
})

// tes nambah komentar
// kirim ke 2x