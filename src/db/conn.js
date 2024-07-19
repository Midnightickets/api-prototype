const mongoose = require('mongoose')
require('dotenv').config();

async function main () {
    try {
        mongoose.set('strictQuery', true)
        await mongoose.connect(process.env.CONNECTION_STRING)
            .then(() => {
                console.log(`\n✨✨✨✨✨✨✨✨✨✨\n\n⭐ Bem-vindo de volta, ${process.env.DEV_NAME.length}! 🌃\n🗓️  ` + new Date().toLocaleString('pt-BR') + `⏱️\n\nConexão com MongoDB estabelecida com Sucesso\n\n🎫🎟️🎫🎟️🎫🎟️🎫🎟️🎫🎟️🎫🎟️\n`)
            })
            .catch((error) => {
                console.error('Connection error: ' + error)
            })
    } catch (error) {
        console.error('Erro conn: ' + error)
    }
}

module.exports = main