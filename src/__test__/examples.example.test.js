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
    
    // Texts directly present in the DOM
    screen.getByText("Show keyboard");
    screen.getByText("Extended Keyboard");
    screen.getByText("Sound");
    screen.getByText("Notation");
    screen.getByText("Video Player");
    screen.getByText("Settings");

    // Text which should be accessed differently in the DOM

    // SVGs which are accesible by their title in the DOM
    const twoTrebles = screen.getAllByTitle("Treble Clef");
    expect(twoTrebles.length).toBe(2);
    screen.getByTitle("Alto Clef");
    screen.getByTitle("Bass Clef");
    screen.getByTitle("Tenor Clef");
})