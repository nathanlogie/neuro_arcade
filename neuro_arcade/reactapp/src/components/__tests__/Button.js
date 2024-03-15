import {screen} from "@testing-library/react";
import {Button} from "../Button";
import {Route} from "react-router";
import userEvent from "@testing-library/user-event";

// TODO: currently the case where link is an empty string is not tested
// This seems like it should be removed, but if not then tests should be made

test("Button renders left direction without crashing", () => {
    renderWithRouter(<Button name='Name' link='.' direction='left' orentation='left' />);

    expect(screen.getByText("Name")).toBeInTheDocument();
});

test("Button renders right direction without crashing", () => {
    renderWithRouter(<Button name='Name' link='.' direction='right' orentation='left' />);

    expect(screen.getByText("Name")).toBeInTheDocument();
});

test("Button renders up direction without crashing", () => {
    renderWithRouter(<Button name='Name' link='.' direction='up' orentation='left' />);

    expect(screen.getByText("Name")).toBeInTheDocument();
});

test("Button renders down direction without crashing", () => {
    renderWithRouter(<Button name='Name' link='.' direction='down' orentation='left' />);

    expect(screen.getByText("Name")).toBeInTheDocument();
});

test("Button renders left orientation without crashing", () => {
    renderWithRouter(<Button name='Name' link='.' direction='left' orentation='left' />);

    expect(screen.getByText("Name")).toBeInTheDocument();
});

test("Button renders right orientation without crashing", () => {
    renderWithRouter(<Button name='Name' link='.' direction='left' orentation='right' />);

    expect(screen.getByText("Name")).toBeInTheDocument();
});

test("Button link functions", () => {
    renderWithRouter(
        <Button name='Name' link='dest' direction='left' orentation='left' />,

        <Route path='dest' element={<p>Success</p>} />
    );

    userEvent.click(screen.getByText("Name"));

    expect(screen.getByText("Success")).toBeInTheDocument();
});
