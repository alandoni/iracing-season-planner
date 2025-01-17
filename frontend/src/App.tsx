import "reflect-metadata"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ConsoleLogger } from "@alandoni/frontend/utils/logger"
import { Column } from "@alandoni/frontend/components/atoms/column"
import { Header } from "src/components/header"
import { Navigation } from "src/components/navigation"
import { Warning } from "src/components/warning"
import { LazyPageLoad } from "@alandoni/frontend/components/templates/lazy_page_load"
import { PageWithHeader } from "@alandoni/frontend/components/templates/page-with-header"
import { DependencyInjection } from "@alandoni/utils"
import { IRacingModule } from "./iracing-module"
import { PaymentModule } from "./payment-module"
import { HttpClientImpl } from "@alandoni/frontend/utils/http_client"
import "./App.css"

const VITE_API_ADDRESS = import.meta.env.VITE_API_ADDRESS
const modules = [new IRacingModule(), new PaymentModule()]

DependencyInjection.initialize((di) => {
  di.modules(...modules)
  di.factory(ConsoleLogger, () => new ConsoleLogger())
  di.factory(HttpClientImpl, () => new HttpClientImpl(VITE_API_ADDRESS))
})

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
          <Route
            index={true}
            element={
              <LazyPageLoad
                factory={import("src/modules/iracing/views/pages/season/season")}
                componentName="SeasonPage"
              />
            }
          />
          <Route
            path="/series"
            element={
              <LazyPageLoad
                factory={import("src/modules/iracing/views/pages/series/series")}
                componentName="SeriesPage"
              />
            }
          />
          <Route
            path="/cars"
            element={
              <LazyPageLoad factory={import("src/modules/iracing/views/pages/cars/cars")} componentName="CarsPage" />
            }
          />
          <Route
            path="/tracks"
            element={
              <LazyPageLoad
                factory={import("src/modules/iracing/views/pages/tracks/tracks")}
                componentName="TracksPage"
              />
            }
          />
          <Route
            path="/summary"
            element={
              <LazyPageLoad
                factory={import("src/modules/iracing/views/pages/summary/summary")}
                componentName="SummaryPage"
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </PageWithHeader>
  )
}

export default App
