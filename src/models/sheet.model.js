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

export class SheetModel {
  static async getAllByMatch ( { idMatch } ) {
    try {
      const [sheets] = await connection.query( 'SELECT * FROM ficha WHERE id_partido= ?;', [idMatch] )
      return sheets
    } catch ( error ) {
      throw new Error( 'Error getting sheets' )
    }
  }

  static async create ( { input } ) {
    const {
      idMatch,
      idPlayer,
      type,
      time,
      minute
    } = input
    let insertId = null
    try {
      const [response] = await connection.query(
        `INSERT INTO ficha (id_jugador, id_partido,tipo,tiempo,minuto)
          VALUES ( ?, ?, ?, ? ,? );`,
        [idPlayer, idMatch, type, time, minute]
      )
      if ( response && response.insertId ) {
        insertId = response.insertId
      }
    } catch ( e ) {
      console.log( e.message )
      throw new Error( 'Error creating sheet' )
      // enviar la traza a un servicio interno
      // sendLog(e)
    }

    // Verificar si insertId es null o no
    if ( insertId !== null ) {
      const [sheet] = await connection.query(
        `SELECT *
        FROM ficha WHERE id_ficha = ?;`, [insertId]
      )

      if ( sheet.length > 0 ) {
        return sheet[0]
      } else {
        throw new Error( 'Sheet not found' )
      }
    } else {
      throw new Error( 'Error inserting sheet' )
    }
  }

  static async update ( { idSheet, input } ) {
    const {
      idPlayer,
      type,
      time,
      minute
    } = input
    // todo controlar si el torneo existe
    try {
      const [response] = await connection.query(
        'UPDATE ficha SET id_jugador = IFNULL(?, id_jugador), tipo = IFNULL(?, tipo), tiempo =IFNULL(?, tiempo) , minuto =IFNULL(?, minuto)  WHERE id_ficha = ?;',
        [idPlayer, type, time, minute, idSheet]
      )
      if ( response && response.affectedRows > 0 ) {
        const [updatedSheet] = await connection.query(
          'SELECT * FROM ficha WHERE id_ficha = ?;',
          [idSheet]
        )

        if ( updatedSheet.length > 0 ) {
          return updatedSheet[0]
        } else {
          throw new Error( 'Updated sheet not found' )
        }
      } else {
        throw new Error( 'sheet update failed' )
      }
    } catch ( e ) {
      console.log( e.message )
      throw new Error( 'Error updating sheet ' )
    }
  }

  static async delete ( { idSheet } ) {
    try {
      const [response] = await connection.query(
        'DELETE FROM ficha WHERE id_ficha = ?;',
        [idSheet]
      )

      if ( response && response.affectedRows > 0 ) {
        return true
      } else {
        throw new Error( 'Shet not found or already deleted' )
      }
    } catch ( e ) {
      console.log( e.message )
      throw new Error( 'Error deleting sheet' )
    }
  }
}
