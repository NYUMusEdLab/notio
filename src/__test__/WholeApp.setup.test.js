import * as React from 'react'; // Necessary to run the tests, apparently.
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SoundMaker from "../components/SoundMaker";
import WholeApp from "../WholeApp";

/*
    ERASE THIS TEXT AND WRITE WHAT FEATURE THIS FILE TESTS
    Setup file that can be copy pasted when wanting to create new tests.
    To create new configurations in url (see line 29, the /shared/XXXX/ thing),
    go to https://notio-novia-fi.netlify.app/ and create a new "share this setup". 
    DONT DO IT from localhost! It won't correctly save it to the database!
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

describe("Root menu in the TopMenu", () =>{
    test.each([
        [["/"]],
        [["/shared/INyllzBj7efsVe54qtFl"]]
    ])("Octave plus button should increase octave", async (url) => {
        // Arrange the server, wait for the page to be loaded and make sure the SoundMaker module is working
        expect(SoundMaker).not.toHaveBeenCalled();
        render(
            <MemoryRouter initialEntries ={url}>
                <Route path="/shared/:sessionId" component={WholeApp} />
                <Route exact path={"/"} component={WholeApp}></Route>;
            </MemoryRouter>
        );
        await waitFor(() => screen.getAllByText("Root"));
        expect(SoundMaker).toHaveBeenCalledTimes(1);

        // (Extra) Arrange

        // Act

        // Assert
    })
}