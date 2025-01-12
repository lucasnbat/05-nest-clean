import { Slug } from './slug'

test('it should be able to create a slug', () => {
  const slug = Slug.createFromText('Question about Mars')

  expect(slug.value).toEqual('question-about-mars')
})
