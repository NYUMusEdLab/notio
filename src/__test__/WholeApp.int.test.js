import * as React from 'react'; // Necessary to run the tests, apparently.
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SoundMaker from "../components/SoundMaker";
import ReactPlayer from "react-player/lazy";
import WholeApp from "../WholeApp";
import { Time } from 'tone';

/*
    File containing all integration tests of the WholeApp module.
    Primarily tests that interactions with the TopMenu is integrated correctly with the KeyBoard.
    (And later on tests integration between plugins and the TopMenu and/or KeyBoard)
*/

// Overview of Mocks necessary
jest.mock("../components/SoundMaker");
jest.mock("react-player/lazy");

beforeEach(() => {
    ReactPlayer.mockClear();
    SoundMaker.mockClear();
})

describe("Root menu in the TopMenu to", () =>{
    test.each([
        ["C", 4, ["/"]],
        ["H", 3, ["/shared/INyllzBj7efsVe54qtFl"]]
    ])("Octave plus button should increase octave", async (root_note, octave, url) => {
        expect(SoundMaker).not.toHaveBeenCalled();
        await waitFor(() => render(
            <MemoryRouter initialEntries ={url}>
                <Route path="/shared/:sessionId" component={WholeApp} />
                <Route exact path={"/"} component={WholeApp}></Route>;
            </MemoryRouter>
        ));
        const octave_in_menu = screen.getByText("Octave:",{exact:false});
        expect(octave_in_menu.textContent).toBe("Octave: "+octave);
    
        const plus_button = screen.getByText("+");
        userEvent.click(plus_button);

        expect(octave_in_menu.textContent).toBe("Octave: "+(octave+1));
        expect(SoundMaker).toHaveBeenCalledTimes(1);
        const root_key = screen.getByTestId("ColorKey:"+root_note+(octave+1));
        userEvent.click(root_key);
        expect(SoundMaker.mock.instances[0].startSound).toHaveBeenCalledWith(root_note+(octave+1));
        expect(SoundMaker.mock.instances[0].stopSound).toHaveBeenCalledWith(root_note+(octave+1));
    })

    test("Octave minus button should decrease octave", () => {
        expect(SoundMaker).not.toHaveBeenCalled();
        render(
            <MemoryRouter>
                <Route exact path={"/"} component={WholeApp}></Route>;
            </MemoryRouter>
        );
        const octave_in_menu = screen.getByText("Octave:",{exact:false})
        expect(octave_in_menu.textContent).toBe("Octave: 4")
    
        const plus_button = screen.getByText("-");
        userEvent.click(plus_button);

        expect(octave_in_menu.textContent).toBe("Octave: 3")
        expect(SoundMaker).toHaveBeenCalledTimes(1);
        const root_key = screen.getByTestId("ColorKey:C3");
        userEvent.click(root_key);
        expect(SoundMaker.mock.instances[0].startSound).toHaveBeenCalledWith("C3");
        expect(SoundMaker.mock.instances[0].stopSound).toHaveBeenCalledWith("C3");
    })
})