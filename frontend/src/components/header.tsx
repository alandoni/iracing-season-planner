import { Text } from "@alandoni/frontend/components/atoms/text"
import { Row } from "@alandoni/frontend/components/atoms/row"
import Import from "assets/import.svg?react"
import Export from "assets/export.svg?react"
import Update from "assets/update.svg?react"
import { ChangeEvent, useRef } from "react"
import {
  ImportingOlderFileError,
  useImportExportViewModel,
} from "src/modules/iracing/views/pages/import_export_view_model"
import "./header.css"

export function Header() {
  const viewModel = useImportExportViewModel()
  const ref = useRef<HTMLInputElement>(null)

  const onImportClick = () => {
    ref.current?.click()
  }

  const onFileChanged = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files?.[0]
    if (!file) {
      throw new Error("File not found")
    }
    try {
      await viewModel.importData(file)
      window.location.reload()
    } catch (e) {
      if (
        e instanceof ImportingOlderFileError &&
        confirm("A versão do arquivo que você está tentando importar é mais antiga do que o conteúdo atual, continuar?")
      ) {
        await viewModel.importData(file, true)
        window.location.reload()
      }
    }
  }

  const onExportClick = async () => {
    const url = await viewModel.exportData()
    if (!url) {
      throw new Error("Exported data wasn't found")
    }
    const a = document.createElement("a")
    a.setAttribute("href", url) // Set "a" element link
    a.setAttribute("download", "exported.irsp") // Set download filename
    a.click() // Start downloading
  }

  const onUpdateClick = async () => {
    viewModel.invalidateCache()
  }

  return (
    <div className="header">
      <Row className="logo-container">
        <div className="red logo"></div>
        <div className="blue logo"></div>
        <Text size="large" relevance="info">
          iRacing Season Planner
        </Text>
        <div className="header-buttons">
          <span title="Atualizar Dados">
            <Update className="svg icon update" viewBox="0 0 24 24" onClick={onUpdateClick} />
          </span>
          <span title="Importar dados - Ler de um arquivo no seu computador">
            <Import className="svg icon import" viewBox="0 0 24 24" onClick={onImportClick} />
          </span>
          <span title="Exportar dados - Salvar em um arquivo no seu computador">
            <Export className="svg icon export" viewBox="0 0 24 24" onClick={onExportClick} />
          </span>
        </div>
      </Row>
      <div className="red bottom-bar"></div>
      <div className="blue bottom-bar"></div>
      <input ref={ref} type="file" id="file" name="file" className="hidden" onChange={onFileChanged} accept=".irsp" />
    </div>
  )
}
