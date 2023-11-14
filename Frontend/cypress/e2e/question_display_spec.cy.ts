describe('The Question Display', () => {
    it('displays the questions database and shows the questions that are available', () => {
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

        // Add the intercept and wait as required.
        // cy.intercept('/api/questions*', { times: 2 }, () => {}).as(
        //     'getQuestions'
        // );

        cy.url().should('include', 'dashboard');

        cy.get("p[class='is-size-3']")
            .should('be.visible')
            .contains('danieltestuser', { matchCase: false });

        cy.get('table').should('be.visible');

        // cy.wait(['@getQuestions', '@getQuestions']);

        cy.getCookie('appSession').should('exist');

        // Check that there is a button for the user to add a question and try adding a question.
        // cy.get(
        //     "div[class='table-container'] > button[class='button is-link is-pulled-right']"
        // )
        //     .should('be.visible')
        //     .should('contain', 'Add question')
        //     .click();

        // cy.get(
        //     "footer[class='chakra-modal__footer css-k0waxj'] > button[class='button is-outlined']"
        // )
        //     .contains('Close')
        //     .should('contain', 'Close')
        //     .click();

        // cy.get(
        //     "div[class='chakra-modal__content-container css-1xisyp4']"
        // ).should('not.exist');

        // Check that the first question has title, category, complexity as required.
        // And check that it has a view details button and open the modal to view details.
        cy.get('table > tbody > tr')
            .eq(1)
            .within(() => {
                cy.get('td').eq(0).should('exist');
                cy.get('td').eq(1).should('exist');
                cy.get('td').eq(2).should('exist');
                cy.get("button[class='button is-outlined is-info']")
                    .should('contain', 'View Details')
                    .click();
            });

        cy.get(
            "footer[class='chakra-modal__footer css-k0waxj'] > button[class='button is-outlined']"
        )
            .contains('Close')
            .should('contain', 'Close')
            .click();

        cy.get(
            "div[class='chakra-modal__content-container css-1xisyp4']"
        ).should('not.exist');

        // Log the user out.
        cy.get('a[href*=logout]').click();

        cy.getCookie('appSession').should('not.exist');
    });
});
