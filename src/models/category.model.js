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

export class CategoryModel {
  static async getAllBySeason ( { idTemporada } ) {
    console.log( 'getAll' )
    // TODO ver si temporada existe o no
    try {
      const [categories] = await connection.query( 'SELECT * FROM categoria WHERE id_temporada = ?;', [idTemporada] )
      // console.log( response )
      return categories
    } catch ( error ) {
      console.log( error.message )
      throw new Error( 'Error getting categories' )
    }
  }

  // static async getById ( { id } ) {
  //   const [torunament] = await connection.query(
  //     'SELECT * FROM torneo WHERE id_torneo = ?;', [id] )

  //   if ( torunament.length === 0 ) return null

  //   return torunament[0]
  // }

  static async create ( { input } ) {
    const {
      name,
      idTournament,
      startDate
    } = input
    console.log( startDate )
    let insertId = null
    try {
      const [response] = await connection.query(
        `INSERT INTO temporada (nombre, id_torneo, fecha_inicio)
          VALUES ( ?, ?, ?);`,
        [name, idTournament, startDate]
      )
      if ( response && response.insertId ) {
        insertId = response.insertId
      }
      console.log( insertId, response )
    } catch ( e ) {
      // puede enviarle información sensible
      console.log( e.message )
      throw new Error( 'Error creating season' )
      // enviar la traza a un servicio interno
      // sendLog(e)
    }

    // Verificar si insertId es null o no
    if ( insertId !== null ) {
      const [seasons] = await connection.query(
        `SELECT *
        FROM temporada WHERE id_temporada = ?;`, [insertId]
      )

      // Verificar si se encontró algún torneo
      if ( seasons.length > 0 ) {
        return seasons[0] // Devolver el torneo encontrado
      } else {
        throw new Error( 'season not found' ) // Si no se encuentra ningún torneo
      }
    } else {
      throw new Error( 'Error inserting season' ) // Si insertId es null
    }
  }

  static async update ( { id, input } ) {
    const { name } = input
    // todo controlar si el torneo existe
    try {
      // Realizar la consulta de actualización
      const [response] = await connection.query(
        'UPDATE temporada SET nombre = ? WHERE id_temporada = ?;',
        [name, id]
      )
      console.log( response )
      // Verificar si la consulta de actualización fue exitosa
      if ( response && response.affectedRows > 0 ) {
        // Consultar el torneo actualizado
        const [updatedTournament] = await connection.query(
          'SELECT * FROM temporada WHERE id_temporada = ?;',
          [id]
        )

        // Verificar si se encontró el torneo actualizado
        if ( updatedTournament.length > 0 ) {
          return updatedTournament[0] // Devolver el torneo actualizado
        } else {
          throw new Error( 'Updated season not found' ) // Si el torneo actualizado no se encuentra
        }
      } else {
        throw new Error( 'season update failed' ) // Si la consulta de actualización no afectó ninguna fila
      }
    } catch ( e ) {
      // Puedes manejar el error como mejor convenga a tu aplicación
      console.log( e.message )
      throw new Error( 'Error updating tournament: ' )
    }
  }

  static async delete ( { id } ) {
    try {
      const [response] = await connection.query(
        'DELETE FROM temporada WHERE id_temporada = ?;',
        [id]
      )

      if ( response && response.affectedRows > 0 ) {
        return true // Devolver verdadero si se eliminó correctamente
      } else {
        throw new Error( 'Season not found or already deleted' ) // Si el torneo no se encuentra o ya ha sido eliminado
      }
    } catch ( e ) {
      console.log( e.message )
      throw new Error( 'Error deleting season' )
    }
  }
}
