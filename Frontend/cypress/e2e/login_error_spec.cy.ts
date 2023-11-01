describe('Login Process Error Handling', () => {
    it('has sufficient error handling for a user making mistakes trying to log in', () => {
        cy.visit('')

        cy.intercept('https://dev-r67hrnstb5x4ekjv.us.auth0.com/*').as("getAuth");
  
        cy.get("a[href*='auth']").click();
  
        cy.wait("@getAuth");
  
        cy.origin('https://dev-r67hrnstb5x4ekjv.us.auth0.com/*', () => {
          // Invalid Username, gives proper error handling message.
          cy.get("input[name=username]").type("danielTestUser1");
          cy.get("input[name=password]").type(`Password!{enter}`);
          cy.get("span[id=error-element-password]").should("exist").should('contain', "username");
          cy.get("input[name=username]").clear();
          cy.get("input[name=password]").clear();
  
          // Invalid Email, gives proper error handling message.
          cy.get("input[name=username]").type("danielTestUser1@gmail.com");
          cy.get("input[name=password]").type(`Password!{enter}`);
          cy.get("span[id=error-element-password]").should("exist").should('contain', "username");
          cy.get("input[name=username]").clear();
          cy.get("input[name=password]").clear();
  
          // Invalid Password, gives proper error handling message.
          cy.get("input[name=username]").type("danielTestUser");
          cy.get("input[name=password]").type(`Password!!{enter}`);
          cy.get("span[id=error-element-password]").should("exist").should('contain', "password");
          cy.get("input[name=username]").clear();
          cy.get("input[name=password]").clear();
  
          // Valid Username and Password.
          cy.get("input[name=username]").type("danielTestUser");
          cy.get("input[name=password]").type(`Password!{enter}`);
        });
  
        cy.url().should('include', 'http://localhost:3000');
  
        cy.getCookie('appSession').should('exist');
  
        cy.get("a[href*=logout]").click();
  
        cy.getCookie('appSession').should('not.exist');
    })
})
