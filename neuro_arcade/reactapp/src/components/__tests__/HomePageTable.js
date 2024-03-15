import {screen} from "@testing-library/react";
import {HomePageTable} from "../HomePageTable";

test("HomePageTable renders without crashing", () => {
    renderWithRouter(<HomePageTable inputData={[]} />);
});

const data = [
    {
        overall_score: 100,
        player: {
            name: "Player1",
            description: "Description"
        }
    },
    {
        overall_score: 80,
        player: {
            name: "Player2",
            description: "Description"
        }
    }
];

test("HomePageTable renders data", () => {
    renderWithRouter(<HomePageTable inputData={data} />);

    expect(screen.getByText("Player1")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("Player2")).toBeInTheDocument();
    expect(screen.getByText("80")).toBeInTheDocument();
});
