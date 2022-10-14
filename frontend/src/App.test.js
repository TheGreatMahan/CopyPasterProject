import { render, fireEvent, screen, within } from "@testing-library/react";
import App from "./App";

test("test AutoComplete selection", () => {
    render(<App />);
    const autocomplete = screen.getByTestId("autocomplete");
    const input = within(autocomplete).getByLabelText("pick a word");
    fireEvent.click(input); // sets focus
    fireEvent.change(input, { target: { value: "Mahan" } });
    fireEvent.keyDown(autocomplete, { key: "ArrowDown" });
    fireEvent.keyDown(autocomplete, { key: "Enter" });
    fireEvent.change(input, { target: { value: "is" } });
    fireEvent.keyDown(autocomplete, { key: "ArrowDown" });
    fireEvent.keyDown(autocomplete, { key: "Enter" });
    fireEvent.change(input, { target: { value: "Awesome" } });
    fireEvent.keyDown(autocomplete, { key: "ArrowDown" });
    fireEvent.keyDown(autocomplete, { key: "Enter" });
    expect(screen.getByText("Mahan is Awesome")).toBeInTheDocument();
});
