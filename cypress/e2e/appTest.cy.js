describe('Product Search', () => {
  beforeEach(() => {
    cy.visit('/shop')
  })

  it('should load the catalog and display product cards', () => {
    cy.get('[data-testid=product-card]').should('have.length.greaterThan', 0)
  })

  it('should allow searching for products by name', () => {
    cy.get('[data-testid=search-input]').type('Quinoa')
    cy.get('[data-testid=product-card]').should('contain', 'Quinoa')
  })

  it('should filter product cards by category when searching', () => {
    cy.get('[data-testid=search-input]').type('Accessories')
    cy.get('[data-testid=product-card]').each(($card) => {
      cy.wrap($card)
        .invoke('attr', 'data-category')
        .should('eq', 'Accessories')
    })
  })

  it('should allow selecting a product for comparison', () => {
    cy.get('[data-testid=toggle-select-button]').first().click()
    cy.get('[data-testid=product-card]').first().should('have.class', 'border-brand')
  })

  it('should display the comparison modal when two products are selected', () => {
    cy.get('[data-testid=toggle-select-button]').first().click()
    cy.get('[data-testid=toggle-select-button]').eq(1).click()
    cy.get('[data-testid=compare-selected-button]').click()
    cy.get('[data-testid=comparison-modal]').should('be.visible')
    cy.get('[data-testid=comparison-modal-title]').should('contain', 'Comparison Result')
  })

  it('should display product cards on mobile viewports', () => {
    cy.viewport(375, 812)
    cy.get('[data-testid=product-card]').should('have.length.greaterThan', 0)

    cy.viewport(375, 667)
    cy.get('[data-testid=product-card]').should('have.length.greaterThan', 0)
  })
})
