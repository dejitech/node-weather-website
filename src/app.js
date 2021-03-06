const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')


//Initialize the app to use express
const app = express()
const port = process.env.PORT || 3000

//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Set up handlebars engine and views location 
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)



//Set up static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req,res) => {
    res.render('index', {
        title:'Weather app',
        name:'Deji'
    })
})

app.get('/about', (req,res) => {
    res.render('about', {
        title:'About me',
        name:'Deji'
    })

})

app.get('/help', (req,res)=>{
    res.render('help', {
        title:'Help',
        msg:'Get some help here',
        name:'Deji'
    })
})

app.get('/weather',(req,res)=>{
    if(!req.query.address){
        return res.send({
            error:'Pls provide an address to continue'
        })
    }else{
        geocode(req.query.address,(error, {latitude,longitude,location}={})=>{
            if(error){
                return res.send({error})
            }else{
                forecast(latitude,longitude,(error,forecastData)=>{
                    if(error){
                         return res.send({error})
                    } res.send({
                        forecast: forecastData,
                        location,
                        address: req.query.address
                    })
                })
            }

        })

    }
    

})

app.get('/help/*', (req,res) => {
    res.render('404page', {
        name:'Deji',
        title:'404page help',
        msg:'Help article not found!'
    })
})

app.get('*', (req, res) => {
    res.render('404page', {
        name: 'Deji',
        title: '404',
        msg: 'Page not found!'

    })
})


app.listen(port,()=>{
    console.log('Server is running on port' +port)
})


