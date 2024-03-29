import { validatePartialTeam, validateTeam, validateTeamStatics } from '../schemas/team.schema.js'
export class TeamController {
  constructor ( { teamModel } ) {
    this.teamModel = teamModel
  }

  getAllByZone = async ( req, res ) => {
    const { idZone } = req.params
    try {
      const teams = await this.teamModel.getAllByZone( { idZone } )
      if ( teams ) return res.json( teams )
    } catch ( error ) {
      res.status( 404 ).json( { message: error.message } )
    }
  }

  getAllByCategory = async ( req, res ) => {
    const { idCategory } = req.params
    try {
      const teams = await this.teamModel.getAllByCategory( { idCategory } )
      if ( teams ) return res.json( teams )
    } catch ( error ) {
      res.status( 404 ).json( { message: error.message } )
    }
  }

  getById = async ( req, res ) => {
    const { idTeam } = req.params
    console.log( idTeam )
    try {
      const team = await this.teamModel.getById( { idTeam } )
      if ( team ) return res.json( team )
      res.status( 404 ).json( { message: 'Team not found' } )
    } catch ( error ) {
      res.status( 404 ).json( { message: error.message } )
    }
  }

  create = async ( req, res ) => {
    const result = validateTeam( req.body )

    if ( !result.success ) {
      return res.status( 422 ).json( { error: JSON.parse( result.error.message ) } )
    }
    try {
      const newTeam = await this.teamModel.create( { input: result.data } )
      res.status( 201 ).json( newTeam )
    } catch ( error ) {
      return res.status( 400 ).json( { error: error.message } )
    }
  }

  updateInfo = async ( req, res ) => {
    const result = validatePartialTeam( req.body )

    if ( !result.success ) {
      return res.status( 400 ).json( { error: JSON.parse( result.error.message ) } )
    }

    const { idTeam } = req.params
    try {
      const updatedTeam = await this.teamModel.updateInfo( { idTeam, input: result.data } )
      return res.json( updatedTeam )
    } catch ( error ) {
      return res.status( 400 ).json( { error: error.message } )
    }
  }

  updateStatics = async ( req, res ) => {
    const result = validateTeamStatics( req.body )

    if ( !result.success ) {
      return res.status( 400 ).json( { error: JSON.parse( result.error.message ) } )
    }

    const { idTeam } = req.params
    try {
      const updatedTeam = await this.teamModel.updateStatics( { idTeam, input: result.data } )
      return res.json( updatedTeam )
    } catch ( error ) {
      return res.status( 400 ).json( { error: error.message } )
    }
  }

  delete = async ( req, res ) => {
    const { idTeam } = req.params
    try {
      const result = await this.teamModel.delete( { idTeam } )

      if ( result === false ) {
        return res.status( 404 ).json( { message: 'Zone not found' } )
      }
      return res.json( { message: 'Zone deleted' } )
    } catch ( error ) {
      return res.status( 404 ).json( { message: 'Zone not deleted' } )
    }
  }
}
