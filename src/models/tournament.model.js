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

export class TournamentModel {
  static async getAll () {
    console.log( 'getAll' )
    const [tournaments] = await connection.query( 'SELECT * FROM torneo' )
    return tournaments
    // 'SELECT id, name FROM genre WHERE LOWER(name) = ?;')
  }

  static async getById ( { id } ) {
    const [torunament] = await connection.query(
      'SELECT * FROM torneo WHERE id_torneo = ?;', [id] )

    if ( torunament.length === 0 ) return null

    return torunament[0]
  }

  static async create ( { input } ) {
    const {
      name,
      phone,
      instagram,
      photoUrl
    } = input

    let insertId = null
    try {
      const [response] = await connection.query(
        `INSERT INTO torneo (nombre, celular, instagram, foto_url)
          VALUES ( ?, ?, ?, ?);`,
        [name, phone, instagram, photoUrl]
      )
      if ( response && response.insertId ) {
        insertId = response.insertId
      }
      console.log( insertId, response )
    } catch ( e ) {
      // puede enviarle información sensible
      throw new Error( 'Error creating tournament' )
      // enviar la traza a un servicio interno
      // sendLog(e)
    }

    // Verificar si insertId es null o no
    if ( insertId !== null ) {
      const [tournaments] = await connection.query(
        `SELECT *
        FROM torneo WHERE id_torneo = ?;`, [insertId]
      )

      // Verificar si se encontró algún torneo
      if ( tournaments.length > 0 ) {
        return tournaments[0] // Devolver el torneo encontrado
      } else {
        throw new Error( 'Tournament not found' ) // Si no se encuentra ningún torneo
      }
    } else {
      throw new Error( 'Error inserting tournament' ) // Si insertId es null
    }
  }

  static async update ( { id, input } ) {
    const { name, phone, instagram, photoUrl } = input

    try {
      // Realizar la consulta de actualización
      const [response] = await connection.query(
        `UPDATE torneo SET nombre = IFNULL(?, nombre),celular = IFNULL(?, celular),
        instagram = IFNULL(?, instagram), foto_url = IFNULL(?, foto_url) WHERE id_torneo = ?;`,
        [name, phone, instagram, photoUrl, id]
      )
      console.log( response )
      // Verificar si la consulta de actualización fue exitosa
      if ( response && response.affectedRows > 0 ) {
        // Consultar el torneo actualizado
        const [updatedTournament] = await connection.query(
          'SELECT * FROM torneo WHERE id_torneo = ?;',
          [id]
        )

        // Verificar si se encontró el torneo actualizado
        if ( updatedTournament.length > 0 ) {
          return updatedTournament[0] // Devolver el torneo actualizado
        } else {
          throw new Error( 'Updated tournament not found' ) // Si el torneo actualizado no se encuentra
        }
      } else {
        throw new Error( 'Tournament update failed' ) // Si la consulta de actualización no afectó ninguna fila
      }
    } catch ( e ) {
      // Puedes manejar el error como mejor convenga a tu aplicación
      console.log( e.message )
      throw new Error( 'Error updating tournament: ' )
    }
  }

  static async delete ( { id } ) {
    try {
      // Realizar la consulta de eliminación
      const [response] = await connection.query(
        'DELETE FROM torneo WHERE id_torneo = ?;',
        [id]
      )

      // Verificar si la consulta de eliminación fue exitosa
      if ( response && response.affectedRows > 0 ) {
        return true // Devolver verdadero si se eliminó correctamente
      } else {
        throw new Error( 'Tournament not found or already deleted' ) // Si el torneo no se encuentra o ya ha sido eliminado
      }
    } catch ( e ) {
      // Puedes manejar el error como mejor convenga a tu aplicación
      throw new Error( 'Error deleting tournament: ' + e.message )
    }
  }

  // static async delete ( { id } ) {
  //   // ejercio fácil: crear el delete
  // }

  // static async update ( { id, input } ) {
  //   // ejercicio fácil: crear el update
  // }
}
