describe('User Forgets their Password', () => {
    it('has a page for users to change their password via email for their set username', () => {
        cy.visit('');

        cy.intercept('https://dev-r67hrnstb5x4ekjv.us.auth0.com/*').as(
            'getAuth'
        );

        cy.get("a[href*='auth']").click();

        cy.wait('@getAuth');

        cy.origin('https://dev-r67hrnstb5x4ekjv.us.auth0.com/*', () => {
            const testInvalidUsername = Cypress.env('testInvalidUsername');

            cy.get("a[href*='reset-password']").click();

            // Check that you are on the password change page.
            cy.get('header').should('contain', 'Forgot Your Password');

            cy.get('input[name=email]').type(`${testInvalidUsername}{enter}`);

            // Check that the user has had an email sent to them and that they can request to resent the email if desired.
            cy.get('h1').should('contain', 'Check Your Email');
            cy.get('button[type=submit]')
                .should('exist')
                .should('contain', 'Resend email')
                .click();

            // Check that the user is redirected to the password change page where they can enter their details to change password.
            cy.get('header').should('contain', 'Forgot Your Password');

            cy.get('input[name=email]').should('exist');

            cy.get("a[href*='login']").click();

            // Check that the user is redirected to the login page.
            cy.get('header').should('contain', 'Log in');
        });
    });
});
