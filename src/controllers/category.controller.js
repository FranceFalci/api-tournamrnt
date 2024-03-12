import { validatePartialSeason, validateSeason } from '../schemas/season.schema.js'

export class CategoryController {
  constructor ( { categoryModel } ) {
    this.categoryModel = categoryModel
  }

  getAllBySeason = async ( req, res ) => {
    const { id } = req.params
    try {
      const categories = await this.categoryModel.getAllBySeason( { idTemporada: id } )
      if ( categories ) return res.json( categories )
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
      const newSeason = await this.categoryModel.create( { input: newSeasonData } )
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
      const updatedSeason = await this.categoryModel.update( { id, input: result.data } )
      return res.json( updatedSeason )
    } catch ( error ) {
      return res.status( 400 ).json( { error: error.message } )
    }
  }

  delete = async ( req, res ) => {
    const { id } = req.params
    try {
      const result = await this.categoryModel.delete( { id } )

      if ( result === false ) {
        return res.status( 404 ).json( { message: 'Season not found' } )
      }
      return res.json( { message: 'Season deleted' } )
    } catch ( error ) {
      return res.status( 404 ).json( { message: 'Season not deleted' } )
    }
  }
}
