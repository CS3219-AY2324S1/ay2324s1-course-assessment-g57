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
        // cy.intercept(
        //     'https://34k0nfj43f.execute-api.ap-southeast-1.amazonaws.com/dev/*'
        // ).as('getToken');
        cy.get("button[class='button is-link']", { timeout: 10000 }).should(
            'be.visible'
        );
        // cy.wait('@getToken').then(
        //     (intercept) => expect(intercept?.response).to.exist
        // );
    });

    it('allows a user to use the video call functionality', () => {
        cy.mount(
            <ChakraBaseProvider>
                
            </ChakraBaseProvider>
        );
    });
});
