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
        ["C", 4,'f', ["/"]],
        ["C", 1,'f', ["/shared/QV11qK14Q7x2uPdOQNPP"]],//C Major-scale octave 1
        ["Bb", 3,'f',["/shared/O4c7Pb8H0aCmjm5a5E1F"]],//Bb-Major-scale octave 3
        ["C", 4, 'f', ["/shared/FDa5RdtPlGfMHekkIdtd"]],//C Major-Blues-Scale
        ["Bb", 1, 'f', ["/shared/py2guWIDDZfOACcRi5T7"]],//Bb Major-Blues-Scale
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


    // test.each([
    //     ["C", 4,'d', ["/"]],//Default scale and octave
    //     ["C", 1,'d', ["/shared/5cg2RfIti2OhF9jZC3nV"]]//C Major-scale octave 1
    //     // ["B", 3,'f', ["/shared/INyllzBj7efsVe54qtFl"]]
    // ])("pressing [d] in C-Major plays the major7th below the root", async (root_note, octave, keypress, url) => {
    //     expect(SoundMaker).not.toHaveBeenCalled();
    //     render(
    //         <MemoryRouter initialEntries ={url}>
    //             <Route path="/shared/:sessionId" component={WholeApp} />
    //             <Route exact path={"/"} component={WholeApp}></Route>;
    //         </MemoryRouter>
    //     );
    //     await waitFor(() => screen.getAllByText("Root"));
    //     expect(SoundMaker).toHaveBeenCalledTimes(1);
        
    //     await userEvent.keyboard(keypress)

    //     //const F_key = new KeyboardEvent('keydown', {key: keypress});
    //     expect(SoundMaker.mock.instances[0].startSound).toHaveBeenCalledWith('B'+(octave-1));
    //     expect(SoundMaker.mock.instances[0].stopSound).toHaveBeenCalledWith('B'+(octave-1));
    // })

    test.each([
        ["C", 4, "B3", 'd', 0, ["/"]],//Default scale and octave
        ["C", 1, "B2", 'd', 2, ["/shared/QV11qK14Q7x2uPdOQNPP"]],//C Major-scale octave 1
        ["Bb", 3, "A7", 'd', 4, ["/shared/O4c7Pb8H0aCmjm5a5E1F"]],//Bb-Major-scale octave 3
    ])("pressing [d] in Major-scale plays the major7th below the root after octave have been increased by #keypressCount (!!remember octave shifts at C!!)", async (root_note, octave,expected_tone, keypress,keypressCount, url) => {
        expect(SoundMaker).not.toHaveBeenCalled();
        render(
            <MemoryRouter initialEntries ={url}>
                <Route path="/shared/:sessionId" component={WholeApp} />
                <Route exact path={"/"} component={WholeApp}></Route>;
            </MemoryRouter>
        );
        await waitFor(() => screen.getAllByText("Root"));
        expect(SoundMaker).toHaveBeenCalledTimes(1);
        const octave_in_menu = screen.getByText("Octave:",{exact:false});
        expect(octave_in_menu.textContent).toBe("Octave: "+octave);
        const plus_button = screen.getByText("+");
        for (let count = 0; count<keypressCount; count++) {
        userEvent.click(plus_button);
        }
        expect(octave_in_menu.textContent).toBe("Octave: "+(octave+keypressCount));
        
        await userEvent.keyboard(keypress)
        expect(SoundMaker.mock.instances[0].startSound).toHaveBeenCalledWith(expected_tone);
        expect(SoundMaker.mock.instances[0].stopSound).toHaveBeenCalledWith(expected_tone);
    })

    test.each([
        ["C", 4, "A5", 'd', 2, ["/shared/FDa5RdtPlGfMHekkIdtd"]],//C Major-Blues-Scale
        ["Bb", 1, "G5", 'd', 4, ["/shared/py2guWIDDZfOACcRi5T7"]],//Bb Major-Blues-Scale
    ])("pressing [d] in Major-blues-scale plays the 6th below the root after octave have been increased +2(!!remember octave shifts at C!!)", async (root_note, octave,expected_tone, keypress,keypressCount, url) => {
        expect(SoundMaker).not.toHaveBeenCalled();
        render(
            <MemoryRouter initialEntries ={url}>
                <Route path="/shared/:sessionId" component={WholeApp} />
                <Route exact path={"/"} component={WholeApp}></Route>;
            </MemoryRouter>
        );
        await waitFor(() => screen.getAllByText("Root"));
        expect(SoundMaker).toHaveBeenCalledTimes(1);
        const octave_in_menu = screen.getByText("Octave:",{exact:false});
        expect(octave_in_menu.textContent).toBe("Octave: "+octave);
        const plus_button = screen.getByText("+");
        for (let count = 0; count<keypressCount; count++) {
        userEvent.click(plus_button);
        }
        expect(octave_in_menu.textContent).toBe("Octave: "+(octave+keypressCount));
        
        await userEvent.keyboard(keypress)

        //const F_key = new KeyboardEvent('keydown', {key: keypress});
        expect(SoundMaker.mock.instances[0].startSound).toHaveBeenCalledWith(expected_tone);
        expect(SoundMaker.mock.instances[0].stopSound).toHaveBeenCalledWith(expected_tone);
    })


})