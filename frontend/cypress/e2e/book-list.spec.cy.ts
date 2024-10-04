describe("Book List", () => {
  it("should display a list of books fetched from the API", () => {
    cy.visit("http://localhost:4200/add");

    // Remplir le formulaire pour ajouter un nouveau livre
    cy.get('input[name="title"]').type("The Catcher in the Rye");
    cy.get('input[name="author"]').type("J.D. Salinger");
    cy.get('input[name="totalCopies"]').type("5");

    // Soumettre le formulaire
    cy.get('button[type="submit"]').click();

    // Vérifier que l'on a été redirigé vers la liste des livres
    cy.url().should("eq", "http://localhost:4200/");
    // on se prépare à intercepter la réponse de l'API
    cy.intercept("GET", "http://localhost:3000/books").as("getBooks");

    // on visite la page
    cy.visit("http://localhost:4200");

    // on attend que l'API interceptée renvoie une réponse
    cy.wait("@getBooks");

    // on vérifie qu'au moins un livre est affiché
    cy.get(".book-item").should("have.length.greaterThan", 0);
  });

  it("will make desapear a deleted book from the list", ()=> {
    //visit the URL
    cy.visit('http://localhost:4200');
    //intercept the delete request
    cy.intercept("DELETE", "http://localhost:3000/books/*").as("deleteBook");
    //retrieve count of "book items"
    cy.get('.book-item').its('length').then((bookCount) => {
      // delete book on click
      cy.get(".delete").last().click();
      //wait beforehaving the api response
      cy.wait("@deleteBook");
      //verify that the book count has decreased
      cy.get('.book-item').its('length').should('be.lt', bookCount);
    });
  });

  it("should decrease the number of available copies when a book is borrowed", ()=> {
    //visit the URL
    cy.visit('http://localhost:4200');
    //intercept the update resquest
    cy.intercept("PUT", "http://localhost:3000/books/*/borrow").as("updateBook")
    //retrieve number of available copies
    cy.get('.available-copies').last().then((availableCopies) => {
      //put in variable the text of available copies
      const availableCopiesNumber = parseInt(availableCopies.text());
      //update available copies by borrowing book
      cy.get('.borrow').last().click();
      //wait before having the api response
      cy.wait("@updateBook");
      //verify that number of available copies decrease
      cy.get('.available-copies').last().then((newAvailableCopies)=> {
        const newAvailableCopiesNumber = parseInt(newAvailableCopies.text());
        expect(newAvailableCopiesNumber).to.be.lt(availableCopiesNumber)
      })
    })
  });
});
