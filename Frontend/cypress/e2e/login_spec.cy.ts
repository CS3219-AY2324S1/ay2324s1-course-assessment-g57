describe('The Login Process', () => {
    it('sets an auth cookie and when logging in via form submission', () => {
        cy.visit('');

        cy.intercept('https://dev-r67hrnstb5x4ekjv.us.auth0.com/*').as(
            'getAuth'
        );

        cy.get("a[href*='auth']").click();

        cy.wait('@getAuth');

        cy.origin('https://dev-r67hrnstb5x4ekjv.us.auth0.com/*', () => {
            const testUsername = Cypress.env('testUsername');
            const testPassword = Cypress.env('testPassword');

            // Valid Username and Password.
            cy.get('input[name=username]').type(testUsername);
            cy.get('input[name=password]').type(`${testPassword}{enter}`);
        });

        cy.url().should('include', 'http://localhost:3000');

        cy.getCookie('appSession').should('exist');

        cy.get('a[href*=logout]').click();

        cy.getCookie('appSession').should('not.exist');
    });
});
