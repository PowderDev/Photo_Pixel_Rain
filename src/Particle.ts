export default class Particle {
  x: number
  y: number
  speed: number
  velocity: number
  size: number
  angle: number

  constructor(
    public canvas: HTMLCanvasElement,
    public ctx: CanvasRenderingContext2D,
    public mappedImage: [number, string][][]
  ) {
    this.x = Math.random() * this.canvas.width
    this.y = Math.random() * this.canvas.height
    this.speed = 0
    this.velocity = Math.random() * 0.5
    this.size = Math.random() * 1.5 + 1
    this.angle = 0
  }

  private get roundedX() {
    return Math.floor(this.x)
  }

  private get roundedY() {
    return Math.floor(this.y)
  }

  update() {
    if (this.mappedImage[this.roundedY] && this.mappedImage[this.roundedY][this.roundedX]) {
      this.speed = this.mappedImage[this.roundedY][this.roundedX][0]
    }
    let movement = 3 - this.speed + this.velocity

    this.y += movement
    if (this.y >= this.canvas.height) {
      this.y = 0
      this.x = Math.random() * this.canvas.width
    }
  }

  curveUpdate() {
    if (this.mappedImage[this.roundedY] && this.mappedImage[this.roundedY][this.roundedX]) {
      this.speed = this.mappedImage[this.roundedY][this.roundedX][0]
    }
    let movement = 3.5 - this.speed + this.velocity
    this.angle += this.speed / 40
    this.size = this.speed * 1.5

    this.y -= movement
    this.x += movement + Math.sin(this.angle) * 2
    if (this.y <= 0) {
      this.y = this.canvas.height
      this.x = Math.random() * this.canvas.width
    }
    if (this.x >= this.canvas.width) {
      this.x = 0
      this.y = Math.random() * this.canvas.height
    }
  }

  whirlUpdate() {
    if (this.mappedImage[this.roundedY]) {
      if (this.mappedImage[this.roundedY][this.roundedX]) {
        this.speed = this.mappedImage[this.roundedY][this.roundedX][0]
      }
    }
    this.angle += this.speed / 20
    let movement = 2.5 - this.speed + this.velocity
    this.y -= movement + Math.cos(this.angle) * 2
    this.x += Math.cos(this.angle) * 2
    if (this.y <= 0) {
      this.y = this.canvas.height
      this.x = Math.random() * this.canvas.width
    }
  }

  draw(monochrome = false) {
    this.ctx.beginPath()
    if (monochrome) {
      this.ctx.fillStyle = "white"
    } else {
      if (this.mappedImage[this.roundedY] && this.mappedImage[this.roundedY][this.roundedX]) {
        this.ctx.fillStyle = this.mappedImage[this.roundedY][this.roundedX][1]
      }
    }
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    this.ctx.fill()
  }
}
