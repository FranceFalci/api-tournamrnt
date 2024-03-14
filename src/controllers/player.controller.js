import { validatePartialPlayer, validatePlayer, validatePlayerStatics } from '../schemas/player.schema.js'
export class PlayerController {
  constructor ( { playerModel } ) {
    this.playerModel = playerModel
  }

  getAllByTeam = async ( req, res ) => {
    const { idTeam } = req.params
    try {
      const players = await this.playerModel.getAllByTeam( { idTeam } )
      if ( players ) return res.json( players )
    } catch ( error ) {
      res.status( 404 ).json( { message: error.message } )
    }
  }

  getById = async ( req, res ) => {
    const { idPlayer } = req.params
    try {
      const player = await this.playerModel.getById( { idPlayer } )
      if ( player ) return res.json( player )
      res.status( 404 ).json( { message: 'Player not found' } )
    } catch ( error ) {
      res.status( 404 ).json( { message: error.message } )
    }
  }

  create = async ( req, res ) => {
    console.log( 'en create' )
    const result = validatePlayer( req.body )

    if ( !result.success ) {
      return res.status( 422 ).json( { error: JSON.parse( result.error.message ) } )
    }
    try {
      console.log( 'en el try' )
      const newPlayer = await this.playerModel.create( { input: result.data } )
      res.status( 201 ).json( newPlayer )
    } catch ( error ) {
      return res.status( 400 ).json( { error: error.message } )
    }
  }

  updateInfo = async ( req, res ) => {
    const result = validatePartialPlayer( req.body )

    if ( !result.success ) {
      return res.status( 400 ).json( { error: JSON.parse( result.error.message ) } )
    }

    const { idPlayer } = req.params
    try {
      const updatedPlayer = await this.playerModel.updateInfo( { idPlayer, input: result.data } )
      return res.json( updatedPlayer )
    } catch ( error ) {
      return res.status( 400 ).json( { error: error.message } )
    }
  }

  updateStatics = async ( req, res ) => {
    const result = validatePlayerStatics( req.body )

    if ( !result.success ) {
      return res.status( 400 ).json( { error: JSON.parse( result.error.message ) } )
    }

    const { idPlayer } = req.params
    console.log( idPlayer )
    try {
      const updaterPlayer = await this.playerModel.updateStatics( { idPlayer, input: result.data } )
      return res.json( updaterPlayer )
    } catch ( error ) {
      return res.status( 400 ).json( { error: error.message } )
    }
  }

  delete = async ( req, res ) => {
    const { idPlayer } = req.params
    try {
      const result = await this.playerModel.delete( { idPlayer } )

      if ( result === false ) {
        return res.status( 404 ).json( { message: 'Player not found' } )
      }
      return res.json( { message: 'Player deleted' } )
    } catch ( error ) {
      return res.status( 404 ).json( { message: 'Player not deleted' } )
    }
  }
}
