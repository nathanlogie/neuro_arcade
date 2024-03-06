import {screen} from "@testing-library/react";
import {TagFilter} from "../TagFilter";
import userEvent from "@testing-library/user-event";

test("TagFilter renders without crashing", () => {
    renderWithRouter(<TagFilter tags={[]} onTagChange={() => {}} />);
});

const tags = ["Name1", "Name2", "Name3"];

test("TagFilter renders tags without crashing", () => {
    renderWithRouter(<TagFilter tags={tags} onTagChange={() => {}} />);
});

test("TagFilter initial callback sets tags false", () => {
    let calls = 0;
    function cb(val) {
        expect(calls).toBe(0);
        expect(val).toEqual([false, false, false]);
        calls += 1;
    }

    renderWithRouter(<TagFilter tags={tags} onTagChange={cb} />);

    expect(calls).toBe(1);
});

test("TagFilter callback changes ticks", () => {
    let calls = 0;
    function cb(val) {
        expect(calls).toBeLessThan(2);
        if (calls == 0) expect(val).toEqual([false, false, false]);
        else if (calls == 1) expect(val).toEqual([true, false, false]);
        calls += 1;
    }

    renderWithRouter(<TagFilter tags={tags} onTagChange={cb} />);

    userEvent.click(screen.getByText("Name1"));

    expect(calls).toBe(2);
});

test("TagFilter multi-select works", () => {
    let calls = 0;
    function cb(val) {
        expect(calls).toBeLessThan(3);
        if (calls == 0) expect(val).toEqual([false, false, false]);
        else if (calls == 1) expect(val).toEqual([true, false, false]);
        else if (calls == 2) expect(val).toEqual([true, false, true]);
        calls += 1;
    }

    renderWithRouter(<TagFilter tags={tags} onTagChange={cb} />);

    userEvent.click(screen.getByText("Name1"));
    userEvent.click(screen.getByText("Name3"));

    expect(calls).toBe(3);
});

test("TagFilter deselect works", () => {
    let calls = 0;
    function cb(val) {
        expect(calls).toBeLessThan(3);
        if (calls == 0) expect(val).toEqual([false, false, false]);
        else if (calls == 1) expect(val).toEqual([true, false, false]);
        else if (calls == 2) expect(val).toEqual([false, false, false]);
        calls += 1;
    }

    renderWithRouter(<TagFilter tags={tags} onTagChange={cb} />);

    userEvent.click(screen.getByText("Name1"));
    userEvent.click(screen.getByText("Name1"));

    expect(calls).toBe(3);
});
