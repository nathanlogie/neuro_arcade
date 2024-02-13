import { screen } from "@testing-library/react";
import { CardGrid, exportedForTesting } from "../CardGrid";

// Import private methods
const { textQueryFilter, tagQueryFilter, searchFilter } = exportedForTesting;

// Function tests

test('textQueryFilter false when not matching', () => {
    let subject = {
        name: "Name",
        description: "Description",
    };
    expect(textQueryFilter(subject, "<match>")).toBe(false);
});

test('textQueryFilter true when matching in name', () => {
    let subject = {
        name: "Name <match>",
        description: "Description",
    };
    expect(textQueryFilter(subject, "<match>")).toBe(true);
});

test('textQueryFilter true when matching in description', () => {
    let subject = {
        name: "Name",
        description: "Description <match>",
    };
    expect(textQueryFilter(subject, "<match>")).toBe(true);
});

test('tagQueryFilter false when not matching', () => {
    let subject = {
        tags: [1]
    };
    expect(tagQueryFilter(subject, [2])).toBe(false);
});

test('textQueryFilter true when matching for a 1-tag list', () => {
    let subject = {
        tags: [1, 2]
    };
    expect(tagQueryFilter(subject, [2])).toBe(true);
});

test('textQueryFilter false when matching only some tags', () => {
    let subject = {
        tags: [1, 2]
    };
    expect(tagQueryFilter(subject, [2, 3])).toBe(false);
});

test('textQueryFilter true when matching for a multi-tag list', () => {
    let subject = {
        tags: [1, 2, 3]
    };
    expect(tagQueryFilter(subject, [2, 3])).toBe(true);
});

test('searchFilter false when not matching text', () => {
    let subject = {
        name: "Name",
        description: "Description",
        tags: [1, 2]
    };
    expect(searchFilter(subject, "<match>", [2])).toBe(false);
});

test('searchFilter false when not matching tags', () => {
    let subject = {
        name: "Name <match>",
        description: "Description",
        tags: [1]
    };
    expect(searchFilter(subject, "<match>", [2])).toBe(false);
});

test('searchFilter true when matching', () => {
    let subject = {
        name: "Name <match>",
        description: "Description",
        tags: [1, 2]
    };
    expect(searchFilter(subject, "<match>", [2])).toBe(true);
});

// Component tests

test('CardGrid renders without crashing', () => {
    renderWithRouter(<CardGrid subjects={[]} />);
});

test('CardGrid shows a subject', () => {
    let subjects = [
        {
            name: "Name",
            slug: "name",
            description: "Description",
            tags: [1],
            icon: "",
        },
    ];

    renderWithRouter(<CardGrid subjects={subjects} />);

    expect(screen.getByText("Name")).toBeInTheDocument()
});

test('CardGrid filters subjects by text filter', () => {
    let subjects = [
        {
            name: "Name1",
            slug: "name1",
            description: "Description",
            tags: [1],
            icon: "",
        },
        {
            name: "Name2",
            slug: "name2",
            description: "Description",
            tags: [1],
            icon: "",
        },
    ];

    renderWithRouter(<CardGrid subjects={subjects} textQuery="Name1" />);

    expect(screen.getByText("Name1")).toBeInTheDocument();
    expect(screen.queryByText("Name2")).not.toBeInTheDocument();
});

test('CardGrid filters subjects by description filter', () => {
    let subjects = [
        {
            name: "Name1",
            slug: "name1",
            description: "Description1",
            tags: [1],
            icon: "",
        },
        {
            name: "Name2",
            slug: "name2",
            description: "Description2",
            tags: [1],
            icon: "",
        },
    ];

    renderWithRouter(<CardGrid subjects={subjects} textQuery="Description1" />);

    expect(screen.getByText("Name1")).toBeInTheDocument();
    expect(screen.queryByText("Name2")).not.toBeInTheDocument();
});

test('CardGrid filters subjects by tag filter', () => {
    let subjects = [
        {
            name: "Name1",
            slug: "name1",
            description: "Description1",
            tags: [1],
            icon: "",
        },
        {
            name: "Name2",
            slug: "name2",
            description: "Description2",
            tags: [2],
            icon: "",
        },
    ];

    renderWithRouter(<CardGrid subjects={subjects} tagQuery={[1]} />);

    expect(screen.getByText("Name1")).toBeInTheDocument();
    expect(screen.queryByText("Name2")).not.toBeInTheDocument();
});

