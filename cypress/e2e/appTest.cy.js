describe("Product Search", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/");
  });

  it("should load the home page and display product cards", () => {
    cy.get("[data-testid=product-card]").should("be.visible");
  });

  it("should allow searching for products by name", () => {
    cy.get("[data-testid=search-input]").type("Quinoa");
    cy.get("[data-testid=product-card]").should("contain", "Quinoa");
  });

  it("should allow searching for products by category", () => {
    cy.get("[data-testid=search-input]").type("Accessories");
    cy.get("[data-category]").each(($productCard) => {
      cy.wrap($productCard)
        .invoke("attr", "data-category")
        .should("contain", "Accessories");
    });
  });

  it("should allow selecting and deselecting products", () => {
    cy.get("[data-testid=toggle-select-button]").first().click();
    cy.get("[data-testid=toggle-select-button]")
      .first()
      .should("have.css", "color", "rgb(255, 0, 0)");
    cy.get("[data-testid=toggle-select-button]").first().click();
    cy.get("[data-testid=toggle-select-button]")
      .first()
      .should("have.css", "color", "rgb(0, 128, 0)");
  });

  it("should display the comparison modal with correct data", () => {
    cy.get("[data-testid=toggle-select-button]").first().click();
    cy.get("[data-testid=toggle-select-button]").eq(1).click();
    cy.get("[data-testid=compare-selected-button]").click();
    cy.get("[data-testid=comparison-modal]").should("be.visible");
    cy.get("[data-testid=comparison-modal-title]").should(
      "contain",
      "Comparison Result"
    );
  });

  it("should have a responsive design", () => {
    cy.viewport(320, 480);
    cy.get("[data-testid=product-card]").should("be.visible");

    cy.viewport(1024, 768);
    cy.get("[data-testid=product-card]").should("be.visible");
  });
});
