import { validatePartialSeason, validateSeason } from '../schemas/season.schema.js'

export class SeasonController {
  constructor ( { seasonModel } ) {
    this.seasonModel = seasonModel
  }

  getAllByTorneo = async ( req, res ) => {
    const { id } = req.params
    try {
      const seasons = await this.seasonModel.getAllByTorneo( { idTorneo: id } )
      if ( seasons ) return res.json( seasons )
    } catch ( error ) {
      res.status( 404 ).json( { message: error.message } )
    }
  }

  // getById = async ( req, res ) => {
  //   const { id } = req.params
  //   const tournament = await this.seasonModel.getById( { id } )
  //   if ( tournament ) return res.json( tournament )
  //   res.status( 404 ).json( { message: 'tournament not found' } )
  // }

  create = async ( req, res ) => {
    const result = validateSeason( req.body )

    if ( !result.success ) {
      return res.status( 422 ).json( { error: JSON.parse( result.error.message ) } )
    }
    try {
      const startDate = new Date().toISOString().substring( 0, 10 ) // Convierte a ISOString y elimina la parte de la hora
      const newSeasonData = {
        ...result.data,
        startDate
      }
      // console.log( startDate )
      const newSeason = await this.seasonModel.create( { input: newSeasonData } )
      res.status( 201 ).json( newSeason )
    } catch ( error ) {
      return res.status( 400 ).json( { error: error.message } )
    }
  }

  update = async ( req, res ) => {
    const result = validatePartialSeason( req.body )

    if ( !result.success ) {
      return res.status( 400 ).json( { error: JSON.parse( result.error.message ) } )
    }

    const { id } = req.params
    try {
      const updatedSeason = await this.seasonModel.update( { id, input: result.data } )
      return res.json( updatedSeason )
    } catch ( error ) {
      return res.status( 400 ).json( { error: error.message } )
    }
  }

  delete = async ( req, res ) => {
    const { id } = req.params
    try {
      const result = await this.seasonModel.delete( { id } )

      if ( result === false ) {
        return res.status( 404 ).json( { message: 'Season not found' } )
      }
      return res.json( { message: 'Season deleted' } )
    } catch ( error ) {
      return res.status( 404 ).json( { message: 'Season not deleted' } )
    }
  }
}
