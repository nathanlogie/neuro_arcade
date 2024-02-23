import { screen } from "@testing-library/react";
import { NavBar } from "../NavBar";
import {Button} from "../Button";

test('NavBar renders without crashing', () => {
    renderWithRouter(<NavBar />);
});

const buttonLeft =
    <Button
        name={'Left'}
        ink={"."} // Buttons don't render if this is blank
        direction={"left"}
        orientation={"left"}
    />;
const buttonRight =
    <Button
        name={'Right'}
        ink={"."} // Buttons don't render if this is blank
        direction={"right"}
        orientation={"right"}
    />;

test('NavBar shows a buttonLeft', () => {
    renderWithRouter(<NavBar left={buttonLeft} />);

    expect(screen.getByText("Left")).toBeInTheDocument();
})

test('NavBar shows a buttonRight', () => {
    renderWithRouter(<NavBar right={buttonRight} />);

    expect(screen.getByText("Right")).toBeInTheDocument();
})

test('NavBar shows a buttonLeft and buttonRight', () => {
    renderWithRouter(
        <NavBar
            left={buttonLeft}
            right={buttonRight}
        />
    );

    expect(screen.getByText("Left")).toBeInTheDocument();
    expect(screen.getByText("Right")).toBeInTheDocument();
})