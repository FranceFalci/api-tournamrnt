import { validateCategory, validatePartialCategory } from '../schemas/category.schema.js'
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
    const result = validateCategory( req.body )

    if ( !result.success ) {
      return res.status( 422 ).json( { error: JSON.parse( result.error.message ) } )
    }
    try {
      const newCategory = await this.categoryModel.create( { input: result.data } )
      res.status( 201 ).json( newCategory )
    } catch ( error ) {
      return res.status( 400 ).json( { error: error.message } )
    }
  }

  update = async ( req, res ) => {
    const result = validatePartialCategory( req.body )

    if ( !result.success ) {
      return res.status( 400 ).json( { error: JSON.parse( result.error.message ) } )
    }

    const { id } = req.params
    try {
      const updatedCategory = await this.categoryModel.update( { id, input: result.data } )
      return res.json( updatedCategory )
    } catch ( error ) {
      return res.status( 400 ).json( { error: error.message } )
    }
  }

  delete = async ( req, res ) => {
    const { id } = req.params
    try {
      const result = await this.categoryModel.delete( { id } )

      if ( result === false ) {
        return res.status( 404 ).json( { message: 'Category not found' } )
      }
      return res.json( { message: 'Category deleted' } )
    } catch ( error ) {
      return res.status( 404 ).json( { message: 'Category not deleted' } )
    }
  }
}
