const sha1 = require('sha1')
const jwt = require('jsonwebtoken')

const auth = deps => {
  return {
    authenticate: (email, password) => {
      return new Promise((resolve, reject) => {
        const { connection, errorHandler } = deps

        const queryString = 'SELECT id, email FROM users WHERE email = ? AND password = ?;'
        const queryData = [email, sha1(password)]

        connection.query(queryString, queryData, (error, result) => {
          if (error || parseInt(result.length) === 0) {
            errorHandler(error, 'Falha ao realizar o login.', reject)
            return false
          }

          const { email, id } = result[0]
          const token = jwt.sign({email, id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24}) // token de 24 horas

          resolve({ token })
        })
      })
    }
  }
}

module.exports = auth
