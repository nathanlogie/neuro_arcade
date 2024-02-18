import { screen } from "@testing-library/react";
import { Banner, MobileBanner } from "../Banner";

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

test('Banner shows a buttonLeft in big mode', () => {
    renderWithRouter(<Banner size='big' button_left={buttonLeft} />);

    expect(screen.getByText("Left")).toBeInTheDocument();
})

test('Banner shows a buttonRight in big mode', () => {
    renderWithRouter(<Banner size='big' button_right={buttonRight} />);

    expect(screen.getByText("Right")).toBeInTheDocument();
})

test('Banner shows a buttonLeft and buttonRight in big mode', () => {
    renderWithRouter(
        <Banner
            size='big'
            button_left={buttonLeft}
            button_right={buttonRight}
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

    expect(screen.getByText("back")).toBeInTheDocument();
})

test('Banner shows the switcher in small mode', () => {
    renderWithRouter(<Banner size='small' />);

    expect(screen.getByText("Games")).toBeInTheDocument();
    expect(screen.getByText("Players")).toBeInTheDocument();
})

// TODO: maybe test switcher callback?

// MobileBanner

test('MobileBanner renders without crashing', () => {
    renderWithRouter(<MobileBanner />);
});
