import {screen} from "@testing-library/react";
import {CardGrid, exportedForTesting} from "./CardGrid";
import React from "react";
// Import private methods
const {textQueryFilter, tagQueryFilter, searchFilter} = exportedForTesting;

// Function tests

test("textQueryFilter false when not matching", () => {
    let game = {
        name: "Name",
        description: "Description"
    };
    expect(textQueryFilter(game, "<match>")).toBe(false);
});

test("textQueryFilter true when matching in name", () => {
    let game = {
        name: "Name <match>",
        description: "Description"
    };
    expect(textQueryFilter(game, "<match>")).toBe(true);
});

test("textQueryFilter true when matching in description", () => {
    let game = {
        name: "Name",
        description: "Description <match>"
    };
    expect(textQueryFilter(game, "<match>")).toBe(true);
});

test("tagQueryFilter false when not matching", () => {
    let game = {
        tags: [1]
    };
    expect(tagQueryFilter(game, [2])).toBe(false);
});

test("textQueryFilter true when matching for a 1-tag list", () => {
    let game = {
        tags: [1, 2]
    };
    expect(tagQueryFilter(game, [2])).toBe(true);
});

test("textQueryFilter false when matching only some tags", () => {
    let game = {
        tags: [1, 2]
    };
    expect(tagQueryFilter(game, [2, 3])).toBe(false);
});

test("textQueryFilter true when matching for a multi-tag list", () => {
    let game = {
        tags: [1, 2, 3]
    };
    expect(tagQueryFilter(game, [2, 3])).toBe(true);
});

test("searchFilter false when not matching text", () => {
    let game = {
        name: "Name",
        description: "Description",
        tags: [1, 2]
    };
    expect(searchFilter(game, "<match>", [2])).toBe(false);
});

test("searchFilter false when not matching tags", () => {
    let game = {
        name: "Name <match>",
        description: "Description",
        tags: [1]
    };
    expect(searchFilter(game, "<match>", [2])).toBe(false);
});

test("searchFilter true when matching", () => {
    let game = {
        name: "Name <match>",
        description: "Description",
        tags: [1, 2]
    };
    expect(searchFilter(game, "<match>", [2])).toBe(true);
});

// Component tests

test("CardGrid renders without crashing", () => {
    renderWithRouter(<CardGrid subjects={[]} />);
});

test("CardGrid shows a game", async () => {
    let subjects = [
        {
            name: "Name",
            description: "Description",
            tags: [1]
        }
    ];

    renderWithRouter(<CardGrid subjects={subjects} />);

    expect(screen.getByText("Name")).toBeInTheDocument();
});

test("CardGrid filters games by text filter", async () => {
    let subjects = [
        {
            name: "Name1",
            description: "Description",
            tags: [1]
        },
        {
            name: "Name2",
            description: "Description",
            tags: [1]
        }
    ];

    renderWithRouter(<CardGrid subjects={subjects} textQuery='Name1' />);

    expect(screen.getByText("Name1")).toBeInTheDocument();
    expect(screen.queryByText("Name2")).not.toBeInTheDocument();
});

test("CardGrid filters games by description filter", async () => {
    let subjects = [
        {
            name: "Name1",
            description: "Description1",
            tags: [1]
        },
        {
            name: "Name2",
            description: "Description2",
            tags: [1]
        }
    ];

    renderWithRouter(<CardGrid subjects={subjects} textQuery='Description1' />);

    expect(screen.getByText("Name1")).toBeInTheDocument();
    expect(screen.queryByText("Name2")).not.toBeInTheDocument();
});

test("CardGrid filters games by tag filter", async () => {
    let subjects = [
        {
            name: "Name1",
            description: "Description1",
            tags: [1]
        },
        {
            name: "Name2",
            description: "Description2",
            tags: [2]
        }
    ];

    renderWithRouter(<CardGrid subjects={subjects} tagQuery={[1]} />);

    expect(screen.getByText("Name1")).toBeInTheDocument();
    expect(screen.queryByText("Name2")).not.toBeInTheDocument();
});
