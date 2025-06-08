import { BrowserRouter, Route, Routes } from "react-router-dom";
import GuitarPage from "../pages/GuitarPage";
import GuitarLayout from "../Layout/GuitarLayout";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<GuitarLayout />}>
          <Route path="/" element={<GuitarPage />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
