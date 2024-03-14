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
  static async getAllByZone ( { idZone } ) {
    // TODO ver si zona existe o no
    try {
      const [teams] = await connection.query( 'SELECT * FROM equipo WHERE id_zona = ?;', [idZone] )
      // console.log( response )
      return teams
    } catch ( error ) {
      console.log( error.message )
      throw new Error( 'Error getting teams' )
    }
  }

  static async getAllByCategory ( { idCategory } ) {
    // TODO ver si zona existe o no
    try {
      const [teams] = await connection.query( 'SELECT * FROM equipo JOIN zona  ON equipo.id_zona = zona.id_zona WHERE id_categoria = ?', [idCategory] )
      // console.log( response )
      return teams
    } catch ( error ) {
      console.log( error.message )
      throw new Error( 'Error getting teams' )
    }
  }

  static async getById ( { idTeam } ) {
    try {
      const [team] = await connection.query(
        'SELECT * FROM equipo WHERE id_equipo = ?;', [idTeam] )
      console.log( team )
      if ( team.length === 0 ) return
      console.log( 'desp de return null' )
      return team[0]
    } catch ( error ) {
      console.log( error.message )
      throw new Error( 'Error getting team ' )
    }
  }

  static async create ( { input } ) {
    const {
      name,
      idSeason, photoUrl, idZone
    } = input
    let insertId = null
    try {
      const [response] = await connection.query(
        'INSERT INTO torneo.equipo (nombre, logo_url, id_temporada,id_zona) VALUES (?,IFNULL(?, logo_url),?,?);',
        [name, photoUrl, idSeason, idZone]
      )
      if ( response && response.insertId ) {
        insertId = response.insertId
      }
      console.log( insertId, response )
    } catch ( e ) {
      // puede enviarle información sensible
      console.log( e.message )
      throw new Error( 'Error creating team' )
      // enviar la traza a un servicio interno
      // sendLog(e)
    }

    // Verificar si insertId es null o no
    if ( insertId !== null ) {
      const [team] = await connection.query(
        `SELECT *
        FROM equipo WHERE id_equipo = ?;`, [insertId]
      )

      // Verificar si se encontró algún torneo
      if ( team.length > 0 ) {
        return team[0] // Devolver el torneo encontrado
      } else {
        throw new Error( 'Team not found' ) // Si no se encuentra ningún torneo
      }
    } else {
      throw new Error( 'Error inserting team' ) // Si insertId es null
    }
  }

  static async updateInfo ( { idTeam, input } ) {
    const { name, photoUrl } = input
    // todo controlar si el torneo existe
    try {
      // Realizar la consulta de actualización
      const [response] = await connection.query(
        'UPDATE equipo SET nombre = IFNULL(?, nombre) , logo_url = IFNULL(?, logo_url) WHERE id_equipo = ?;',
        [name, photoUrl, idTeam]
      )
      console.log( response )
      // Verificar si la consulta de actualización fue exitosa
      if ( response && response.affectedRows > 0 ) {
        // Consultar el torneo actualizado
        const [updatedTeam] = await connection.query(
          'SELECT * FROM equipo WHERE id_equipo = ?;',
          [idTeam]
        )

        // Verificar si se encontró el torneo actualizado
        if ( updatedTeam.length > 0 ) {
          return updatedTeam[0] // Devolver el torneo actualizado
        } else {
          throw new Error( 'Updated team not found' ) // Si el torneo actualizado no se encuentra
        }
      } else {
        throw new Error( 'Team update failed' ) // Si la consulta de actualización no afectó ninguna fila
      }
    } catch ( e ) {
      // Puedes manejar el error como mejor convenga a tu aplicación
      console.log( e.message )
      throw new Error( 'Error updating team ' )
    }
  }

  static async updateStatics ( { idTeam, input } ) {
    const { scoredGoals, concededGoals, wonMatches, drawnMatches, lostMatches, points, playedMatches } = input
    // todo controlar si el torneo existe
    try {
      // Realizar la consulta de actualización
      const [response] = await connection.query(
        'UPDATE equipo SET puntos = puntos + IFNULL(?, 0) , goles_favor = goles_favor +IFNULL(?, 0) , goles_contra= goles_contra + IFNULL(?, 0), partidos_ganados = partidos_ganados + IFNULL(?, 0), partidos_empatados = partidos_empatados + IFNULL(?, 0), partidos_perdidos = partidos_perdidos + IFNULL(?, 0), partidos_jugados = partidos_jugados + IFNULL(?, 0)  WHERE id_equipo = ?; ',
        [points, scoredGoals, concededGoals, wonMatches, drawnMatches, lostMatches, playedMatches, idTeam]
      )
      console.log( response )
      // Verificar si la consulta de actualización fue exitosa
      if ( response && response.affectedRows > 0 ) {
        // Consultar el torneo actualizado
        const [updatedTeam] = await connection.query(
          'SELECT * FROM equipo WHERE id_equipo = ?;',
          [idTeam]
        )

        // Verificar si se encontró el torneo actualizado
        if ( updatedTeam.length > 0 ) {
          return updatedTeam[0] // Devolver el torneo actualizado
        } else {
          throw new Error( 'Updated team not found' ) // Si el torneo actualizado no se encuentra
        }
      } else {
        throw new Error( 'Team update failed' ) // Si la consulta de actualización no afectó ninguna fila
      }
    } catch ( e ) {
      // Puedes manejar el error como mejor convenga a tu aplicación
      console.log( e.message )
      throw new Error( 'Error updating team ' )
    }
  }

  static async delete ( { idEquipo } ) {
    try {
      const [response] = await connection.query(
        'DELETE FROM equipo WHERE id_equipo = ?;',
        [idEquipo]
      )

      if ( response && response.affectedRows > 0 ) {
        return true // Devolver verdadero si se eliminó correctamente
      } else {
        throw new Error( 'Team not found or already deleted' ) // Si el torneo no se encuentra o ya ha sido eliminado
      }
    } catch ( e ) {
      console.log( e.message )
      throw new Error( 'Error deleting Team' )
    }
  }
}
