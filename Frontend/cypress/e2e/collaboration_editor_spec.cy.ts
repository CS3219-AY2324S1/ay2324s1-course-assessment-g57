describe('The Use of the Editor', () => {
    it('allows a user to use the code editor in the collaboration space', () => {
        cy.visit('');

        cy.intercept('https://dev-r67hrnstb5x4ekjv.us.auth0.com/*').as(
            'getAuth'
        );

        cy.get("a[href*='auth']").click();

        cy.wait('@getAuth');

        // Log the user in.
        cy.origin('https://dev-r67hrnstb5x4ekjv.us.auth0.com/*', () => {
            const testUsername = Cypress.env('testUsername');
            const testPassword = Cypress.env('testPassword');

            // Valid Username and Password.
            cy.get('input[name=username]').type(testUsername);
            cy.get('input[name=password]').type(`${testPassword}{enter}`);
        });

        // Check that we are back on the Peerprep page.
        cy.url().should('include', 'http://localhost:3000');
        cy.getCookie('appSession').should('exist');

        // Navigate the user to the collaboration page.
        cy.get("a[href*='code']").click();

        // Check that the code editor is displayed.
        cy.get("div[class='editor']", { timeout: 10000 }).should('be.visible');

        // Check that a user can toggle between the dark and light modes.
        cy.get(
            "div[class='monaco-editor no-user-select mac  showUnused showDeprecated vs']"
        ).should('be.visible');
        cy.get("label[class='chakra-switch css-1gmw4cr']")
            .should('be.visible')
            .click();
        cy.get(
            "div[class='monaco-editor no-user-select mac  showUnused showDeprecated vs-dark']"
        ).should('be.visible');
        cy.get("label[class='chakra-switch css-1gmw4cr']")
            .should('be.visible')
            .click();
        cy.get(
            "div[class='monaco-editor no-user-select mac  showUnused showDeprecated vs']"
        ).should('be.visible');

        // Check that a user is able to switch between languages.
        cy.get('option').should('contain', 'Python');
        cy.get("select[class='chakra-select css-161pkch']")
            .should('be.visible')
            .select('Kotlin');
        cy.get('option').should('contain', 'Kotlin');
        cy.get("select[class='chakra-select css-161pkch']").select('Python');

        // Check that there is a Submit Code button for users to submit code written.
        cy.get("button[class='chakra-button css-1ahd3gj'").should('be.visible');

        // Check that the code editor is displayed to the user and that they can type on it.
        cy.get("div[class='editor']", { timeout: 10000 })
            .should('be.visible')
            .click()
            .focused()
            .type("print('hello world')");

        // Check that what the user has typed is displayed in the code editor.
        cy.get('div[class=view-line]')
            .should('be.visible')
            .should('contain', 'print');

        // Check that the user can submit the code and that the result is printed to the terminal.
        cy.intercept('http://34.70.59.59/submissions/*').as('runCode');
        cy.get("button[class='chakra-button css-1ahd3gj'").click();
        cy.wait('@runCode');
        cy.get('textarea').should('contain', 'hello world');

        // Leave the room.
        cy.get("a[href*='/']").should('exist').click();

        // Logout and check that there is no more cookie.
        cy.get('a[href*=logout]').click();

        cy.getCookie('appSession').should('not.exist');
    });
});
