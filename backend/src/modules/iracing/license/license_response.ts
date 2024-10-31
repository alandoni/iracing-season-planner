export class LicenseResponse {
  license_group: number
  group_name: string
  min_num_races: number
  participation_credits: number
  min_sr_to_fast_track: number
  min_num_tt: number
  levels: {
    license_id: number
    license_group: number
    license: string
    short_name: string
    license_letter: string
    color: string
  }[]
}
