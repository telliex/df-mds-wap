// export function loginAnimation ($) {
//   let canvas = document.getElementById('loginAnimation')
//   let ctx = canvas.getContext('2d')
//   let width = $('#loginAnimation').width()
//   let height = width * 0.71
//   canvas.width = width
//   canvas.height = height
//   init()
//   let windmill = new Image()
//   windmill.src = './static/img/windmill.png'
//   windmill.onload = () => {
//     ctx.drawImage(windmill, 20, 200, 100, 100)
//   }
// }
// function init () {
//   let bg = new Image()
//   bg.src = './static/img/loginBg.png'
//   bg.onload = () => {
//     ctx.drawImage(bg, 0, 0, width, height)
//   }
// }
export class LoginAnimation {
  constructor ($) {
    this.canvas = document.getElementById('loginAnimation')
    this.ctx = this.canvas.getContext('2d')
    this.width = $('#loginAnimation').width()
    this.height = this.width * 0.71
    this.canvas.width = this.width
    this.canvas.height = this.height
  }
  init () {
    let num = 1
    let bg = new Image()
    bg.src = './static/img/loginBg.png'
    let windmill = new Image()
    windmill.src = './static/img/windmill.png'
    bg.onload = () => {
      windmill.onload = () => {
        setInterval(() => {
          this.ctx.save()
          this.ctx.clearRect(0, 0, this.width, this.height)
          this.ctx.drawImage(bg, 0, 0, this.width, this.height)
          this.ctx.translate((this.width / 253) + (this.width / 6.4) / 2, this.height / 5.04 + (this.width / 6.4) / 2)
          this.ctx.rotate(num * Math.PI / 180)
          this.ctx.drawImage(windmill, -((this.width / 6.4) / 2), -((this.width / 6.4) / 2), this.width / 6.4, this.width / 6.4)
          this.ctx.restore()
          num++
        }, 33)
      }
    }
  }
}
