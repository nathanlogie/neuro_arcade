import {screen} from "@testing-library/react";
import {Logo} from "../Logo";

test("Logo renders without crashing in big mode", () => {
    renderWithRouter(<Logo size='big' />);

    expect(screen.getByAltText("Neuro Arcade")).toBeInTheDocument();
});

test("Logo renders without crashing in small mode", () => {
    renderWithRouter(<Logo size='small' />);

    expect(screen.getByAltText("Neuro Arcade")).toBeInTheDocument();
});
