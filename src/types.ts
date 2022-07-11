export interface Order {
  id: number
  price: number
  side: "Sell" | "Buy"
  size: number
  symbol: "XBTUSD"
  timestamp: string
}
