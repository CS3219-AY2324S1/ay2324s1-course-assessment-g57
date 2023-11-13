import React from 'react';

import UIKitVideo from '@/components/video/UIKitVideoPlayer';
import { ChakraBaseProvider, extendTheme } from '@chakra-ui/react';

const theme = extendTheme({});

describe('Video Player Component Test', () => {
    it('mounts', () => {
        cy.mount(
            <ChakraBaseProvider theme={theme}>
                <UIKitVideo channel="test" />
            </ChakraBaseProvider>
        );

        // Check that the video service can be accessed from the collaboration page and that users
        // can get a token for the video chat.
        cy.intercept(
            'https://34k0nfj43f.execute-api.ap-southeast-1.amazonaws.com/dev/*'
        ).as('getToken');
        cy.get("button[class='button is-link']", { timeout: 10000 }).should(
            'be.visible'
        );
    });

    it('allows a user to use the video call functionality', () => {
        cy.mount(
            <ChakraBaseProvider theme={theme}>
                <UIKitVideo channel="test" />
            </ChakraBaseProvider>
        );

        // Check that there is a button for users to start the video call service.
        cy.get("button[class='button is-link']", { timeout: 10000 })
            .should('be.visible')
            .click();

        // Check that the video call player appears, and displays the necessary controls.
        cy.get("div[style='display: flex; height: 50vh;']").should(
            'be.visible'
        );

        // Check that the controls exist. Start and Stop Video, Start and Stop Mic, End Call.
        // Control Bar.
        cy.get(
            "div[style='background-color: rgb(59, 59, 59); width: 100%; height: 70px; z-index: 10; display: flex; flex-direction: row; justify-content: space-evenly; align-items: center;']"
        ).should('be.visible');
        // Start/Stop Video.
        cy.get(
            "div[style='width: 40px; height: 40px; border-radius: 25px; border-width: 1px; border-style: solid; border-color: rgb(255, 255, 255); background-color: rgba(0, 80, 180, 0.2); align-items: center; justify-content: center; display: flex; cursor: pointer; margin: 4px;']"
        )
            .eq(0)
            .should('be.visible');
        // Start/Stop Mic.
        cy.get(
            "div[style='width: 40px; height: 40px; border-radius: 25px; border-width: 1px; border-style: solid; border-color: rgb(255, 255, 255); background-color: rgba(0, 80, 180, 0.2); align-items: center; justify-content: center; display: flex; cursor: pointer; margin: 4px;']"
        )
            .eq(1)
            .should('be.visible');
        // End Call.
        cy.get(
            "div[style='width: 60px; height: 40px; border-radius: 25px; border-width: 1px; border-style: solid; border-color: rgb(255, 255, 255); background-color: rgb(255, 102, 102); align-items: center; justify-content: center; display: flex; cursor: pointer; margin: 4px;']"
        )
            .should('be.visible')
            .click();
    });
});
