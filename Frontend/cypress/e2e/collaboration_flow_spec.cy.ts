describe("The Collaboration Flow", () => {
    it("allows a user to login, enter the collaboration space and then log out smoothly", () => {
        cy.visit('')
        
        cy.intercept('https://dev-r67hrnstb5x4ekjv.us.auth0.com/*').as("getAuth");
        
        cy.get("a[href*='auth']").click();
        
        cy.wait("@getAuth");
        
        // Log the user in.
        cy.origin('https://dev-r67hrnstb5x4ekjv.us.auth0.com/*', () => {
            const testUsername = Cypress.env("testUsername");
            const testPassword = Cypress.env("testPassword");
            
            // Valid Username and Password.
            cy.get("input[name=username]").type(testUsername);
            cy.get("input[name=password]").type(`${testPassword}{enter}`);
        });

        // Check that we are back on the Peerprep page.
        cy.url().should('include', 'http://localhost:3000');
        cy.getCookie('appSession').should('exist');

        // Navigate the user to the collaboration page.
        cy.get("a[href*='code']").click();
        
        // Check that a question is displayed to the user.
        cy.get("div[class=content]").should("be.visible");

        // Check that the video service can be accessed from the collaboration page.
        cy.get("button[class='button is-link'", { timeout: 10000 }).should("be.visible");

        // Check that the code editor is displayed to the user and that they can type on it.
        cy.get("div[class='editor']", { timeout: 10000 })
            .should("be.visible")
            .click()
            .focused()
            .type("print 'hello world'");
        
        cy.get("div[class=view-line]").should("be.visible").should("contain", "print");

        // Check that there is a leave room button and leave the room.
        cy.get("a[href*='/']").should("exist").click();

        // Then logout and check that there is no more cookie.
        cy.get("a[href*=logout]").click();
  
        cy.getCookie('appSession').should('not.exist');
    })
})
