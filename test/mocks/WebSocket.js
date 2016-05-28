export default class WebSocket {
  ip
  onopen
  onerror
  onerror
  onmessage
  onclose
  lastmessage

  constructor (ip) {
    this.ip = ip
  }

  send = (param) => {
    this.lastmessage = param
  }
}
