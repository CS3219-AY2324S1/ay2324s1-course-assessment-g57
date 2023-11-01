describe('The Error Handling for the Register Process', () => {
    it('has sufficient error handling for a user making mistakes trying to register for an account', () => {
        cy.visit('');

        cy.intercept('https://dev-r67hrnstb5x4ekjv.us.auth0.com/*').as("getAuth");
        
        cy.get("a[href*='auth']").click();
        
        cy.wait("@getAuth");
        
        cy.origin('https://dev-r67hrnstb5x4ekjv.us.auth0.com/*', () => {
            const testUsername = Cypress.env("testUsername");
            const testPassword = Cypress.env("testPassword");
            const testEmail = Cypress.env("testEmail");
            const testInvalidUsername = Cypress.env("testInvalidUsername");
            const testInvalidEmail = Cypress.env("testInvalidEmail");
            
            cy.get("a[href*='signup']").click();

            // Check that you are on the register page.
            cy.get("header").should("contain", "Sign Up");

            // Username already taken.
            cy.get("input[name=username]").type(testUsername);
            cy.get("input[name=email]").type(testInvalidEmail);
            cy.get("input[name=password]").type(`${testPassword}{enter}`);
            cy.get("div[id=prompt-alert]").should("exist").should("contain", "Something went wrong");
            cy.get("input[name=username]").clear();
            cy.get("input[name=email]").clear();
            cy.get("input[name=password]").clear();

            // Email already taken.
            cy.get("input[name=username]").type(testInvalidUsername);
            cy.get("input[name=email]").type(testEmail);
            cy.get("input[name=password]").type(`${testPassword}{enter}`);
            cy.get("div[id=prompt-alert]").should("exist").should("contain", "Something went wrong");
            cy.get("input[name=username]").clear();
            cy.get("input[name=email]").clear();
            cy.get("input[name=password]").clear();
      });
    })

    it('has informative messages for users regarding password complexity for users trying to register for account', () => {
        cy.visit("/");

        cy.intercept('https://dev-r67hrnstb5x4ekjv.us.auth0.com/*').as("getAuth");
        
        cy.get("a[href*='auth']").click();
        
        cy.wait("@getAuth");

        cy.origin('https://dev-r67hrnstb5x4ekjv.us.auth0.com/*', () => {
            const testUsername = Cypress.env("testUsername");
            const testPassword = Cypress.env("testPassword");
            const testEmail = Cypress.env("testEmail");

            cy.get("a[href*='signup']").click();

            // Check that you are on the register page.
            cy.get("header").should("contain", "Sign Up");

            // Password Complexity Messages.
            cy.get("input[name=username]").type(testUsername);
            cy.get("input[name=email]").type(testEmail);
            cy.get("input[name=password]").type(`${testPassword}`);

            cy.get("li[data-error-code='password-policy-length-at-least']")
                .should("exist")
                .should("contain", "At least 8 characters");
            cy.get("li[data-error-code='password-policy-contains-at-least']")
                .should("exist")
                .should("contain", "At least 3");
            cy.get("li[data-error-code='password-policy-lower-case']")
                .should("exist")
                .should("contain", "Lower case");
            cy.get("li[data-error-code='password-policy-upper-case']")
                .should("exist")
                .should("contain", "Upper case")
            cy.get("li[data-error-code='password-policy-numbers']")
                .should("exist")
                .should("contain", "Numbers");
            cy.get("li[data-error-code='password-policy-special-characters']")
                .should("exist")
                .should("contain", "Special characters");

            cy.get("input[name=username]").clear();
            cy.get("input[name=email]").clear();
            cy.get("input[name=password]").clear();
      });
    })
})
