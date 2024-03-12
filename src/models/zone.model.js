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

export class ZoneModel {
  static async getAllByCategory ( { idCategoria } ) {
    console.log( 'getAll' )
    // TODO ver si temporada existe o no
    try {
      const [zones] = await connection.query( 'SELECT * FROM zona WHERE id_categoria= ?;', [idCategoria] )
      // console.log( response )
      return zones
    } catch ( error ) {
      throw new Error( 'Error getting zones' )
    }
  }

  static async create ( { input } ) {
    const {
      name,
      idCategory
    } = input
    let insertId = null
    try {
      const [response] = await connection.query(
        `INSERT INTO zona (nombre, id_categoria)
          VALUES ( ?, ? );`,
        [name, idCategory]
      )
      if ( response && response.insertId ) {
        insertId = response.insertId
      }
      console.log( insertId, response )
    } catch ( e ) {
      // puede enviarle información sensible
      console.log( e.message )
      throw new Error( 'Error creating zone' )
      // enviar la traza a un servicio interno
      // sendLog(e)
    }

    // Verificar si insertId es null o no
    if ( insertId !== null ) {
      const [seasons] = await connection.query(
        `SELECT *
        FROM zona WHERE id_zona = ?;`, [insertId]
      )

      // Verificar si se encontró algún torneo
      if ( seasons.length > 0 ) {
        return seasons[0] // Devolver el torneo encontrado
      } else {
        throw new Error( 'Zone not found' ) // Si no se encuentra ningún torneo
      }
    } else {
      throw new Error( 'Error inserting zone' ) // Si insertId es null
    }
  }

  static async update ( { idZone, input } ) {
    const { name } = input
    // todo controlar si el torneo existe
    try {
      // Realizar la consulta de actualización
      const [response] = await connection.query(
        'UPDATE zona SET nombre = ? WHERE id_zona = ?;',
        [name, idZone]
      )
      console.log( response )
      // Verificar si la consulta de actualización fue exitosa
      if ( response && response.affectedRows > 0 ) {
        // Consultar el torneo actualizado
        const [updatedZone] = await connection.query(
          'SELECT * FROM zona WHERE id_zona = ?;',
          [idZone]
        )

        // Verificar si se encontró el torneo actualizado
        if ( updatedZone.length > 0 ) {
          return updatedZone[0] // Devolver el torneo actualizado
        } else {
          throw new Error( 'Updated zone not found' ) // Si el torneo actualizado no se encuentra
        }
      } else {
        throw new Error( 'Zone update failed' ) // Si la consulta de actualización no afectó ninguna fila
      }
    } catch ( e ) {
      // Puedes manejar el error como mejor convenga a tu aplicación
      console.log( e.message )
      throw new Error( 'Error updating zone ' )
    }
  }

  static async delete ( { idZone } ) {
    try {
      const [response] = await connection.query(
        'DELETE FROM zona WHERE id_zona = ?;',
        [idZone]
      )

      if ( response && response.affectedRows > 0 ) {
        return true // Devolver verdadero si se eliminó correctamente
      } else {
        throw new Error( 'Zone not found or already deleted' ) // Si el torneo no se encuentra o ya ha sido eliminado
      }
    } catch ( e ) {
      console.log( e.message )
      throw new Error( 'Error deleting Zone' )
    }
  }
}
