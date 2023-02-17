import Particle from "./Particle"
import "./style.css"

const image = new Image()
image.src = "/cp.jpg"

let monochrome = false
let animation: "whirl" | "rain" | "curve" = "rain"

const canvas = document.querySelector("canvas")!
const ctx = canvas.getContext("2d")!
canvas.width = 640
canvas.height = 856

window.addEventListener("keypress", (e) => {
  if (e.key == "w") {
    monochrome = !monochrome
  } else if (e.key == "a") {
    animation = "curve"
  } else if (e.key == "s") {
    animation = "rain"
  } else if (e.key == "d") {
    animation = "whirl"
  }
})

image.onload = () => {
  ctx.drawImage(image, 0, 0)
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  const mappedImage = [] as [number, string][][]

  for (let y = 0; y < canvas.height; y++) {
    let row = [] as [number, string][]
    for (let x = 0; x < canvas.width; x++) {
      const red = pixels.data[y * 4 * pixels.width + x * 4]
      const green = pixels.data[y * 4 * pixels.width + (x * 4 + 1)]
      const blue = pixels.data[y * 4 * pixels.width + (x * 4 + 2)]
      let brightness = calculateRelativeBrightness(red, green, blue)
      const particle = [brightness, `rgb(${red},${green},${blue})`] as [number, string]
      row.push(particle)
    }
    mappedImage.push(row)
  }

  let particles = [] as Particle[]
  const numberOfParticles = 10000

  for (let i = 0; i < numberOfParticles; i++) {
    particles.push(new Particle(canvas, ctx, mappedImage))
  }

  function animate() {
    if (monochrome) {
      ctx.globalAlpha = 0.025
    } else {
      ctx.globalAlpha = 0.05
    }
    ctx.fillStyle = "rgb(0,0,0)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.globalAlpha = 0.2
    for (let i = 0; i < numberOfParticles; i++) {
      if (animation == "curve") particles[i].curveUpdate()
      else if (animation == "whirl") particles[i].whirlUpdate()
      else if (animation == "rain") particles[i].update()
      if (monochrome) {
        ctx.globalAlpha = particles[i].speed * 0.09
      } else {
        ctx.globalAlpha = particles[i].speed
      }
      particles[i].draw(monochrome)
    }

    requestAnimationFrame(animate)
  }

  animate()
}

function calculateRelativeBrightness(red: number, green: number, blue: number) {
  return Math.sqrt(red ** 2 * 0.299 + green ** 2 * 0.587 + blue ** 2 * 0.114) / 100
}
