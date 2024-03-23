import { validateMatch, validatePartialMatch } from '../schemas/match.schema .js'
import { validatePartialPlayer, validatePlayer, validatePlayerStatics } from '../schemas/player.schema.js'
export class MatchController {
  constructor ( { matchModel } ) {
    this.matchModel = matchModel
  }

  getAllByCategory = async ( req, res ) => {
    const { idCategory } = req.params
    try {
      const matches = await this.matchModel.getAllByCategory( { idCategory } )
      if ( matches ) return res.json( matches )
    } catch ( error ) {
      res.status( 404 ).json( { message: error.message } )
    }
  }

  getById = async ( req, res ) => {
    const { idMatch } = req.params
    try {
      const player = await this.matchModel.getById( { idMatch } )
      if ( player ) return res.json( player )
      res.status( 404 ).json( { message: 'Player not found' } )
    } catch ( error ) {
      res.status( 404 ).json( { message: error.message } )
    }
  }

  create = async ( req, res ) => {
    try {
      const result = validateMatch( req.body )
      if ( !result.success ) {
        return res.status( 422 ).json( { error: JSON.parse( result.error.message ) } )
      }

      const newMatch = await this.matchModel.create( { input: result.data } )

      res.status( 201 ).json( newMatch )
    } catch ( error ) {
      return res.status( 400 ).json( { error: error.message } )
    }
  }

  updateInfo = async ( req, res ) => {
    try {
      const result = validatePartialMatch( req.body )

      if ( !result.success ) {
        return res.status( 400 ).json( { error: JSON.parse( result.error.message ) } )
      }

      const { idMatch } = req.params
      console.log( result.data )
      const updatedMatch = await this.matchModel.update( { idMatch, input: result.data } )
      return res.json( updatedMatch )
    } catch ( error ) {
      return res.status( 400 ).json( { error: error.message } )
    }
  }

  delete = async ( req, res ) => {
    const { idMatch } = req.params
    try {
      const result = await this.matchModel.delete( { idMatch } )

      if ( result === false ) {
        return res.status( 404 ).json( { message: 'Player not found' } )
      }
      return res.json( { message: 'Player deleted' } )
    } catch ( error ) {
      return res.status( 404 ).json( { message: 'Player not deleted' } )
    }
  }

  // updateMatchPoints = async ( { idTeamOne, idTeamTwo, resultOne, resultTwo } ) => {
  //   console.log( idTeamOne, idTeamTwo, resultOne, resultTwo, 'update martch points' )
  //   try {
  //     if ( resultOne === null || resultTwo === null ) return

  //     if ( resultOne > resultTwo ) {
  //       const response = await this.matchModel.wonMatch( { idTeam: idTeamOne } )
  //       return response
  //     }

  //     if ( resultOne < resultTwo ) {
  //       const response = await this.matchModel.wonMatch( { idTeam: idTeamTwo } )
  //       return response
  //     }
  //     if ( resultOne === resultTwo ) {
  //       const responseOne = await this.matchModel.drawnMatch( { idTeam: idTeamOne } )
  //       const responseTwo = await this.matchModel.drawnMatch( { idTeam: idTeamTwo } )
  //       return ( responseOne && responseTwo )
  //     }
  //   } catch ( error ) {
  //     console.log( error.message )
  //     throw new Error( 'Error controlling Match' )
  //   }
  // }

  // updateReverseMatchPoints = async ( { idTeamOne, idTeamTwo, resultOne, resultTwo } ) => {
  //   try {
  //     if ( resultOne > resultTwo ) {
  //       const response = await this.matchModel.reverseWonMatch( { idTeam: idTeamOne } )
  //       return response
  //     }
  //     if ( resultOne < resultTwo ) {
  //       const response = await this.matchModel.reverseWonMatch( { idTeam: idTeamTwo } )
  //       return response
  //     }
  //     if ( resultOne === resultTwo ) {
  //       const responseOne = await this.matchModel.reverseDrawnMatch( { idTeam: idTeamOne } )
  //       const responseTwo = await this.matchModel.reverseDrawnMatch( { idTeam: idTeamTwo } )
  //       return ( responseOne && responseTwo )
  //     }
  //   } catch ( error ) {
  //     console.log( error.message )
  //     throw new Error( 'Error controlling Match' )
  //   }
  // }

  // updateMatchGoals = async ( { idTeam, scoredGoals, concededGoals } ) => {
  //   try {
  //     await this.matchModel.sumScoredGoals( { idTeam, goals: scoredGoals } )
  //     await this.matchModel.sumConcededGoals( { idTeam, goals: concededGoals } )
  //   } catch ( error ) {
  //     // console.log( error.message )
  //     throw new Error( 'Error updating goals' )
  //   }
  // }

  // updateReverseMatchGoals = async ( { idTeam, scoredGoals, concededGoals } ) => {
  //   try {
  //     await this.matchModel.restScoredGoals( idTeam, scoredGoals )
  //     await this.matchModel.restConcededGoals( idTeam, concededGoals )
  //   } catch ( error ) {
  //     console.log( error.message )
  //     throw new Error( 'Error updating goals' )
  //   }
  // }

