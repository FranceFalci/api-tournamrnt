import mysql from 'mysql2/promise'

const DEFAULT_CONFIG = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: process.env.DB_PASS,
  database: 'torneo'
}
const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG

const connection = await mysql.createConnection( connectionString )

export class PhaseModel {
  static async getAllByCup ( { idCup } ) {
    try {
      const [phases] = await connection.query( 'SELECT * FROM fase WHERE id_copa= ? ORDER BY orden;', [idCup] )
      return phases
    } catch ( error ) {
      throw new Error( 'Error getting phases' )
    }
  }

  static async create ( { input } ) {
    const {
      name,
      order,
      idCup
    } = input
    let insertId = null
    try {
      const [response] = await connection.query(
        `INSERT INTO fase (id_copa,nombre,orden)
          VALUES ( ?, ?, ?);`,
        [idCup, name, order]
      )
      if ( response && response.insertId ) {
        insertId = response.insertId
      }
    } catch ( e ) {
      console.log( e.message )
      throw new Error( 'Error creating phase' )
      // enviar la traza a un servicio interno
      // sendLog(e)
    }

    // Verificar si insertId es null o no
    if ( insertId !== null ) {
      const [phase] = await connection.query(
        `SELECT *
        FROM fase WHERE id_fase= ?;`, [insertId]
      )

      if ( phase.length > 0 ) {
        return phase[0]
      } else {
        throw new Error( 'phase not found' )
      }
    } else {
      throw new Error( 'Error inserting phase' )
    }
  }

  static async update ( { idPhase, input } ) {
    const {
      name,
      order,
      idCup
    } = input
    console.log( idPhase, input )
    try {
      const [response] = await connection.query(
        'UPDATE fase SET id_copa = IFNULL(?, id_copa), nombre = IFNULL(?, nombre), orden =IFNULL(?, orden)  WHERE id_fase = ?;',
        [idCup, name, order, idPhase]
      )
      console.log( 'despues del req' )
      if ( response && response.affectedRows > 0 ) {
        const [updatedPhase] = await connection.query(
          'SELECT * FROM fase WHERE id_fase = ?;',
          [idPhase]
        )

        if ( updatedPhase.length > 0 ) {
          return updatedPhase[0]
        } else {
          throw new Error( 'Updated phase not found' )
        }
      } else {
        throw new Error( 'phase update failed' )
      }
    } catch ( e ) {
      console.log( e.message )
      throw new Error( 'Error updating sheet ' )
    }
  }

  static async delete ( { idPhase } ) {
    try {
      const [response] = await connection.query(
        'DELETE FROM fase WHERE id_fase = ?;',
        [idPhase]
      )

      if ( response && response.affectedRows > 0 ) {
        return true
      } else {
        throw new Error( 'Phase not found or already deleted' )
      }
    } catch ( e ) {
      console.log( e.message )
      throw new Error( 'Error deleting phase' )
    }
  }
}
