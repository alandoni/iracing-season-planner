import { License } from "racing-tools-data/iracing/season/models/license"
import "./license_letter.css"

interface LicenseLetterProps {
  license: License
}

export function LicenseLetter({ license }: LicenseLetterProps) {
  return (
    <div className="license-letter" style={{ backgroundColor: `#${license.color}` }}>
      {license.letter}
    </div>
  )
}
