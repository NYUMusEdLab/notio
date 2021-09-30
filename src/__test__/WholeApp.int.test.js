import * as React from 'react'; // Necessary to run the tests, apparently.
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Piano } from "@tonejs/piano";
import WholeApp from "../WholeApp";

/*
    File containing all integration tests of the WholeApp module.
    Primarily tests that interactions with the TopMenu is integrated correctly with the KeyBoard.
    (And later on tests integration between plugins and the TopMenu and/or KeyBoard)
*/

describe("Sound menu in the TopMenu to", () =>{
    test("Octave plus button in Sound menu should increase octave", () => {
        render(
            <MemoryRouter>
                <Route exact path="/" component={WholeApp}></Route>;
            </MemoryRouter>
        );
        const sound_menu = screen.getByText("Sound");
        userEvent.click(sound_menu);
        const octave_in_sound_menu = screen.getByText("Octave:",{exact:false})
        expect(octave_in_sound_menu.textContent).toBe("Octave: 4")
    
        const plus_button = screen.getByText("+");
        userEvent.click(plus_button);

        expect(octave_in_sound_menu.textContent).toBe("Octave: 5")
        // Assert that the SoundMaker module receives the proper octave when playing a note
    })

    test("Octave minus button in Sound menu should decrease octave on keyboard", () => {
        render(
            <MemoryRouter>
                <Route exact path={"/"} component={WholeApp}></Route>;
            </MemoryRouter>
        );
        const sound_menu = screen.getByText("Sound");
        userEvent.click(sound_menu);
        const octave_in_sound_menu = screen.getByText("Octave:",{exact:false})
        expect(octave_in_sound_menu.textContent).toBe("Octave: 4")
    
        const plus_button = screen.getByText("-");
        userEvent.click(plus_button);

        expect(octave_in_sound_menu.textContent).toBe("Octave: 3")
        // Assert that the SoundMaker module receives the proper octave when playing a note
    })
})