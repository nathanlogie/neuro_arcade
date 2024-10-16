import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// Components with Links inside need to be wrapped in a router
global.renderWithRouter = (html, extra) => {
    return render(
        <MemoryRouter>
            <Routes>
                <Route path="" element={html} />
                {extra || ""}
            </Routes>
        </MemoryRouter>
    );
}

// Prevents expected exceptions printing to console
global.silentThrow = (fn) => {
    return () => {
        let consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
        fn();
        consoleError.mockRestore();
    }
}

// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
