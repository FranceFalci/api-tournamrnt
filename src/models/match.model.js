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
      const [matches] = await connection.query( ' SELECT * FROM partido INNER JOIN resultado_partido USING(id_partido) WHERE id_categoria=? ORDER BY num_fecha;', [idCategory] )
      return matches
    } catch ( error ) {
      console.log( error.message )
      throw new Error( 'Error getting matches' )
    }
  }

  static async getAllByPhase ( { idPhase } ) {
    try {
      const [matches] = await connection.query( ' SELECT * FROM partido INNER JOIN resultado_partido USING(id_partido) WHERE id_fase=? ORDER BY num_fecha;', [idPhase] )
      return matches
    } catch ( error ) {
      console.log( error.message )
      throw new Error( 'Error getting matches' )
    }
  }

  static async getById ( { idMatch } ) {
    try {
      const [match] = await connection.query(
        'SELECT * FROM partido INNER JOIN resultado_partido WHERE id_partido = ?;', [idMatch] )
      if ( match.length === 0 ) return null

      return match[0]
    } catch ( error ) {
      console.log( error.message )
      throw new Error( 'Error getting match ' )
    }
  }

  static async create ( { input } ) {
    console.log( 'en create' )
    const {
      date,
      hour,
      field,
      state,
      numDate,
      idCategory,
      idPhase
    } = input
    let insertId = null
    console.log( 'antes del try' )
    try {
      const [response] = await connection.query(
        'INSERT INTO partido (fecha,hora,cancha,estado,num_fecha,id_categoria ,id_fase) VALUES (?,?,?,?,?,?,?);',
        [date, hour, field, state, numDate, idCategory, idPhase]
      )
      if ( response && response.insertId ) {
        insertId = response.insertId
      }
    } catch ( e ) {
      console.log( e.message )
      throw new Error( 'Error creating match' )
      // enviar la traza a un servicio interno
    }

    if ( insertId !== null ) {
      const [match] = await connection.query(
        `SELECT *
        FROM partido WHERE id_partido = ?;`, [insertId]
      )

      if ( match.length > 0 ) {
        return match[0]
      } else {
        throw new Error( 'match not found' )
      }
    } else {
      throw new Error( 'Error inserting match' )
    }
  }

  static async createResult ( { idMatch, input } ) {
    console.log( 'en create result' )
    const {
      idTeamOne,
      idTeamTwo,
      resultOne,
      resultTwo

    } = input
    try {
      const [response] = await connection.query( 'INSERT INTO resultado_partido (id_partido,id_eq_uno,id_eq_dos,res_uno,res_dos) VALUES (?,?,?,?,?);',

        [idMatch, idTeamOne, idTeamTwo, resultOne, resultTwo]
      )
    } catch ( e ) {
      console.log( e.message )
      throw new Error( 'Error creating match' )
      // enviar la traza a un servicio interno
    }

    const [match] = await connection.query(
      `SELECT *
        FROM partido INNER JOIN resultado_partido USING(id_partido) WHERE id_partido = ?;`, [idMatch]
    )

    if ( match.length > 0 ) {
      return match[0]
    } else {
      throw new Error( 'match not found' )
    }
  }

  static async update ( { idMatch, input } ) {
    console.log( 'en update' )
    const {
      state,
      numDate,
      date,
      hour,
      field,
      idPhase

    } = input
    // todo controlar si el torneo existe
    try {
      const [response] = await connection.query(
        'UPDATE partido SET estado = IFNULL(?, estado) , num_fecha  = IFNULL(?, num_fecha) ,fecha = IFNULL(?,fecha),hora = IFNULL(?,hora),cancha = IFNULL(?,cancha) ,id_fase = IFNULL(?,id_fase) WHERE id_partido = ?;',
        [state, numDate, date, hour, field, idPhase, idMatch]
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

  static async updateResult ( { idMatch, input } ) {
    console.log( 'en update' )
    const {
      idTeamOne,
      idTeamTwo,
      resultOne,
      resultTwo
    } = input
    // todo controlar si el torneo existe
    try {
      const [response] = await connection.query(
        'UPDATE resultado_partido SET id_eq_uno = IFNULL(?, id_eq_uno) , id_eq_dos  = IFNULL(?, id_eq_dos) ,res_uno = IFNULL(?,res_uno),res_dos = IFNULL(?,res_dos) WHERE id_partido = ?;',
        [idTeamOne, idTeamTwo, resultOne, resultTwo, idMatch]
      )

      if ( response && response.affectedRows > 0 ) {
        const [updatedMatch] = await connection.query(
          'SELECT * FROM partido INNER JOIN resultado_partido USING(id_partido) WHERE id_partido = ?;',
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
      throw new Error( 'Error updating result match ' )
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
}

// SET id_eq_uno = IFNULL(?, id_eq_uno), id_eq_dos = IFNULL(?, id_eq_dos), res_uno = IFNULL(?, res_uno), res_dos = IFNULL(?, res_dos),
