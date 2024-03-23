import mysql from 'mysql2/promise'
// TODO ver si la temporada existe o no

const DEFAULT_CONFIG = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: process.env.DB_PASS,
  database: 'torneo'
}
const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG

const connection = await mysql.createConnection( connectionString )

export class MatchModel {
  static async getAllByCategory ( { idCategory } ) {
    // TODO ver si equipo existe o no
    try {
      const [matches] = await connection.query( 'SELECT id_partido, id_eq_uno , id_eq_dos, res_uno, res_dos, id_fase ,fecha,hora,cancha,estado,id_categoria,num_fecha from partido JOIN equipo on partido.id_eq_uno = equipo.id_equipo JOIN zona ON zona.id_zona = equipo.id_zona WHERE id_categoria = ? ORDER BY num_fecha;', [idCategory] )
      return matches
    } catch ( error ) {
      console.log( error.message )
      throw new Error( 'Error getting matches' )
    }
  }

  static async getById ( { idMatch } ) {
    try {
      const [match] = await connection.query(
        'SELECT * FROM partido WHERE id_partido = ?;', [idMatch] )
      if ( match.length === 0 ) return null

      return match[0]
    } catch ( error ) {
      console.log( error.message )
      throw new Error( 'Error getting match ' )
    }
  }

  static async create ( { input } ) {
    const {
      idTeamOne,
      idTeamTwo,
      resultOne,
      resultTwo,
      date,
      hour,
      field,
      state,
      numDate,
      idSeason
    } = input
    let insertId = null
    try {
      const [response] = await connection.query(
        'INSERT INTO partido (id_eq_uno , id_eq_dos, res_uno,res_dos,fecha,hora,cancha,estado,num_fecha,id_temporada ) VALUES (?,?,?,?,?,?,?,?,?,?);',
        [idTeamOne, idTeamTwo, resultOne, resultTwo, date, hour, field, state, numDate, idSeason]
      )
      if ( response && response.insertId ) {
        insertId = response.insertId
      }
      // console.log( insertId, response )
    } catch ( e ) {
      // puede enviarle información sensible
      console.log( e.message )
      throw new Error( 'Error creating match' )
      // enviar la traza a un servicio interno
      // sendLog(e)
    }

    // Verificar si insertId es null o no
    if ( insertId !== null ) {
      const [match] = await connection.query(
        `SELECT *
        FROM partido WHERE id_partido = ?;`, [insertId]
      )

      // Verificar si se encontró algún torneo
      if ( match.length > 0 ) {
        return match[0] // Devolver el torneo encontrado
      } else {
        throw new Error( 'match not found' ) // Si no se encuentra ningún torneo
      }
    } else {
      throw new Error( 'Error inserting match' ) // Si insertId es null
    }
  }

  static async update ( { idMatch, input } ) {
    console.log( 'en update' )
    const {
      idTeamOne,
      idTeamTwo,
      resultOne,
      resultTwo,
      state,
      numDate,
      date,
      hour,
      field
    } = input
    // todo controlar si el torneo existe
    try {
      const [response] = await connection.query(
        'UPDATE partido SET id_eq_uno = IFNULL(?, id_eq_uno), id_eq_dos = IFNULL(?, id_eq_dos), res_uno =IFNULL(?, res_uno) , res_dos =IFNULL(?, res_dos) , estado = IFNULL(?, estado) , num_fecha  = IFNULL(?, num_fecha) ,fecha = IFNULL(?,fecha),hora = IFNULL(?,hora),cancha = IFNULL(?,cancha) WHERE id_partido = ?;',
        [idTeamOne, idTeamTwo, resultOne, resultTwo, state, numDate, date, hour, field, idMatch]
      )
      console.log( 'en update' )

      if ( response && response.affectedRows > 0 ) {
        const [updatedMatch] = await connection.query(
          'SELECT * FROM partido WHERE id_partido = ?;',
          [idMatch]
        )

        if ( updatedMatch.length > 0 ) {
          return updatedMatch[0]
        } else {
          throw new Error( 'Updated match not found' )
        }
      } else {
        throw new Error( 'Match update failed' )
      }
    } catch ( e ) {
      console.log( e.message )
      throw new Error( 'Error updating match ' )
    }
  }

