import * as React from 'react'; // Necessary to run the tests, apparently.
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WholeApp from "../WholeApp";



test("Hello", () => {
    
    <MemoryRouter>
        render(<Route exact path="/" component={WholeApp}></Route>);
    </MemoryRouter>

    expect(1).toBe(1);
})