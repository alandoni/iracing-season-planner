import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Column } from "frontend/components/atoms/column"
import { Header } from "components/header"
import { Navigation } from "components/navigation"
import { Warning } from "components/warning"
import { LazyPageLoad } from "frontend/components/templates/lazy_page_load"
import { PageWithHeader } from "frontend/components/templates/page-with-header"
import "./App.css"
import "utils"

function App() {
  return (
    <PageWithHeader
      className="main-column"
      header={
        <Column>
          <Header />
          <Navigation />
          <Warning />
        </Column>
      }
    >
      <BrowserRouter>
        <Routes>
          <Route index={true} element={<LazyPageLoad factory={import("pages/season")} componentName="SeasonPage" />} />
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
    </PageWithHeader>
  )
}

export default App
