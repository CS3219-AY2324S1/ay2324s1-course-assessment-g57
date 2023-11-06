describe("The Use of the Video Call", () => {
    it("allows a user to use the video call function in the collaboration space", () => {
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

        // Check that the video service can be accessed from the collaboration page and that users
        // can get a token for the video chat.
        cy.intercept("https://34k0nfj43f.execute-api.ap-southeast-1.amazonaws.com/dev/*").as("getToken");
        cy.get("button[class='button is-link'", { timeout: 10000 }).should("be.visible");
        cy.wait("@getToken").then((intercept) => expect(intercept?.response).to.exist)

        // Leave the room.
        cy.get("a[href*='/']").should("exist").click();

        // Logout and check that there is no more cookie.
        cy.get("a[href*=logout]").click();
  
        cy.getCookie('appSession').should('not.exist');
    });
})
