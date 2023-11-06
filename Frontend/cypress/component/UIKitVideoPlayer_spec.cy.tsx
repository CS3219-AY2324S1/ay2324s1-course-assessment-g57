import React from 'react';

import UIKitVideo from '@/components/video/UIKitVideoPlayer';

describe('Video Player Component Test', () => {
    it('mounts', () => {
        cy.mount(<UIKitVideo channel="TestVideoChat" />);

        // // Check button to start the video call and start the call
        // cy.get("button[class='button is-link'", { timeout: 10000 }).should("be.visible").click();

        // // Check the option to toggle video button
        // cy.get("svg[xlmns='http://www.w3.org/2000/svg']").should("be.visible").click();
    });
});
