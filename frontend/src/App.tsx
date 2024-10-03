import { BrowserRouter, Route, Routes } from "react-router-dom"
import { LazyPageLoad } from "components/lazy_page_load"
import { Header } from "components/header"
import { Navigation } from "components/navigation"
import { Column } from "components/column"
import { Page } from "components/page"
import { Warning } from "components/warning"
import "./App.css"

function App() {
  return (
    <Column className="main-column">
      <Header />
      <Navigation />
      <Warning />
      <Page>
        <BrowserRouter>
          <Routes>
            <Route
              index={true}
              element={<LazyPageLoad factory={import("pages/season")} componentName="SeasonPage" />}
            />
            <Route
              path="/series"
              element={<LazyPageLoad factory={import("pages/series")} componentName="SeriesPage" />}
            />
            <Route path="/cars" element={<LazyPageLoad factory={import("pages/cars")} componentName="CarsPage" />} />
            <Route
              path="/tracks"
              element={<LazyPageLoad factory={import("pages/tracks")} componentName="TracksPage" />}
            />
            <Route
              path="/summary"
              element={<LazyPageLoad factory={import("pages/summary")} componentName="SummaryPage" />}
            />
          </Routes>
        </BrowserRouter>
      </Page>
    </Column>
  )
}

export default App
