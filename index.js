import express from 'express'
import 'dotenv/config'
import { tournamentRouter } from './src/routes/torunament.route.js'
import { seasonRouter } from './src/routes/season.route.js'
import { zoneRouter } from './src/routes/zone.route.js'
import { categoryRouter } from './src/routes/category.route.js'
import { teamRouter } from './src/routes/team.route.js'
import { playerRouter } from './src/routes/player.route.js'
import { matchRouter } from './src/routes/match.route.js'

const app = express()
app.use( express.json() )

app.get( '/test', ( req, res ) => {
  res.end( 'hola' )
} )
app.use( '/api/tournament/', tournamentRouter )
app.use( '/api/season/', seasonRouter )
app.use( '/api/category/', categoryRouter )
app.use( '/api/zone/', zoneRouter )
app.use( '/api/team/', teamRouter )
app.use( '/api/player/', playerRouter )
app.use( '/api/match/', matchRouter )

app.listen( 3002, ( req, res ) => {
  console.log( 'servidor conrriendo en el puerto', 3002 )
} )
