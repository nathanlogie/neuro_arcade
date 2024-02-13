import { screen } from "@testing-library/react";
import { Button } from "../Button";

// TODO: currently the case where link is an empty string is not tested
// This seems like it should be removed, but if not then tests should be made

test('Button renders left direction without crashing', () => {
    renderWithRouter(
        <Button
            name='Name'
            link='.'
            direction='left'
            orentation='left'
        />
    );

    expect(screen.getByText("Name")).toBeInTheDocument();
});

test('Button renders right direction without crashing', () => {
    renderWithRouter(
        <Button
            name='Name'
            link='.'
            direction='right'
            orentation='left'
        />
    );

    expect(screen.getByText("Name")).toBeInTheDocument();
});

test('Button renders up direction without crashing', () => {
    renderWithRouter(
        <Button
            name='Name'
            link='.'
            direction='up'
            orentation='left'
        />
    );

    expect(screen.getByText("Name")).toBeInTheDocument();
});

test('Button renders down direction without crashing', () => {
    renderWithRouter(
        <Button
            name='Name'
            link='.'
            direction='down'
            orentation='left'
        />
    );

    expect(screen.getByText("Name")).toBeInTheDocument();
});

test('Button renders left orientation without crashing', () => {
    renderWithRouter(
        <Button
            name='Name'
            link='.'
            direction='left'
            orentation='left'
        />
    );

    expect(screen.getByText("Name")).toBeInTheDocument();
});

test('Button renders right orientation without crashing', () => {
    renderWithRouter(
        <Button
            name='Name'
            link='.'
            direction='left'
            orentation='right'
        />
    );

    expect(screen.getByText("Name")).toBeInTheDocument();
});

// TODO: test link?