  static async delete ( { idMatch } ) {
    try {
      const [response] = await connection.query(
        'DELETE FROM partido WHERE id_partido = ?;',
        [idMatch]
      )

      if ( response && response.affectedRows > 0 ) {
        return true // Devolver verdadero si se eliminó correctamente
      } else {
        throw new Error( 'Match not found or already deleted' ) // Si el torneo no se encuentra o ya ha sido eliminado
      }
    } catch ( e ) {
      console.log( e.message )
      throw new Error( 'Error deleting Match' )
    }
  }

  // static async wonMatch ( { idTeam } ) {
  //   try {
  //     const [response] = await connection.query(
  //       'UPDATE equipo SET puntos = puntos + 3 where id_equipo = ?;',
  //       [idTeam]
  //     )

  //     if ( response && response.affectedRows > 0 ) {
  //       return true // Devolver verdadero si se eliminó correctamente
  //     } else {
  //       throw new Error( 'Match not found ' ) // Si el torneo no se encuentra o ya ha sido eliminado
  //     }
  //   } catch ( e ) {
  //     console.log( e.message )
  //     throw new Error( 'Error updating wonMatch' )
  //   }
  // }

  // static async drawnMatch ( { idTeam } ) {
  //   try {
  //     const [response] = await connection.query(
  //       'UPDATE equipo SET puntos = puntos + 1 where id_equipo = ?;',
  //       [idTeam]
  //     )

  //     if ( response && response.affectedRows > 0 ) {
  //       return true // Devolver verdadero si se eliminó correctamente
  //     } else {
  //       throw new Error( 'Match not found ' ) // Si el torneo no se encuentra o ya ha sido eliminado
  //     }
  //   } catch ( e ) {
  //     console.log( e.message )
  //     throw new Error( 'Error updating drawnMatch' )
  //   }
  // }

  // static async reverseWonMatch ( { idTeam } ) {
  //   try {
  //     const [response] = await connection.query(
  //       'UPDATE equipo SET puntos = puntos - 3 where id_equipo = ?;',
  //       [idTeam]
  //     )

  //     if ( response && response.affectedRows > 0 ) {
  //       return true // Devolver verdadero si se eliminó correctamente
  //     } else {
  //       throw new Error( 'Match not found ' ) // Si el torneo no se encuentra o ya ha sido eliminado
  //     }
  //   } catch ( e ) {
  //     console.log( e.message )
  //     throw new Error( 'Error updating wonMatch' )
  //   }
  // }

  // static async reverseDrawnMatch ( { idTeam } ) {
  //   try {
  //     const [response] = await connection.query(
  //       'UPDATE equipo SET puntos = puntos - 1 where id_equipo = ?;',
  //       [idTeam]
  //     )

  //     if ( response && response.affectedRows > 0 ) {
  //       return true // Devolver verdadero si se eliminó correctamente
  //     } else {
  //       throw new Error( 'Match not found ' ) // Si el torneo no se encuentra o ya ha sido eliminado
  //     }
  //   } catch ( e ) {
  //     console.log( e.message )
  //     throw new Error( 'Error updating drawnMatch' )
  //   }
  // }

  // static async sumScoredGoals ( { idTeam, goals } ) {
  //   console.log( 'id team', idTeam )
  //   console.log( 'goals', goals )
  //   try {
  //     const [response] = await connection.query(
  //       'UPDATE equipo SET goles_favor = goles_favor + ? where id_equipo = ?;',
  //       [goals, idTeam]
  //     )

  //     if ( response && response.affectedRows > 0 ) {
  //       return true // Devolver verdadero si se eliminó correctamente
  //     } else {
  //       throw new Error( 'Team not found ' ) // Si el torneo no se encuentra o ya ha sido eliminado
  //     }
  //   } catch ( e ) {
  //     console.log( e.message )
  //     throw new Error( 'Error updating goals' )
  //   }
  // }

  // static async sumConcededGoals ( { idTeam, goals } ) {
  //   try {
  //     const [response] = await connection.query(
  //       'UPDATE equipo SET goles_contra = goles_contra + ? where id_equipo = ?;',
  //       [goals, idTeam]
  //     )

