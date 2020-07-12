describe('First load of the site', () => {
  it('The main authorize link shows up', () => {
    cy.visit('/')
    cy.get('.main__authorize').should('be.visible')
  })

  it('The page loads the first 25 results', () => {
    cy.server()
    cy.route({
      method: 'GET',
      url: '/api/v1/access_token',
      response: {"access_token": "191918369328-lsnD6I2oGqNct_0ccUwpGYTTkzk", "token_type": "bearer", "expires_in": 3600, "scope": "read save"}
    })

    cy.fixture('entries.json').as('entriesJSON')
    cy.route({
      method: 'GET',
      url: '/top?limit=100',
      response: '@entriesJSON'
    })

    cy.visit('/?state=random&code=8yoGLfrpUmEW2WLNZVaEoBIjPlo')

    cy.get('.entries__sidebar .entry').should('have.length', 25)
  })

  it('The page loads the first result as the selected one', () => {
    cy.server()
    cy.route({
      method: 'GET',
      url: '/api/v1/access_token',
      response: {"access_token": "191918369328-lsnD6I2oGqNct_0ccUwpGYTTkzk", "token_type": "bearer", "expires_in": 3600, "scope": "read save"}
    })

    cy.fixture('entries.json').as('entriesJSON')
    cy.route({
      method: 'GET',
      url: '/top?limit=100',
      response: '@entriesJSON'
    })

    cy.visit('/?state=random&code=8yoGLfrpUmEW2WLNZVaEoBIjPlo')

    const firstEntry = cy.get('.entries__sidebar .entry').first()
    firstEntry.should('have.class', 'entry__selected')
    firstEntry.find('.entry__content-wrapper').first().should('not.have.class', 'unread')

    firstEntry.find('.entry__title').first().then(($el) => {
      cy.get('.entries__selected-entry .entry').first().find('.entry__title').first().contains($el.text().trim())
    })

  })
})

describe('Click behaviours on the page', () => {
  it('When selecting an entry the selected panel changes', () => {
    cy.server()
    cy.route({
      method: 'GET',
      url: '/api/v1/access_token',
      response: {"access_token": "191918369328-lsnD6I2oGqNct_0ccUwpGYTTkzk", "token_type": "bearer", "expires_in": 3600, "scope": "read save"}
    })

    cy.fixture('entries.json').as('entriesJSON')
    cy.route({
      method: 'GET',
      url: '/top?limit=100',
      response: '@entriesJSON'
    })

    cy.visit('/?state=random&code=8yoGLfrpUmEW2WLNZVaEoBIjPlo')

    // first check that the selected entry is the first one
    const firstEntry = cy.get('.entries__sidebar .entry').first()
    firstEntry.should('not.have.class', 'unread')
    firstEntry.find('.entry__content-wrapper').first().should('not.have.class', 'unread')
    firstEntry.find('.entry__title').first().then(($el) => {
      cy.get('.entries__selected-entry .entry').first().find('.entry__title').first().contains($el.text().trim())
    })

    // now check that on click the selected entry changes
    let lastEntry = cy.get('.entries__sidebar .entry').last()

    // check it's not selected and read
    lastEntry.should('not.have.class', 'entry__selected')
    lastEntry.find('.entry__content-wrapper').first().should('have.class', 'unread')

    lastEntry = cy.get('.entries__sidebar .entry').last()

    lastEntry.click()

    lastEntry.should('have.class', 'entry__selected')
    lastEntry.find('.entry__content-wrapper').first().should('not.have.class', 'unread')
    firstEntry.find('.entry__title').first().then(($el) => {
      cy.get('.entries__selected-entry .entry').first().find('.entry__title').first().contains($el.text().trim())
    })
  })
})