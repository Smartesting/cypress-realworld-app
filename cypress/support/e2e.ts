// @ts-check
import "@cypress/code-coverage/support";
import "./commands";
import {isMobile} from "./utils";
import GravityCollector from '@smartesting/gravity-data-collector/dist'

beforeEach(() => {
    // cy.intercept middleware to remove 'if-none-match' headers from all requests
    // to prevent the server from returning cached responses of API requests
    cy.intercept(
        {url: "http://localhost:3001/**", middleware: true},
        (req) => delete req.headers["if-none-match"]
    );

    // Throttle API responses for mobile testing to simulate real world condition
    if (isMobile()) {
        cy.intercept({url: "http://localhost:3001/**", middleware: true}, (req) => {
            req.on("response", (res) => {
                // Throttle the response to 1 Mbps to simulate a mobile 3G connection
                res.setThrottle(1000);
            });
        });
    }
});

Cypress.on("window:load", (win) => {
    GravityCollector.init({
        authKey: "b617f074-9a2d-4f17-8038-f44d8f55c78b",
        windowInstance: win
    });
})
