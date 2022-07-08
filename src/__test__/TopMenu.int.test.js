import * as React from 'react'; // Necessary to run the tests, apparently.
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WholeApp from "../WholeApp";

jest.mock('react-dom', () => {
    return {
        ...jest.requireActual('react-dom'),
        createPortal: (element, target) => {
            return element;
        }
    };
});

describe("TopMenu Help Button", () => {
    test("Should present a 'How to use Notio' popup as default", () => {
        const root = render(
        <MemoryRouter>
            <Route exact path="/" component={WholeApp}></Route>;
        </MemoryRouter>
        );

        const expectedText = screen.queryAllByText("How to use Notio");
        expect(expectedText.length).toBe(1);
    });
    test("Should hide the 'How to use Notio' popup when pressing the help button", () => {
        const root = render(
        <MemoryRouter>
            <Route exact path="/" component={WholeApp}></Route>;
        </MemoryRouter>
        );
        const helpButton = screen.getByText("Press for help");

        userEvent.click(helpButton);

        const nonExpectedText = screen.queryAllByText("How to use Notio");
        expect(nonExpectedText.length).toBe(0);
    });
})