  //     if ( response && response.affectedRows > 0 ) {
  //       return true // Devolver verdadero si se eliminó correctamente
  //     } else {
  //       throw new Error( 'Team not found ' ) // Si el torneo no se encuentra o ya ha sido eliminado
  //     }
  //   } catch ( e ) {
  //     console.log( e.message )
  //     throw new Error( 'Error updating conceded goals' )
  //   }
  // }

  // static async restScoredGoals ( { idTeam, goals } ) {
  //   try {
  //     const [response] = await connection.query(
  //       'UPDATE equipo SET goles_favor = goles_favor - ? where id_equipo = ?;',
  //       [goals, idTeam]
  //     )

  //     if ( response && response.affectedRows > 0 ) {
  //       return true // Devolver verdadero si se eliminó correctamente
  //     } else {
  //       throw new Error( 'Team not found ' ) // Si el torneo no se encuentra o ya ha sido eliminado
  //     }
  //   } catch ( e ) {
  //     console.log( e.message )
  //     throw new Error( 'Error updating goals' )
  //   }
  // }

  // static async restConcededGoals ( { idTeam, goals } ) {
  //   try {
  //     const [response] = await connection.query(
  //       'UPDATE equipo SET goles_contra = goles_contra - ? where id_equipo = ?;',
  //       [goals, idTeam]
  //     )

  //     if ( response && response.affectedRows > 0 ) {
  //       return true // Devolver verdadero si se eliminó correctamente
  //     } else {
  //       throw new Error( 'Team not found ' ) // Si el torneo no se encuentra o ya ha sido eliminado
  //     }
  //   } catch ( e ) {
  //     console.log( e.message )
  //     throw new Error( 'Error updating conceded goals' )
  //   }
  // }

  // static async sumPlayedMatch ( { idTeam } ) {
  //   // console.log( 'id team', idTeam )
  //   // console.log( 'goals', goals )
  //   try {
  //     const [response] = await connection.query(
  //       'UPDATE equipo SET partidos_jugados = partidos_jugados + 1 where id_equipo = ?;',
  //       [idTeam]
  //     )

  //     if ( response && response.affectedRows > 0 ) {
  //       return true // Devolver verdadero si se eliminó correctamente
  //     } else {
  //       throw new Error( 'Team not found ' ) // Si el torneo no se encuentra o ya ha sido eliminado
  //     }
  //   } catch ( e ) {
  //     console.log( e.message )
  //     throw new Error( 'Error updating played matchs' )
  //   }
  // }

  // static async sumDrawnMatch ( { idTeam } ) {
  //   // console.log( 'id team', idTeam )
  //   // console.log( 'goals', goals )
  //   try {
  //     const [response] = await connection.query(
  //       'UPDATE equipo SET partidos_empatados = partidos_empatados + 1 where id_equipo = ?;',
  //       [idTeam]
  //     )

  //     if ( response && response.affectedRows > 0 ) {
  //       return true // Devolver verdadero si se eliminó correctamente
  //     } else {
  //       throw new Error( 'Team not found ' ) // Si el torneo no se encuentra o ya ha sido eliminado
  //     }
  //   } catch ( e ) {
  //     console.log( e.message )
  //     throw new Error( 'Error updating played matchs' )
  //   }
  // }

  // static async sumLostMatch ( { idTeam } ) {
  //   try {
  //     const [response] = await connection.query(
  //       'UPDATE equipo SET partidos_perdidos = partidos_perdidos + 1 where id_equipo = ?;',
  //       [idTeam]
  //     )

  //     if ( response && response.affectedRows > 0 ) {
  //       return true // Devolver verdadero si se eliminó correctamente
  //     } else {
  //       throw new Error( 'Team not found ' ) // Si el torneo no se encuentra o ya ha sido eliminado
  //     }
  //   } catch ( e ) {
  //     console.log( e.message )
  //     throw new Error( 'Error updating played matchs' )
  //   }
  // }

  // static async sumWonMatch ( { idTeam } ) {
  //   // console.log( 'id team', idTeam )
  //   // console.log( 'goals', goals )
  //   try {
  //     const [response] = await connection.query(
  //       'UPDATE equipo SET partidos_ganados = partidos_ganados + 1 where id_equipo = ?;',
  //       [idTeam]
  //     )

