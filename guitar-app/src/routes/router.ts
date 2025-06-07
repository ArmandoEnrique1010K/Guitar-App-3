import GuitarPage from "../pages/GuitarPage"

export default function Router() {
  return (
    <BrowserRouter>
    <Routes>
    <Route path= "/" element = {< GuitarPage />} index />
      </Routes>
      </BrowserRouter>
  )
}