// memanggil modul bawaan dari node.js  yaitu http
// untuk membuat server htttp
const http  = require('http')

http.createServer( function(request, response) {
    console.log(request.url)
    response.writeHead(200, {'Content-type': 'text/html'})

    // Halaman utama
    if(request.url == '/'){
        response.end(`<h1>Selamat datang di website Hardi.com</h1><hr>`)
    }
    // halaman profil
    else if (request.url == '/profil') {
        response.end(
            `<ul>
                <li>Nama Lengkap: Haruto Kirigaya</li>
                <li>Nama Panggilan: Haruto</li>
                <li>Alamat: Tokyo, Jepang</li>
                <li>Pekerjaan: Senior Programmer dan Game Developer</li>
            </ul>`
        )
    }
    else if (request.url == '/hubungi') {
        response.end(
            `<ul>
                <li>Whatsapp: 0948478334</li>
                <li>Email: Haruto@gmail.com</li>
                <li>Instagram: ruutooo_</li>
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