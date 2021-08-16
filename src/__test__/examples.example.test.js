import * as React from 'react'; // Necessary to run the tests, apparently.
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Piano } from "@tonejs/piano";
import WholeApp from "../WholeApp";
import TopMenu from "../components/menu/TopMenu";
import Keyboard from "../components/Keyboard";

test("Example with basis WholeApp rendering showing the menu items are present", () => {
    
    render(
    <MemoryRouter>
        <Route exact path="/" component={WholeApp}></Route>;
    </MemoryRouter>
    );
    
    screen.getByAltText("treble clef");
    screen.getByText("Extended Keyboard");
})
/*
test("Example with rendering the TopMenu and choosing something in the menu", () => {
    render(<TopMenu />)

    expect(1).toBe(1);
})

test("Example with rendering the Keyboard and playing a sound", () => {
    render(<Keyboard />)

    expect(1).toBe(1);
})
*/