const md5 = require('md5')

const express =require('express')
const handlebars = require('express-handlebars')

const fetch = require('node-fetch')
const withQuery = require('with-query').default

const PORT = parseInt(process.argv[2]) || parseInt(process.env.APP_PORT) || 3000

const API_KEY = process.env.API_KEY || ""
const prAPI_KEY = process.env.prAPI_KEY || ""
const ts = (new Date()).getTime()
const ENDPOINT = 'http://gateway.marvel.com/v1/public/characters'
const hash = md5(`${ts}${prAPI_KEY}${API_KEY}`)

const app = express()

app.engine('hbs', handlebars({ defaultLayout: 'default.hbs'}))
app.set('view engine', 'hbs')

app.get('/', (req, resp)=>{
    
    //const search = process.argv[2]
    const limit = 10
    const offset = parseInt(req.query['offset']) || 0
    const url = withQuery(
        ENDPOINT,
        {
            ts: ts,
            apikey: API_KEY,
    //      name: search,
            limit: limit,
            hash: hash,
            offset: offset
        }
            )
    console.info('url: ', url.toString())

    const p = fetch(url)
    let character=[]
    p.then(result=>{
        return result.json()})
    .then(result=>{
        console.info('Marvel character')    
        const a = result.data.results
        for(let b of a) {
            const hero= b.name
            const imgUrl= b.thumbnail.path+'/standard_fantastic.'+b.thumbnail.extension
            const dcrps= b.description
            character.push({hero, imgUrl,dcrps})
            }
        resp.status(200)
        resp.type('text.html')
        resp.render('index',{
            character,
            prev: Math.max(0, offset - limit),
            next: offset+limit 
            })
    
    }).catch(e=>{
        console.info('Error occurred')
        console.error('error',e)
})
 
})

if (API_KEY)
    app.listen(PORT, () =>{
        console.info(`Application started on port ${PORT} at ${new Date()}`)
    })
else console.error(e)
 
 
 
 
 
 
 
 
 
    /*   
    resp.status(200)
    resp.type('text/html')
    resp.render('index',{result})
})


 /*   for (let d of a.data) {
        const title = d.title
    }
})
.then(result=>{
    const a = result
})
})

*/