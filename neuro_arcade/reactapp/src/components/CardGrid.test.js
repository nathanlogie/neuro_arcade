// Import private methods
import { exportedForTesting } from "./CardGrid";
const { textQueryFilter, tagQueryFilter, searchFilter } = exportedForTesting;

test('textQueryFilter false when not matching', () => {
    let game = {
        name: "Name",
        description: "Description",
    };
    expect(textQueryFilter(game, "<match>")).toBe(false);
});

test('textQueryFilter true when matching in name', () => {
    let game = {
        name: "Name <match>",
        description: "Description",
    };
    expect(textQueryFilter(game, "<match>")).toBe(true);
});

test('textQueryFilter true when matching in description', () => {
    let game = {
        name: "Name",
        description: "Description <match>",
    };
    expect(textQueryFilter(game, "<match>")).toBe(true);
});

test('tagQueryFilter false when not matching', () => {
    let game = {
        tags: [1]
    };
    expect(tagQueryFilter(game, [2])).toBe(false);
});

test('textQueryFilter true when matching for a 1-tag list', () => {
    let game = {
        tags: [1, 2]
    };
    expect(tagQueryFilter(game, [2])).toBe(true);
});

test('textQueryFilter false when matching only some tags', () => {
    let game = {
        tags: [1, 2]
    };
    expect(tagQueryFilter(game, [2, 3])).toBe(false);
});

test('textQueryFilter true when matching for a multi-tag list', () => {
    let game = {
        tags: [1, 2, 3]
    };
    expect(tagQueryFilter(game, [2, 3])).toBe(true);
});

test('searchFilter false when not matching text', () => {
    let game = {
        name: "Name",
        description: "Description",
        tags: [1, 2]
    };
    expect(searchFilter(game, "<match>", [2])).toBe(false);
});

test('searchFilter false when not matching tags', () => {
    let game = {
        name: "Name <match>",
        description: "Description",
        tags: [1]
    };
    expect(searchFilter(game, "<match>", [2])).toBe(false);
});

test('searchFilter true when matching', () => {
    let game = {
        name: "Name <match>",
        description: "Description",
        tags: [1, 2]
    };
    expect(searchFilter(game, "<match>", [2])).toBe(true);
});
