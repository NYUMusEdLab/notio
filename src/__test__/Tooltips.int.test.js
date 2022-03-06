import * as React from 'react'; // Necessary to run the tests, apparently.
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SoundMaker from "../components/SoundMaker";
import WholeApp from "../WholeApp";

/*
    File containing tests for the tooltips feature.
*/

// This is necessary to make waitFor works, which makes sure Notio renders /shared/urls, otherwise its a loading screen.
// To make sure it loads, the "await waitFor(() => screen.getAllByText("Root"));" is added after the render.
import MutationObserver from 'mutation-observer'
global.MutationObserver = MutationObserver 

jest.mock("../components/SoundMaker"); // Automatic mock, which can be asserted against
jest.mock("react-player/lazy"); // Manual mock in __mock__ folder, made just to make the tests pass

beforeEach(() => {
    SoundMaker.mockClear();
})

describe("Tooltips in the TopMenu", () =>{
    test.each([
        ["C", 4, ["/"]],
        ["B", 3, ["/shared/INyllzBj7efsVe54qtFl"]]
    ])("Tooltips should be shown after initial load", async (root_note, octave, url) => {
        // Arrange the server and wait for the page to be loaded / skip the loading screen
        expect(SoundMaker).not.toHaveBeenCalled();
        render(
            <MemoryRouter initialEntries ={url}>
                <Route path="/shared/:sessionId" component={WholeApp} />
                <Route exact path={"/"} component={WholeApp}></Route>;
            </MemoryRouter>
        );
        await waitFor(() => screen.getAllByText("Root"));

    })

        
    test.each([
        ["C", 4, ["/"]],
        ["B", 3, ["/shared/INyllzBj7efsVe54qtFl"]]
    ])("Pressing the help button should show tooltips", async (root_note, octave, url) => {
        // Arrange the server and wait for the page to be loaded / skip the loading screen
        expect(SoundMaker).not.toHaveBeenCalled();
        render(
            <MemoryRouter initialEntries ={url}>
                <Route path="/shared/:sessionId" component={WholeApp} />
                <Route exact path={"/"} component={WholeApp}></Route>;
            </MemoryRouter>
        );
        await waitFor(() => screen.getAllByText("Root"));
    })


    test.each([
        ["C", 4, ["/"]],
        ["B", 3, ["/shared/INyllzBj7efsVe54qtFl"]]
    ])("Pressing the help button twice should hide the tooltips again", async (root_note, octave, url) => {
        // Arrange the server and wait for the page to be loaded / skip the loading screen
        expect(SoundMaker).not.toHaveBeenCalled();
        render(
            <MemoryRouter initialEntries ={url}>
                <Route path="/shared/:sessionId" component={WholeApp} />
                <Route exact path={"/"} component={WholeApp}></Route>;
            </MemoryRouter>
        );
        await waitFor(() => screen.getAllByText("Root"));
    })
})