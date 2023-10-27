describe('The Login Process', () => {
    it('sets and auth cookie and when logging in via form submission', () => {
      cy.visit('')

      cy.get("a[href*='auth']").click();

      cy.origin('https://dev-r67hrnstb5x4ekjv.us.auth0.com/*', () => {
        cy.get("input[name=username]").type("danielTestUser");

        cy.get("input[name=password]").type(`Password!{enter}`);
      });

      cy.url().should('include', 'http://localhost:3000');

      cy.getCookie('appSession').should('exist');
    })
  })
  