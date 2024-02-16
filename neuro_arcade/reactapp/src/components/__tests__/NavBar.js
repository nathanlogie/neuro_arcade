import { screen } from "@testing-library/react";
import { NavBar } from "../NavBar";

test('NavBar renders without crashing', () => {
    renderWithRouter(<NavBar />);
});

const buttonLeft = {
    name: "Left",
    link: ".", // Buttons don't render if this is blank
    direction: "left",
    orientation: "left",
};
const buttonRight = {
    name: "Right",
    link: ".",
    direction: "left",
    orientation: "left",
};

test('NavBar shows a buttonLeft', () => {
    renderWithRouter(<NavBar button_left={buttonLeft} />);

    expect(screen.getByText("Left")).toBeInTheDocument();
})

test('NavBar shows a buttonRight', () => {
    renderWithRouter(<NavBar button_right={buttonRight} />);

    expect(screen.getByText("Right")).toBeInTheDocument();
})

test('NavBar shows a buttonLeft and buttonRight', () => {
    renderWithRouter(
        <NavBar
            button_left={buttonLeft}
            button_right={buttonRight}
        />
    );

    expect(screen.getByText("Left")).toBeInTheDocument();
    expect(screen.getByText("Right")).toBeInTheDocument();
})