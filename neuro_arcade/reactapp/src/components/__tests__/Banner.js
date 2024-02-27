import { screen } from "@testing-library/react";
import { Banner, MobileBanner } from "../Banner";
import {Button} from "../Button";

// Banner

test('Banner renders without crashing', () => {
    renderWithRouter(<Banner />);
});

test('Banner renders without crashing in big mode', () => {
    renderWithRouter(<Banner size='big' />);
});

// Common buttons for button tests
// The properties of the buttons themselves are in the scope of the Button unit
// tests, so they don't need to be tested here
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

test('Banner shows a buttonLeft in big mode', () => {
    renderWithRouter(<Banner size='big' left={buttonLeft} />);

    expect(screen.getByText("Left")).toBeInTheDocument();
})

test('Banner shows a buttonRight in big mode', () => {
    renderWithRouter(<Banner size='big' right={buttonRight} />);

    expect(screen.getByText("Right")).toBeInTheDocument();
})

test('Banner shows a buttonLeft and buttonRight in big mode', () => {
    renderWithRouter(
        <Banner
            size='big'
            left={buttonLeft}
            right={buttonRight}
        />
    );

    expect(screen.getByText("Left")).toBeInTheDocument();
    expect(screen.getByText("Right")).toBeInTheDocument();
})

test('Banner renders without crashing in small mode', () => {
    renderWithRouter(<Banner size='small' />);
});

test('Banner shows the back button in small mode', () => {
    renderWithRouter(<Banner size='small' />);

    expect(screen.getAllByText("back")[0]).toBeInTheDocument();
    expect(screen.getAllByText("back")[1]).toBeInTheDocument();
})

test('Banner shows the switcher in small mode', () => {
    renderWithRouter(<Banner size='small' />);

    expect(screen.getAllByText("Games")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Players")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Games")[1]).toBeInTheDocument();
    expect(screen.getAllByText("Players")[1]).toBeInTheDocument();
})

// TODO: maybe test switcher callback?

// MobileBanner

test('MobileBanner renders without crashing', () => {
    renderWithRouter(<MobileBanner />);
});
