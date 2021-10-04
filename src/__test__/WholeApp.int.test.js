import * as React from 'react'; // Necessary to run the tests, apparently.
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SoundMaker from "../components/SoundMaker";
jest.mock("../components/SoundMaker");
import WholeApp from "../WholeApp";

/*
    File containing all integration tests of the WholeApp module.
    Primarily tests that interactions with the TopMenu is integrated correctly with the KeyBoard.
    (And later on tests integration between plugins and the TopMenu and/or KeyBoard)
*/

beforeEach(() => {
    SoundMaker.mockClear();
})

describe("Root menu in the TopMenu to", () =>{
    test("Octave plus button should increase octave", () => {
        expect(SoundMaker).not.toHaveBeenCalled();
        render(
            <MemoryRouter>
                <Route exact path="/" component={WholeApp}></Route>;
            </MemoryRouter>
        );
        const octave_in_menu = screen.getByText("Octave:",{exact:false})
        expect(octave_in_menu.textContent).toBe("Octave: 4")
    
        const plus_button = screen.getByText("+");
        userEvent.click(plus_button);

        expect(octave_in_menu.textContent).toBe("Octave: 5")
        expect(SoundMaker).toHaveBeenCalledTimes(1);
        // Assert that the SoundMaker module receives the proper octave when playing a note
        //expect(SoundMaker.mock.instances[0].startSound).toHaveBeenCalledWith("D");
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
        // Assert that the SoundMaker module receives the proper octave when playing a note
        //expect(SoundMaker.mock.instances[0].startSound).toHaveBeenCalledWith("D");
    })
})