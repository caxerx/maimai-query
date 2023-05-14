import React from "react";
import * as ReactDOM from "react-dom/client";
import App from "./App";

function createContainer() {
  const container = document.createElement("div");
  container.style.marginBottom = "8px";

  const block = document.querySelector(
    ".see_through_block.m_15.m_t_10.p_10.p_r.t_l.f_0"
  );
  block?.parentNode?.insertBefore(container, block.nextSibling);

  return container;
}

const rootContainer = createContainer();

ReactDOM.createRoot(rootContainer).render(React.createElement(App));
