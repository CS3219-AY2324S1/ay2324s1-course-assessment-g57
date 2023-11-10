describe('The Matching Process', () => {
    it('allows the current user to select some difficulty level and carry out matching process', () => {
        // Log the user in.
        cy.visit('');

        cy.intercept('https://dev-r67hrnstb5x4ekjv.us.auth0.com/*').as(
            'getAuth'
        );

        cy.get("a[href*='auth'][class='button is-light']").click();

        cy.wait('@getAuth');

        cy.origin('https://dev-r67hrnstb5x4ekjv.us.auth0.com/*', () => {
            const testUsername = Cypress.env('testUsername');
            const testPassword = Cypress.env('testPassword');

            // Valid Username and Password.
            cy.get('input[name=username]').type(testUsername);
            cy.get('input[name=password]').type(`${testPassword}{enter}`);
        });

        cy.url().should('include', 'dashboard');

        cy.get("p[class='is-size-3']")
            .should('be.visible')
            .contains('danieltestuser', { matchCase: false });

        cy.get('table').should('be.visible');

        cy.getCookie('appSession').should('exist');

        // Check that the connect and disconnect buttons are visible.
        cy.get("button[class='button']")
            .contains('Connect')
            .should('contain', 'Connect')
            .should('be.visible');
        cy.get("button[class='button']")
            .contains('Disconnect')
            .should('contain', 'Disconnect')
            .should('be.visible');

        // Check that a user is able to switch the difficulty level and that the difficulty switch exists.
        cy.get("select[id='difficulty'] > option").should('contain', 'Easy');
        cy.get("select[id='difficulty']").should('be.visible').select('Medium');
        cy.get("select[id='difficulty'] > option").should('contain', 'Medium');
        cy.get("select[id='difficulty']").select('Easy');

        // Check that a user has no client ID.
        cy.get("div[class='container'] > h1")
            .contains('Client ID')
            .should('have.text', 'Client ID:  ');

        // On start matching, check that a user has a client ID and that the difficulty switch no longer exists.
        // And check that the there is a countdown timer.
        cy.get("button[class='button']").contains('Connect').click();

        cy.get("div[class='container'] > h1")
            .contains('Client ID')
            .should('not.have.text', 'Client ID:  ');
        cy.get("select[id='difficulty']").should('not.exist');
        cy.get("div[class='container'] > div > h2").should('exist');

        // On stop matching, check that a user no longer has a client ID and the switch difficult exists.
        cy.get("button[class='button']").contains('Disconnect').click();

        cy.get("div[class='container'] > h1")
            .contains('Client ID')
            .should('have.text', 'Client ID:  ');
        cy.get("select[id='difficulty']").should('exist');

        // Log the user out.
        cy.get('a[href*=logout]').click();

        cy.getCookie('appSession').should('not.exist');
    });
});
