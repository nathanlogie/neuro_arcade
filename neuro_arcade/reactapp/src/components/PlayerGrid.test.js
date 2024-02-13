import { queryByText, screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import { PlayerGrid, PlayerGridMode } from "./PlayerGrid";

// We need to mock requestPlayers to control the component
import { requestPlayers } from "../backendRequests";
jest.mock('../backendRequests');

/*
    General note: since PlayerGrid has async behaviour triggered on creation,
    there will be warnings given for state changes happening outside of an
    act() if tests don't wait for the async behaviour to finish.

    This means that all tests must mock requestPlayers and check in some way
    that it was called. For example, by waiting for the loading message to
    disappear or for a player to appear.
*/

test('PlayerGrid renders without crashing', async () => {
    requestPlayers.mockResolvedValue([]);
    renderWithRouter(<PlayerGrid />);

    // Check initial loading render
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    // Check it updates once load is complete
    await waitFor(() => {
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });
});

test('PlayerGrid shows a player', async () => {
    requestPlayers.mockResolvedValue([
        {
            id: 1,
            name: "Player",
            slug: "player",
            is_ai: false,
            user: 1,
            description: "",
            tags: [],
        },
    ]);
    renderWithRouter(<PlayerGrid />);

    expect(await screen.findByText("Player")).toBeInTheDocument();
});

/**
 * Common requestPlayers mock data for all mode unit tests
 */
const modeTestData = [
    {
        id: 1,
        name: "Human",
        slug: "human",
        is_ai: false,
        user: 1,
        description: "",
        tags: [],
    },
    {
        id: 2,
        name: "AI",
        slug: "ai",
        is_ai: true,
        user: 1,
        description: "",
        tags: [],
    },
];

test('PlayerGrid shows human players in ANY mode', async () => {
    requestPlayers.mockResolvedValue(modeTestData);
    renderWithRouter(<PlayerGrid mode={PlayerGridMode.ANY} />);

    expect(await screen.findByText("Human")).toBeInTheDocument();
});

test('PlayerGrid shows AI players in ANY mode', async () => {
    requestPlayers.mockResolvedValue(modeTestData);
    renderWithRouter(<PlayerGrid mode={PlayerGridMode.ANY} />);

    expect(await screen.findByText("AI")).toBeInTheDocument();
});

test('PlayerGrid shows humans in HUMAN mode', async () => {
    requestPlayers.mockResolvedValue(modeTestData);
    renderWithRouter(<PlayerGrid mode={PlayerGridMode.HUMAN} />);

    expect(await screen.findByText("Human")).toBeInTheDocument();
});

test('PlayerGrid hides AIs in HUMAN mode', async () => {
    requestPlayers.mockResolvedValue(modeTestData);
    renderWithRouter(<PlayerGrid mode={PlayerGridMode.HUMAN} />);

    // Ensure loading is finished first
    await waitFor(() => {
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    expect(await screen.queryByText("AI")).not.toBeInTheDocument();
});

test('PlayerGrid hides humans in AI mode', async () => {
    requestPlayers.mockResolvedValue(modeTestData);
    renderWithRouter(<PlayerGrid mode={PlayerGridMode.AI} />);

    // Ensure loading is finished first
    await waitFor(() => {
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    expect(await screen.queryByText("Human")).not.toBeInTheDocument();
});

test('PlayerGrid shows AIs in AI mode', async () => {
    requestPlayers.mockResolvedValue(modeTestData);
    renderWithRouter(<PlayerGrid mode={PlayerGridMode.AI} />);

    expect(await screen.findByText("AI")).toBeInTheDocument();
});

// textQuery, tagQuery, and num are just passed to CardGrid as-is, so there's
// no need to re-test those here
