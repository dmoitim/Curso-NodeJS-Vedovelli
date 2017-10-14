const test = require('ava')

const { connection, errorHandler } = require('./setup')

const users = require('../users')({ connection, errorHandler })

const auth = require('../auth')({ connection, errorHandler })

const create = () => users.save('user@test.com', '123456')

// Limpa a tabela antes de cada teste
test.beforeEach(t => connection.query('TRUNCATE TABLE users;'))

// Limpa a tabela após o teste
test.after.always(t => connection.query('TRUNCATE TABLE users;'))

test.serial('Login de usuario - sucesso', async t => {
  await create()
  const result = await auth.authenticate('user@test.com', '123456')
  t.not(result.token, null)
  t.not(result.token.length, 0)
})

test.serial('Login de usuario - falha', async t => {
  await create()
  const result = auth.authenticate('user@test.com', '1234567')
  const error = await t.throws(result)
  t.is(error.error, 'Falha ao realizar o login.')
})
