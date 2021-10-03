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

describe("Root menu in the TopMenu to", () =>{
    test("Octave plus button should increase octave", () => {
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
        // Assert that the SoundMaker module receives the proper octave when playing a note
    })

    test("Octave minus button should decrease octave", () => {
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
        // Assert that the SoundMaker module receives the proper octave when playing a note
    })
})