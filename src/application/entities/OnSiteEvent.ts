export interface OnSiteEvent {
  id: string
  ownerId: string
  latitude: number
  longitude: number
  ticketPriceInCents: number
  date: Date
  name: string
}
