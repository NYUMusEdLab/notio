import * as React from 'react'; // Necessary to run the tests, apparently.
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import fireEvent from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import Keyboard from "../components/Keyboard"
import SoundMaker from "../components/SoundMaker";
import ReactPlayer from "react-player/lazy";
import WholeApp from "../WholeApp";
import { Time } from 'tone';

/*
    File containing all integration tests of the WholeApp module.
    Primarily tests that interactions with the TopMenu is integrated correctly with the KeyBoard.
    (And later on tests integration between plugins and the TopMenu and/or KeyBoard)
*/

// This is necessary to make waitFor works, which makes sure Notio renders /shared/urls, otherwise its a loading screen.
// To make sure it loads "await waitFor(() => screen.getAllByText("Root"));" is added after the render.
import MutationObserver from 'mutation-observer'
global.MutationObserver = MutationObserver 

// Overview of Mocks necessary
jest.mock("../components/SoundMaker");
jest.mock("react-player/lazy");

beforeEach(() => {
    ReactPlayer.mockClear();
    SoundMaker.mockClear();

})

describe("ComputerKeyboard pressing key to", () =>{
    test.each([
        ["C", 4,'f', ["/"]]
        // ["B", 3,'f', ["/shared/INyllzBj7efsVe54qtFl"]]
    ])("pressing [f] plays the root", async (root_note, octave, keypress, url) => {
        expect(SoundMaker).not.toHaveBeenCalled();
        render(
            <MemoryRouter initialEntries ={url}>
                <Route path="/shared/:sessionId" component={WholeApp} />
                <Route exact path={"/"} component={WholeApp}></Route>;
            </MemoryRouter>
        );
        await waitFor(() => screen.getAllByText("Root"));
        expect(SoundMaker).toHaveBeenCalledTimes(1);
        
        await userEvent.keyboard(keypress)

        //const F_key = new KeyboardEvent('keydown', {key: keypress});
        expect(SoundMaker.mock.instances[0].startSound).toHaveBeenCalledWith(root_note+(octave));
        expect(SoundMaker.mock.instances[0].stopSound).toHaveBeenCalledWith(root_note+(octave));
    })


    test.each([
        ["C", 4,'d', ["/"]],
        ["C", 1,'d', ["/shared/5cg2RfIti2OhF9jZC3nV"]]
        // ["B", 3,'f', ["/shared/INyllzBj7efsVe54qtFl"]]
    ])("pressing [d] in C-Major plays the major7th below the root", async (root_note, octave, keypress, url) => {
        expect(SoundMaker).not.toHaveBeenCalled();
        render(
            <MemoryRouter initialEntries ={url}>
                <Route path="/shared/:sessionId" component={WholeApp} />
                <Route exact path={"/"} component={WholeApp}></Route>;
            </MemoryRouter>
        );
        await waitFor(() => screen.getAllByText("Root"));
        expect(SoundMaker).toHaveBeenCalledTimes(1);
        
        await userEvent.keyboard(keypress)

        //const F_key = new KeyboardEvent('keydown', {key: keypress});
        expect(SoundMaker.mock.instances[0].startSound).toHaveBeenCalledWith('B'+(octave-1));
        expect(SoundMaker.mock.instances[0].stopSound).toHaveBeenCalledWith('B'+(octave-1));
    })


})