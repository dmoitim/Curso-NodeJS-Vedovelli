const test = require('ava')

const { connection, errorHandler } = require('./setup')

const users = require('../users')({ connection, errorHandler })

const create = () => users.save('user@test.com', '123456')

// Limpa a tabela antes de cada teste
test.beforeEach(t => connection.query('TRUNCATE TABLE users;'))

// Limpa a tabela após o teste
test.after.always(t => connection.query('TRUNCATE TABLE users;'))

test('Lista de usuarios', async t => {
  await create()
  const result = await users.all()
  t.is(result.users.length, 1)
  t.is(result.users[0].email, 'user@test.com')
})

test('Criacao de usuario', async t => {
  const result = await create()
  t.is(result.user.email, 'user@test.com')
})

test('Atualizacao de usuario', async t => {
  await create()
  const result = await users.update(1, '1234567')
  t.is(result.affectedRows, 1)
})

test('Exclusao de usuario', async t => {
  await create()
  const result = await users.del(1)
  t.is(result.affectedRows, 1)
})
