// import { validateMovie, validatePartialMovie } from '../schemas/movies.js'

import { validatePartialTournament, validateTournament } from '../schemas/tournament.schema.js'

export class TournamentCrontrolles {
  constructor ( { tournamentModel } ) {
    this.tournamentModel = tournamentModel
  }

  getAll = async ( req, res ) => {
    const tournaments = await this.tournamentModel.getAll()
    res.json( tournaments )
  }

  getById = async ( req, res ) => {
    const { id } = req.params
    const tournament = await this.tournamentModel.getById( { id } )
    if ( tournament ) return res.json( tournament )
    res.status( 404 ).json( { message: 'tournament not found' } )
  }

  create = async ( req, res ) => {
    const result = validateTournament( req.body )

    if ( !result.success ) {
      // 422 Unprocessable Entity
      return res.status( 400 ).json( { error: JSON.parse( result.error.message ) } )
    }

    const newTournament = await this.tournamentModel.create( { input: result.data } )

    res.status( 201 ).json( newTournament )
  }

  delete = async ( req, res ) => {
    const { id } = req.params

    const result = await this.tournamentModel.delete( { id } )

    if ( result === false ) {
      return res.status( 404 ).json( { message: 'Tournament not found' } )
    }

    return res.json( { message: 'Tournament deleted' } )
  }

  update = async ( req, res ) => {
    const result = validatePartialTournament( req.body )

    if ( !result.success ) {
      return res.status( 400 ).json( { error: JSON.parse( result.error.message ) } )
    }

    const { id } = req.params

    const updatedTournament = await this.tournamentModel.update( { id, input: result.data } )

    return res.json( updatedTournament )
  }
}
