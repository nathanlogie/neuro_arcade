import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Card } from "../Card";
import { Route } from "react-router";

test('Card renders manually without crashing', () => {
    renderWithRouter(
        <Card
            link="."
            text="ManName"
            icon="<icon>"
        />
    );

    expect(screen.getByText("ManName")).toBeInTheDocument();
    expect(screen.getByText("<icon>")).toBeInTheDocument();
});

test('Card has a functional link in manual mode', () => {
    renderWithRouter(
        <Card
            link="dest"
            text="ManName"
            icon="<icon>"
        />,

        <Route path="dest" element={<p>Success</p>} />
    );

    userEvent.click(screen.getByText("ManName"));

    expect(screen.getByText("Success")).toBeInTheDocument();
});

test('Card renders a subject without crashing', () => {
    renderWithRouter(
        <Card
            linkPrefix=""
            subject={{
                name: "SubName",
                slug: "subname",
                icon: ".",
            }}
        />,
    );

    expect(screen.getByText("SubName")).toBeInTheDocument();
});

test('Card has a functional link for subjects', () => {
    renderWithRouter(
        <Card
            linkPrefix="prefix/"
            subject={{
                name: "SubName",
                slug: "subname",
                icon: ".",
            }}
        />,

        <Route path="prefix/subname" element={<p>Success</p>} />
    );

    userEvent.click(screen.getByText("SubName"));

    expect(screen.getByText("Success")).toBeInTheDocument();
});

// TODO: is this behaviour still wanted?
test('Card has a default name for subjects', () => {
    renderWithRouter(
        <Card
            linkPrefix=""
            subject={{
                slug: "name",
                icon: ".",
            }}
        />,
    );

    expect(screen.getByText("Name")).toBeInTheDocument();
});

test('Card throws when text is missing', silentThrow(() => {
    let fn = () => {renderWithRouter(
        <Card            
            link="dest"
            icon="<icon>"
        />
    )};

    expect(fn).toThrow();
}));

test('Card throws when icon is missing', silentThrow(() => {
    let fn = () => {renderWithRouter(
        <Card            
            link="dest"
            text="ManName"
        />
    )};

    expect(fn).toThrow();
}));

test('Card throws when link is missing', silentThrow(() => {
    let fn = () => {renderWithRouter(
        <Card            
            text="ManName"
            icon="<icon>"
        />
    )};

    expect(fn).toThrow();
}));

// TODO: test icon?
