import { render, screen } from "@testing-library/react";
import React from "react";
import ReactDOM from "react-dom/client";
import WholeApp from "../WholeApp";

describe("WholeApp basic tests", () => {
  // let acontainer;

  // beforeEach(() => {
  //   acontainer = document.createElement("div");
  //   document.body.appendChild(acontainer);
  // });

  // afterEach(() => {
  //   document.body.removeChild(acontainer);
  //   acontainer = null;
  // });

  it("loads WholeApp", async () => {
    let container = document.createElement("div");
    document.body.appendChild(container);
    ReactDOM.createRoot(container).render(<WholeApp />);
  });

  test("renders the topmenu", async () => {
    // ARRANGE
    // ACT
    render(<WholeApp />);
    const topMenu = await screen.findByTestId(/topmenu/);

    // ASSERT
    expect(topMenu).toBeInTheDocument();
  });

  // it(" renders wholeApp via MemoryRouter", () => {
  //   render(
  //     <MemoryRouter>
  //       <Routes>
  //         <Route path="/" element={<WholeApp />}></Route>;
  //       </Routes>
  //     </MemoryRouter>
  //   );
  // });
});
