describe('Login Process Error Handling', () => {
    it('has sufficient error handling for a user making mistakes trying to log in', () => {
        cy.visit('');

        cy.intercept('https://dev-r67hrnstb5x4ekjv.us.auth0.com/*').as(
            'getAuth'
        );

        cy.get("a[href*='auth'][class='button is-light']").click();

        cy.wait('@getAuth');

        cy.origin('https://dev-r67hrnstb5x4ekjv.us.auth0.com/*', () => {
            const testUsername = Cypress.env('testUsername');
            const testPassword = Cypress.env('testPassword');
            const testEmail = Cypress.env('testEmail');
            const testInvalidUsername = Cypress.env('testInvalidUsername');
            const testInvalidPassword = Cypress.env('testInvalidPassword');
            const testInvalidEmail = Cypress.env('testInvalidEmail');

            // Check that you are on the login page.
            cy.get('header').should('contain', 'Log in');

            // Invalid Username, gives proper error handling message.
            cy.get('input[name=username]').type(testInvalidUsername);
            cy.get('input[name=password]').type(`${testPassword}{enter}`);
            cy.get('span[id=error-element-password]')
                .should('exist')
                .should('contain', 'username');
            cy.get('input[name=username]').clear();
            cy.get('input[name=password]').clear();

            // Invalid Email, gives proper error handling message.
            cy.get('input[name=username]').type(testInvalidEmail);
            cy.get('input[name=password]').type(`${testPassword}{enter}`);
            cy.get('span[id=error-element-password]')
                .should('exist')
                .should('contain', 'username');
            cy.get('input[name=username]').clear();
            cy.get('input[name=password]').clear();

            // Invalid Password, gives proper error handling message.
            cy.get('input[name=username]').type(testUsername);
            cy.get('input[name=password]').type(
                `${testInvalidPassword}{enter}`
            );
            cy.get('span[id=error-element-password]')
                .should('exist')
                .should('contain', 'password');
            cy.get('input[name=username]').clear();
            cy.get('input[name=password]').clear();

            // Valid Username and Password.
            cy.get('input[name=username]').type(testEmail);
            cy.get('input[name=password]').type(`${testPassword}{enter}`);
        });

        cy.url().should('include', 'dashboard');

        cy.get("p[class='is-size-3']").should("be.visible").should("contain", "danieltestuser");

        cy.get("table").should("be.visible");

        cy.getCookie('appSession').should('exist');

        cy.get('a[href*=logout]').click();

        cy.getCookie('appSession').should('not.exist');
    });
});
