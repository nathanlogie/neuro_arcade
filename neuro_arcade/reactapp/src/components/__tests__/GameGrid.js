import { screen, waitFor } from "@testing-library/react";
import { GameGrid } from "../GameGrid";

// We need to mock requestGames to control the component
import { requestGames } from "../../backendRequests";
jest.mock('../../backendRequests');

test('GameGrid renders without crashing', async () => {
    requestGames.mockResolvedValue([]);
    renderWithRouter(<GameGrid />);

    // Check initial loading render
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    // Check it updates once load is complete
    await waitFor(() => {
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });
});

test('GameGrid shows a player', async () => {
    requestGames.mockResolvedValue([
        {
            id: 1,
            name: "Game",
            slug: "name",
            description: "",
            owner: 1,
            icon: "",
            tags: [],
            score_type: {},
            play_link: "",
            evaluation_script: null,
        },
    ]);
    renderWithRouter(<GameGrid />);

    expect(await screen.findByText("Game")).toBeInTheDocument();
});

// textQuery, tagQuery, and num are just passed to CardGrid as-is, so there's
// no need to re-test those here
