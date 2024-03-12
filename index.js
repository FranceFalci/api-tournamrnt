import express from 'express'
import 'dotenv/config'
import { tournamentRouter } from './src/routes/torunament.route.js'
import { seasonRouter } from './src/routes/season.route.js'
import { zoneRouter } from './src/routes/zone.route.js'
import { categoryRouter } from './src/routes/category.route.js'

const app = express()
app.use( express.json() )

app.get( '/test', ( req, res ) => {
  res.end( 'hola' )
} )
app.use( '/api/tournament/', tournamentRouter )
app.use( '/api/season/', seasonRouter )
app.use( '/api/category/', categoryRouter )
app.use( '/api/zone/', zoneRouter )

app.listen( 3002, ( req, res ) => {
  console.log( 'servidor conrriendo en el puerto', process.env.PORT )
} )
