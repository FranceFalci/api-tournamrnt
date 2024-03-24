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

export class CupModel {
  static async getAllByCategory ( { idCategory } ) {
    try {
      const [cups] = await connection.query( 'SELECT * FROM copa WHERE id_categoria= ? ORDER BY orden;', [idCategory] )
      return cups
    } catch ( error ) {
      throw new Error( 'Error getting cups' )
    }
  }

  static async create ( { input } ) {
    const {
      type,
      order,
      idCategory
    } = input
    let insertId = null
    try {
      const [response] = await connection.query(
        `INSERT INTO copa (id_categoria,tipo,orden)
          VALUES ( ?, ?, ?);`,
        [idCategory, type, order]
      )
      if ( response && response.insertId ) {
        insertId = response.insertId
      }
    } catch ( e ) {
      console.log( e.message )
      throw new Error( 'Error creating cup' )
      // enviar la traza a un servicio interno
      // sendLog(e)
    }

    // Verificar si insertId es null o no
    if ( insertId !== null ) {
      const [cup] = await connection.query(
        `SELECT *
        FROM copa WHERE id_copa = ?;`, [insertId]
      )

      if ( cup.length > 0 ) {
        return cup[0]
      } else {
        throw new Error( 'cup not found' )
      }
    } else {
      throw new Error( 'Error inserting cup' )
    }
  }

  static async update ( { idCup, input } ) {
    const {
      type,
      order,
      idCategory
    } = input
    console.log( idCup, input )
    try {
      const [response] = await connection.query(
        'UPDATE copa SET id_categoria = IFNULL(?, id_categoria), tipo = IFNULL(?, tipo), orden =IFNULL(?, orden)  WHERE id_copa = ?;',
        [idCategory, type, order, idCup]
      )
      console.log( 'despues del req' )
      if ( response && response.affectedRows > 0 ) {
        const [updatedCup] = await connection.query(
          'SELECT * FROM copa WHERE id_copa = ?;',
          [idCup]
        )

        if ( updatedCup.length > 0 ) {
          return updatedCup[0]
        } else {
          throw new Error( 'Updated cup not found' )
        }
      } else {
        throw new Error( 'cup update failed' )
      }
    } catch ( e ) {
      console.log( e.message )
      throw new Error( 'Error updating sheet ' )
    }
  }

  static async delete ( { idCup } ) {
    try {
      const [response] = await connection.query(
        'DELETE FROM copa WHERE id_copa = ?;',
        [idCup]
      )

      if ( response && response.affectedRows > 0 ) {
        return true
      } else {
        throw new Error( 'Cup not found or already deleted' )
      }
    } catch ( e ) {
      console.log( e.message )
      throw new Error( 'Error deleting cup' )
    }
  }
}