  //     if ( response && response.affectedRows > 0 ) {
  //       return true // Devolver verdadero si se eliminó correctamente
  //     } else {
  //       throw new Error( 'Team not found ' ) // Si el torneo no se encuentra o ya ha sido eliminado
  //     }
  //   } catch ( e ) {
  //     console.log( e.message )
  //     throw new Error( 'Error updating played matchs' )
  //   }
  // }

  // static async restPlayedMatch ( { idTeam } ) {
  //   // console.log( 'id team', idTeam )
  //   // console.log( 'goals', goals )
  //   try {
  //     const [response] = await connection.query(
  //       'UPDATE equipo SET partidos_jugados = partidos_jugados - 1 where id_equipo = ?;',
  //       [idTeam]
  //     )

  //     if ( response && response.affectedRows > 0 ) {
  //       return true // Devolver verdadero si se eliminó correctamente
  //     } else {
  //       throw new Error( 'Team not found ' ) // Si el torneo no se encuentra o ya ha sido eliminado
  //     }
  //   } catch ( e ) {
  //     console.log( e.message )
  //     throw new Error( 'Error updating played matchs' )
  //   }
  // }

  // static async restDrawnMatch ( { idTeam } ) {
  //   // console.log( 'id team', idTeam )
  //   // console.log( 'goals', goals )
  //   try {
  //     const [response] = await connection.query(
  //       'UPDATE equipo SET partidos_empatados = partidos_empatados - 1 where id_equipo = ?;',
  //       [idTeam]
  //     )

  //     if ( response && response.affectedRows > 0 ) {
  //       return true // Devolver verdadero si se eliminó correctamente
  //     } else {
  //       throw new Error( 'Team not found ' ) // Si el torneo no se encuentra o ya ha sido eliminado
  //     }
  //   } catch ( e ) {
  //     console.log( e.message )
  //     throw new Error( 'Error updating played matchs' )
  //   }
  // }

  // static async restLostMatch ( { idTeam } ) {
  //   try {
  //     const [response] = await connection.query(
  //       'UPDATE equipo SET partidos_perdidos = partidos_perdidos - 1 where id_equipo = ?;',
  //       [idTeam]
  //     )

  //     if ( response && response.affectedRows > 0 ) {
  //       return true // Devolver verdadero si se eliminó correctamente
  //     } else {
  //       throw new Error( 'Team not found ' ) // Si el torneo no se encuentra o ya ha sido eliminado
  //     }
  //   } catch ( e ) {
  //     console.log( e.message )
  //     throw new Error( 'Error updating played matchs' )
  //   }
  // }

  // static async restWonMatch ( { idTeam } ) {
  //   // console.log( 'id team', idTeam )
  //   // console.log( 'goals', goals )
  //   try {
  //     const [response] = await connection.query(
  //       'UPDATE equipo SET partidos_ganados = partidos_ganados - 1 where id_equipo = ?;',
  //       [idTeam]
  //     )

  //     if ( response && response.affectedRows > 0 ) {
  //       return true // Devolver verdadero si se eliminó correctamente
  //     } else {
  //       throw new Error( 'Team not found ' ) // Si el torneo no se encuentra o ya ha sido eliminado
  //     }
  //   } catch ( e ) {
  //     console.log( e.message )
  //     throw new Error( 'Error updating played matchs' )
  //   }
  // }

  // static async getResults ( { idMatch } ) {
  //   console.log( idMatch )
  //   try {
  //     const [match] = await connection.query(
  //       'SELECT res_uno , res_dos,id_eq_uno,id_eq_dos FROM partido WHERE id_partido = ?;', [idMatch] )
  //     if ( match.length === 0 ) return null
  //     const { res_uno: resultOne, res_dos: resultTwo, id_eq_uno: idTeamOne, id_eq_dos: idTeamTwo } = match[0]
  //     return { resultOne, resultTwo }
  //   } catch ( error ) {
  //     console.log( error.message )
  //     throw new Error( 'Error getting results ' )
  //   }
  // }
}
