import React from 'react';

import CodeEditor from '@/components/editor/Editor';
import { ChakraBaseProvider, extendTheme } from '@chakra-ui/react';

const theme = extendTheme({});

describe('Code Editor Component Test', () => {
    it('mounts', () => {
        cy.mount(
            <ChakraBaseProvider theme={theme}>
                <CodeEditor roomId="test1" />
            </ChakraBaseProvider>
        );

        // Check that the code editor is displayed to the user and that they can type on it.
        cy.get("div[class='editor']", { timeout: 10000 })
            .should('be.visible')
            .click()
            .focused()
            .type("print('hello world')");

        cy.get('div[class=view-line]')
            .should('be.visible')
            .should('contain', 'print');

        // Check that there is a leave room button.
        cy.get("a[href*='/']").should('exist');
    });

    it('allows a user to interact with the code editor', () => {
        cy.mount(
            <ChakraBaseProvider theme={theme}>
                <CodeEditor roomId="test2" />
            </ChakraBaseProvider>
        );

        // Check that the code editor is displayed.
        cy.get("div[class='editor']", { timeout: 10000 }).should('be.visible');

        // Check that a user can toggle between the dark and light modes.
        // cy.get(
        //     "div[class='monaco-editor no-user-select mac  showUnused showDeprecated vs']"
        // ).should('be.visible');
        // cy.get("label[class='chakra-switch css-1gmw4cr']")
        //     .should('be.visible')
        //     .click();
        // cy.get(
        //     "div[class='monaco-editor no-user-select mac  showUnused showDeprecated vs-dark']"
        // ).should('be.visible');
        // cy.get("label[class='chakra-switch css-1gmw4cr']")
        //     .should('be.visible')
        //     .click();
        // cy.get(
        //     "div[class='monaco-editor no-user-select mac  showUnused showDeprecated vs']"
        // ).should('be.visible');

        // Check that a user is able to switch between languages.
        cy.get('option').should('contain', 'Python');
        cy.get('select').should('be.visible').select('Kotlin');
        cy.get('option').should('contain', 'Kotlin');
        cy.get('select').select('Python');

        // Check that there is a Submit Code button for users to submit code written.
        cy.get("button[class='chakra-button css-1ahd3gj'").should('be.visible');

        // Check that the code editor is displayed to the user and that they can type on it.
        cy.get("div[class='editor']", { timeout: 10000 })
            .should('be.visible')
            .click()
            .focused()
            .type("print('hello world')");

        // Check that what the user has typed is displayed in the code editor.
        cy.get('div[class=view-line]')
            .should('be.visible')
            .should('contain', 'print');

        // Check that the user can submit the code and that the result is printed to the terminal.
        cy.intercept('https://judge0-ce.p.rapidapi.com/submissions/*').as(
            'runCode'
        );
        cy.get("button[class='chakra-button css-1ahd3gj'").click();
        cy.wait('@runCode');
        cy.get('textarea').should('contain', 'hello world');
    });
});