  // controlMatchGoals = async ( { idMatch, idTeamOne, idTeamTwo, resultOne, resultTwo } ) => {
  //   try {
  //     console.log( idMatch )
  //     const result = await this.matchModel.getResults( { idMatch } )
  //     console.log( 'resultado de getResults', result )
  //     if ( result.resultOne && result.resultTwo ) {
  //       console.log( 'dentro del if' )
  //       await this.updateReverseMatchGoals( { idTeam: idTeamOne, scoredGoals: result.resultOne, concededGoals: result.resultTwo } )
  //       await this.updateReverseMatchGoals( { idTeam: idTeamTwo, scoredGoals: result.resultTwo, concededGoals: result.resultOne } )
  //     }
  //     if ( resultOne === null || resultTwo === null ) return

  //     // const { oldResultOne, oldResultTwo }

  //     await this.updateMatchGoals( { idTeam: idTeamOne, scoredGoals: resultOne, concededGoals: resultTwo } )
  //     await this.updateMatchGoals( { idTeam: idTeamTwo, scoredGoals: resultTwo, concededGoals: resultOne } )
  //   } catch ( error ) {
  //     console.log( error.message )
  //     throw new Error( 'Error controlling MatchGoals' )
  //   }
  // }

  // controlMatchPoints = async ( { idMatch, idTeamOne, idTeamTwo, resultOne, resultTwo } ) => {
  //   console.log( idMatch )
  //   try {
  //     const response = await this.matchModel.getResults( { idMatch } )
  //     if ( response !== null ) {
  //       console.log( response )
  //       console.log( 'nulo' )
  //       // const { oldResultOne, oldResultTwo } = response
  //       await this.updateReverseMatchPoints( { idTeamOne, idTeamTwo, resultOne: response.resultOne, resultTwo: response.resultTwo } )
  //     }
  //     if ( resultOne === null || resultTwo === null ) return
  //     await this.updateMatchPoints( { idTeamOne, idTeamTwo, resultOne, resultTwo } )
  //     // return true
  //   } catch ( error ) {
  //     console.log( error.message, 'qui' )
  //     throw new Error( 'Error controlling Match Points' )
  //   }
  // }

  // updateMatchStatics = async ( { idTeamOne, idTeamTwo, resultOne, resultTwo } ) => {
  //   // console.log( idTeamOne, idTeamTwo, resultOne, resultTwo, 'update martch points' )
  //   if ( resultOne === null || resultTwo === null ) return
  //   try {
  //     await this.matchModel.sumPlayedMatch( { idTeam: idTeamOne } )
  //     await this.matchModel.sumPlayedMatch( { idTeam: idTeamTwo } )

  //     if ( resultOne > resultTwo ) {
  //       await this.matchModel.sumWonMatch( { idTeam: idTeamOne } )
  //       await this.matchModel.sumLostMatch( { idTeam: idTeamTwo } )
  //     }

  //     if ( resultOne < resultTwo ) {
  //       await this.matchModel.sumWonMatch( { idTeam: idTeamTwo } )
  //       await this.matchModel.sumLostMatch( { idTeam: idTeamOne } )
  //     }

  //     if ( resultOne === resultTwo ) {
  //       await this.matchModel.sumDrawnMatch( { idTeam: idTeamOne } )
  //       await this.matchModel.sumDrawnMatch( { idTeam: idTeamTwo } )
  //       // return ( responseOne && responseTwo )
  //     }
  //   } catch ( error ) {
  //     console.log( error.message )
  //     throw new Error( 'Error controlling Match' )
  //   }
  // }

  // updateReverseMatchStatics = async ( { idTeamOne, idTeamTwo, resultOne, resultTwo } ) => {
  //   // if ( resultOne === null || resultTwo === null ) return
  //   try {
  //     await this.matchModel.restPlayedMatch( { idTeam: idTeamOne } )
  //     await this.matchModel.restPlayedMatch( { idTeam: idTeamTwo } )

  //     if ( resultOne > resultTwo ) {
  //       await this.matchModel.restWonMatch( { idTeam: idTeamOne } )
  //       await this.matchModel.restLostMatch( { idTeam: idTeamTwo } )
  //     }

  //     if ( resultOne < resultTwo ) {
  //       await this.matchModel.reverseWonMatch( { idTeam: idTeamTwo } )
  //       await this.matchModel.restLostMatch( { idTeam: idTeamOne } )
  //     }

  //     if ( resultOne === resultTwo ) {
  //       await this.matchModel.restDrawnMatch( { idTeam: idTeamOne } )
  //       await this.matchModel.restDrawnMatch( { idTeam: idTeamTwo } )
  //       // return ( responseOne && responseTwo )
  //     }
  //   } catch ( error ) {
  //     console.log( error.message )
  //     throw new Error( 'Error controlling Match' )
  //   }
  // }

  // controlMatchStatics = async ( { idMatch, idTeamOne, idTeamTwo, resultOne, resultTwo } ) => {
  //   console.log( idMatch )
  //   try {
  //     const response = await this.matchModel.getResults( { idMatch } )
  //     if ( response !== null ) {
  //       console.log( response )
  //       console.log( 'nulo' )
  //       // const { oldResultOne, oldResultTwo } = response
  //       await this.updateReverseMatchStatics( { idTeamOne, idTeamTwo, resultOne: response.resultOne, resultTwo: response.resultTwo } )
  //     }
  //     if ( resultOne === null || resultTwo === null ) return
  //     await this.updateMatchStatics( { idTeamOne, idTeamTwo, resultOne, resultTwo } )
  //     // return true
  //   } catch ( error ) {
  //     console.log( error.message, 'qui' )
  //     throw new Error( 'Error controlling Match statics' )
  //   }
  // }
}
