const http = require('http')
const url = require('url')
const fs = require('fs')

http.createServer((req, res) => {
    const params = url.parse(req.url, true).query

    const fechaHoy = (date) => {
        let dia = date.getDate()
        let mes = date.getMonth() + 1

        if (dia < 10) {
            dia = `0${dia}`
        }

        if (mes < 10) {
            mes = `0${mes}`
        }
        return `${dia}/${mes}/${date.getYear() + 1}`
    }


    const { archivo, contenido } = params

    if (req.url.includes('/crear')) {

        const nuevoContenido = `${fechaHoy(new Date)} \n${contenido}`

        fs.writeFile(archivo, nuevoContenido, 'utf8', (err) => {
            if (err) {
                res.write('Error')
                res.end
            } else {
                res.write('Archivo Creado con exito')
                res.end()
            }
        })
    }

    if (req.url.includes('/leer')) {
        fs.readFile(archivo, (err, data) => {
            if (err) {
                res.write('Error')
                res.end()
            } else {
                res.write(`Archivo leido exitosamente, su contenido es: ${data}`)
                res.end()
            }
        })
    }

    if (req.url.includes('/renombrar')) {

        const { nombre, nuevoNombre } = params

        fs.rename(nombre, nuevoNombre, (err) => {
            if (err) {
                res.write('Error')
                res.end()
            } else {
                res.write(`Cambio de nombre exitoso. El archivo "${nombre}" ahora se llama "${nuevoNombre}"`)
                res.end()
            }
        })
    }

    if (req.url.includes('/eliminar')) {

        fs.unlink(archivo, (err) => {
            if (err) {
                res.write('Error')
                res.end()
            } else {
                res.write(`Tu solicitud para eliminar el archivo ${archivo} se está procesando`)
                setTimeout(() => {
                    res.write(`Archivo ${archivo} fue eliminado exitosamente`, () => {
                        return res.end()
                    })
                }, 3000);
            }
        })
    }

}).listen(8080, () => console.log('escuchando puerto 8080'))