import * as React from 'react'; // Necessary to run the tests, apparently.
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WholeApp from "../WholeApp";


test("Hello", () => {
    render(<WholeApp />);

    expect(1).toBe(1);
})