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

export class PlayerModel {
  static async getAllByTeam ( { idTeam } ) {
    // TODO ver si equipo existe o no
    try {
      const [players] = await connection.query( 'SELECT * FROM jugador WHERE id_equipo = ?;', [idTeam] )
      return players
    } catch ( error ) {
      console.log( error.message )
      throw new Error( 'Error getting players' )
    }
  }

  static async getById ( { idPlayer } ) {
    try {
      const [jugador] = await connection.query(
        'SELECT * FROM jugador WHERE id_jugador = ?;', [idPlayer] )
      console.log( jugador )
      if ( jugador.length === 0 ) return
      return jugador[0]
    } catch ( error ) {
      console.log( error.message )
      throw new Error( 'Error getting team ' )
    }
  }

  static async create ( { input } ) {
    console.log( 'en crate' )
    const {
      name,
      idTeam
    } = input
    let insertId = null
    try {
      const [response] = await connection.query(
        'INSERT INTO jugador (nombre, id_equipo) VALUES (?,?);',
        [name, idTeam]
      )
      if ( response && response.insertId ) {
        insertId = response.insertId
      }
      console.log( insertId, response )
    } catch ( e ) {
      // puede enviarle información sensible
      console.log( e.message )
      throw new Error( 'Error creating player' )
      // enviar la traza a un servicio interno
      // sendLog(e)
    }

    // Verificar si insertId es null o no
    if ( insertId !== null ) {
      const [player] = await connection.query(
        `SELECT *
        FROM jugador WHERE id_jugador = ?;`, [insertId]
      )

      // Verificar si se encontró algún torneo
      if ( player.length > 0 ) {
        return player[0] // Devolver el torneo encontrado
      } else {
        throw new Error( 'player not found' ) // Si no se encuentra ningún torneo
      }
    } else {
      throw new Error( 'Error inserting player' ) // Si insertId es null
    }
  }

  static async updateInfo ( { idPlayer, input } ) {
    const { name, idTeam } = input
    // todo controlar si el torneo existe
    try {
      // Realizar la consulta de actualización
      const [response] = await connection.query(
        'UPDATE jugador SET nombre = IFNULL(?, nombre), id_equipo = IFNULL(?, id_equipo) WHERE id_jugador = ?;',
        [name, idTeam, idPlayer]
      )
      console.log( response )
      // Verificar si la consulta de actualización fue exitosa
      if ( response && response.affectedRows > 0 ) {
        // Consultar el torneo actualizado
        const [updatedPlayer] = await connection.query(
          'SELECT * FROM jugador WHERE id_jugador = ?;',
          [idPlayer]
        )

        // Verificar si se encontró el torneo actualizado
        if ( updatedPlayer.length > 0 ) {
          return updatedPlayer[0] // Devolver el torneo actualizado
        } else {
          throw new Error( 'Updated player not found' ) // Si el torneo actualizado no se encuentra
        }
      } else {
        throw new Error( 'Player update failed' ) // Si la consulta de actualización no afectó ninguna fila
      }
    } catch ( e ) {
      // Puedes manejar el error como mejor convenga a tu aplicación
      console.log( e.message )
      throw new Error( 'Error updating team ' )
    }
  }

  static async updateStatics ( { idPlayer, input } ) {
    const { goals, yellowCards, redCards } = input
    // todo controlar si el torneo existe
    try {
      // Realizar la consulta de actualización
      const [response] = await connection.query(
        'UPDATE jugador SET goles = goles + IFNULL(?, 0) , tarjetas_amarillas = tarjetas_amarillas +IFNULL(?, 0) , tarjetas_rojas= tarjetas_rojas + IFNULL(?, 0) WHERE id_jugador= ?',
        [goals, yellowCards, redCards, idPlayer]
      )
      console.log( response )
      // Verificar si la consulta de actualización fue exitosa
      if ( response && response.affectedRows > 0 ) {
        // Consultar el torneo actualizado
        const [updatedPlayer] = await connection.query(
          'SELECT * FROM jugador WHERE id_jugador = ?;',
          [idPlayer]
        )

        // Verificar si se encontró el torneo actualizado
        if ( updatedPlayer.length > 0 ) {
          return updatedPlayer[0] // Devolver el torneo actualizado
        } else {
          throw new Error( 'Updated player not found' ) // Si el torneo actualizado no se encuentra
        }
      } else {
        throw new Error( 'Player update failed' ) // Si la consulta de actualización no afectó ninguna fila
      }
    } catch ( e ) {
      // Puedes manejar el error como mejor convenga a tu aplicación
      console.log( e.message )
      throw new Error( 'Error updating player ' )
    }
  }

  static async delete ( { idPlayer } ) {
    try {
      const [response] = await connection.query(
        'DELETE FROM jugador WHERE id_jugador = ?;',
        [idPlayer]
      )

      if ( response && response.affectedRows > 0 ) {
        return true // Devolver verdadero si se eliminó correctamente
      } else {
        throw new Error( 'Player not found or already deleted' ) // Si el torneo no se encuentra o ya ha sido eliminado
      }
    } catch ( e ) {
      console.log( e.message )
      throw new Error( 'Error deleting Player' )
    }
  }
}
