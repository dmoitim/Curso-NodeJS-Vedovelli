const test = require('ava')

const { connection, errorHandler } = require('./setup')

const categories = require('../categories')({ connection, errorHandler })

const create = () => categories.save('category-test')

// Limpa a tabela antes de cada teste
test.beforeEach(t => connection.query('TRUNCATE TABLE categories;'))

// Limpa a tabela após o teste
test.after.always(t => connection.query('TRUNCATE TABLE categories;'))

test.serial('Lista de categorias', async t => {
  await create()
  const result = await categories.all()
  t.is(result.categories.length, 1)
  t.is(result.categories[0].name, 'category-test')
})

test.serial('Criacao de categoria', async t => {
  const result = await create()
  t.is(result.category.name, 'category-test')
})

test.serial('Atualizacao de categoria', async t => {
  await create()
  const result = await categories.update(1, 'category-test-updated')
  t.is(result.category.name, 'category-test-updated')
  t.is(result.affectedRows, 1)
})

test.serial('Exclusao de categoria', async t => {
  await create()
  const result = await categories.del(1)
  t.is(result.affectedRows, 1)
})
