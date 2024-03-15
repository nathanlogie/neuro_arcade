import {screen} from "@testing-library/react";
import {Switcher} from "../Switcher";
import userEvent from "@testing-library/user-event";

test("Switcher renders without crashing", () => {
    renderWithRouter(
        <Switcher
            data={{
                table_headers: [{name: "Name"}]
            }}
            switcherDefault={"Name"}
        />
    );

    expect(screen.getByText("Name")).toBeInTheDocument();
});

test("Switcher renders multiple headers without crashing", () => {
    renderWithRouter(
        <Switcher
            data={{
                table_headers: [{name: "Name1"}, {name: "Name2"}]
            }}
            switcherDefault={"Name1"}
        />
    );

    expect(screen.getByText("Name1")).toBeInTheDocument();

    expect(screen.getByText("Name2")).toBeInTheDocument();
});

test("Switcher callback works", () => {
    let called = false;
    function cb(val) {
        called = true;
        expect(val).toBe("Name2");
    }

    renderWithRouter(
        <Switcher
            data={{
                table_headers: [{name: "Name1"}, {name: "Name2"}]
            }}
            onSwitcherChange={cb}
            switcherDefault={"Name1"}
        />
    );

    userEvent.click(screen.getByText("Name2"));

    expect(called).toBe(true);
});
