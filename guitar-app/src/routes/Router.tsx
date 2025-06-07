import { BrowserRouter, Route, Routes } from "react-router-dom";
import GuitarPage from "../pages/GuitarPage";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GuitarPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}
