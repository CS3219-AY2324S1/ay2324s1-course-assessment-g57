describe('The Profile Page', () => {
    it("displays the current user's information", () => {
        // Get necessary environment variables.
        const testUsername = 'danielTestUser';
        const testEmail = Cypress.env('testEmail');

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

        // Check that we can access the profile page.
        cy.get("a[href*='profile']").should('be.visible').click();

        cy.intercept('api/users/*', { times: 2 }, () => {}).as('getProfile');

        cy.url().should('include', 'profile');

        cy.wait(['@getProfile', '@getProfile'], { timeout: 10000 });

        // Check that the user's information is displayed correctly.
        cy.get('div[class=columns] > div[class=column]')
            .eq(1)
            .within(() => {
                cy.contains(testUsername, { matchCase: false }).should(
                    'be.visible'
                );
                cy.contains(testEmail, { matchCase: false }).should(
                    'be.visible'
                );
            });

        // Navigate back to the dashboard and then log the user out.
        cy.get("a[href*='dashboard']").should('be.visible').click();

        cy.url().should('include', 'dashboard');

        cy.get('a[href*=logout]').click();

        cy.getCookie('appSession').should('not.exist');
    });

    it('allows the current user to edit their display name and delete their account', () => {
        // Get necessary environment variables.
        const testUsername = 'danielTestUser';
        const testUsername2 = testUsername + '2';

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

        // Check that we can access the profile page.
        cy.get("a[href*='profile']").should('be.visible').click();

        cy.intercept('api/users/*', { times: 2 }, () => {}).as('getProfile');

        cy.url().should('include', 'profile');

        cy.wait(['@getProfile', '@getProfile'], { timeout: 10000 });

        // Check that the display name is correct.
        cy.get('div[class=columns] > div[class=column]')
            .eq(1)
            .within(() => {
                cy.contains(testUsername, { matchCase: false }).should(
                    'be.visible'
                );
            });

        // Edit the current user's display name.
        cy.get("button[class='button is-primary']")
            .should('be.visible')
            .click();

        cy.get('input[id=displayName]').clear().type(`${testUsername2}`);

        cy.get(
            "footer[class='chakra-modal__footer css-k0waxj'] > button[class='button is-primary']"
        ).click();

        cy.get(
            "div[class='chakra-modal__content-container css-1xisyp4']"
        ).should('not.exist');

        // Check that the display name is updated.
        cy.get('div[class=columns] > div[class=column]')
            .eq(1)
            .within(() => {
                cy.contains(testUsername2, { matchCase: false }).should(
                    'be.visible'
                );
            });

        // Change the display name back.
        cy.get("button[class='button is-primary']")
            .should('be.visible')
            .click();

        cy.get('input[id=displayName]').clear().type(`${testUsername}`);

        cy.get(
            "footer[class='chakra-modal__footer css-k0waxj'] > button[class='button is-primary']"
        ).click();

        cy.get(
            "div[class='chakra-modal__content-container css-1xisyp4']"
        ).should('not.exist');

        // Check that there is an option for users to delete their account.
        cy.get("button[class='button is-pulled-right is-danger']").should(
            'be.visible'
        );

        // Navigate back to the dashboard and then log the user out.
        cy.get("a[href*='dashboard']").should('be.visible').click();

        cy.url().should('include', 'dashboard');

        cy.get('a[href*=logout]').click();

        cy.getCookie('appSession').should('not.exist');
    });
});
