describe('The Register Process', () => {
    it('sets an auth cookie and logs a user in after registering via form submission', () => {
        cy.visit('');

        cy.intercept('https://dev-r67hrnstb5x4ekjv.us.auth0.com/*').as("getAuth");
        
        cy.get("a[href*='auth']").click();
        
        cy.wait("@getAuth");
        
        cy.origin('https://dev-r67hrnstb5x4ekjv.us.auth0.com/*', () => {
            cy.get("input[name=username]").type("danielTestUser");
            
            cy.get("input[name=password]").type(`Password!{enter}`);
      });
    })
})