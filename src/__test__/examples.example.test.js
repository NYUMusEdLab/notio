import * as React from 'react'; // Necessary to run the tests, apparently.
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Piano } from "@tonejs/piano";
import WholeApp from "../WholeApp";
import TopMenu from "../components/menu/TopMenu";
import Keyboard from "../components/Keyboard";

test("Example with basis WholeApp rendering showing the menu items are present", () => {
    // WARNING: The "@tonejs/piano" and "tone" libraries are mocked.
    // This is seen in the __mocks__ folder
    // Be aware that the __mocks__ folder follow the same import structure for the mocks to work!!!

    render(
    <MemoryRouter>
        <Route exact path="/" component={WholeApp}></Route>;
    </MemoryRouter>
    );
    
    // Texts directly present in the DOM, and examples of what can be done
    screen.getByText("Show keyboard");
    screen.getByText("Extended Keyboard");
    screen.getByText("Sound");
    screen.getByText("Notation");
    screen.getByText("Video Player");
    expect(screen.getByText("Settings")).toBeInstanceOf(HTMLSpanElement);

    // Text in <spans> which should be accessed by their title in the DOM
    screen.getByTitle("Root");
    screen.getByTitle("Scale");
    screen.getByTitle("Clefs");
    screen.getByTitle("Share this setup");

    // SVGs which are accesible by their <title /> in the DOM (can also be changed to <span title="title" />)
    const twoTrebles = screen.getAllByTitle("Treble Clef");
    expect(twoTrebles.length).toBe(2);
    screen.getByTitle("Alto Clef");
    screen.getByTitle("Bass Clef");
    screen.getByTitle("Tenor Clef");
})