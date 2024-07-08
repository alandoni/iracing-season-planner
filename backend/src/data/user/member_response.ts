import { License } from "../license/ir_license"

export type MemberResponse = {
  cust_id: number
  display_name: string
  helmet: {
    pattern: number
    color1: string
    color2: string
    color3: string
    face_type: number
    helmet_type: number
  }
  member_since: Date
  club_id: number
  club_name: string
  licenses: License[]
}
