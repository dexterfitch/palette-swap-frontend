class Patterns {

  constructor(name, style) {
    this.name = name;
    this.style = style;
    this.patterns = [];
  }

  getPatterns = () => {
    fetch(PATTERNS_URL)
    .then(response => response.json())
    .then(patterns => this.renderPatterns(patterns))
  }

  renderPatterns = (patterns) => {
    patterns.data.forEach(pattern => {
      Object.defineProperty(pattern.attributes, 'palettes', {
        value: pattern.relationships.palettes.data
      })

      this.patterns.push(pattern.attributes)
    })

    this.patterns.forEach(pattern => {
      this.renderPatternDropdown(pattern)
    })
  }

  renderPatternDropdown = (pattern) => {
    let option = document.createElement("option")

    option.value = pattern.id
    option.text = pattern.name
    selectPatternDropdown.appendChild(option)
  }

  renderSelectedPattern = (selectedPatternId) => {
    let currentPattern = this.patterns[selectedPatternId - 1]

    let currentPalettes = currentPattern.palettes
    let selectedPatternStyle = this.renderStyle(currentPattern, currentPattern.palettes[0].id)

    palette.className = "palette"
    let patternPreview = document.createElement("div")
    patternPreview.className = "pattern-preview"
    patternPreview.setAttribute("style", selectedPatternStyle)

    clearThenAppend(patternBox, patternPreview)

    this.getRGBValues(currentPattern, currentPattern.palettes[0].id)
    paletteStart.createCurrentStyleTextNode(selectedPatternStyle)
    paletteStart.generateStyleButton()
  }

  renderStyle = (selectedPattern, selectedPaletteID) => {
    let allPalettes = paletteStart.palettes

    let currentPalette = allPalettes.find(pal => pal.id == selectedPaletteID).attributes
    let patternStyleRaw = selectedPattern.style
    let selectedPatternStyle = patternStyleRaw.replace(/COLOR1/g, currentPalette.color1).replace(/COLOR2/g, currentPalette.color2).replace(/COLOR3/g, currentPalette.color3)

    if(currentPalette.color3 === null) {
      color3Section.setAttribute("style", "opacity: 0.25; pointer-events: none;")
    } else {
      color3Section.setAttribute("style", "opacity: 1; pointer-events: auto;")
    }

    return selectedPatternStyle
  }

  getRGBValues = (selectedPattern, selectedPaletteID) => {
    let allPalettes = paletteStart.palettes
    let currentPalette = allPalettes.find(pal => pal.id == selectedPaletteID).attributes
    let color1valueString = currentPalette.color1
    let color2valueString = currentPalette.color2
    let color3valueString = currentPalette.color3

    window.color1RvalueInteger = color1valueString.split(",")[0]
    window.color1GvalueInteger = color1valueString.split(",")[1].replace(" ", "")
    window.color1BvalueInteger = color1valueString.split(",")[2].replace(" ", "")
    window.color2RvalueInteger = color2valueString.split(",")[0]
    window.color2GvalueInteger = color2valueString.split(",")[1].replace(" ", "")
    window.color2BvalueInteger = color2valueString.split(",")[2].replace(" ", "")
    if (color3valueString === null) {
      window.color3RvalueInteger = null
      window.color3GvalueInteger = null
      window.color3BvalueInteger = null
    } else {
      window.color3RvalueInteger = color3valueString.split(",")[0]
      window.color3GvalueInteger = color3valueString.split(",")[1].replace(" ", "")
      window.color3BvalueInteger = color3valueString.split(",")[2].replace(" ", "")
    }

    this.setColorPreviews(selectedPattern, currentPalette)
  }

  setColorPreviews = (selectedPattern, currentPalette) => {
    color1ColorPreview.setAttribute("style", `background-color: rgb(${currentPalette.color1});`)
    color2ColorPreview.setAttribute("style", `background-color: rgb(${currentPalette.color2});`)

    if (!(currentPalette.color3 === null)) {
      color3ColorPreview.setAttribute("style", `background-color: rgb(${currentPalette.color3});`)
    }

    this.setColorValues(selectedPattern, currentPalette)
  }

  setColorValues = (selectedPattern, currentPalette) => {
    let paletteNameH3 = document.createElement("h3")
    let paletteNameText = document.createTextNode(`${currentPalette.name}`)
    paletteNameH3.appendChild(paletteNameText)
    clearThenAppend(paletteName, paletteNameH3)


    let color1RvalueText = document.createTextNode(`${color1RvalueInteger}`)
    let color1GvalueText = document.createTextNode(`${color1GvalueInteger}`)
    let color1BvalueText = document.createTextNode(`${color1BvalueInteger}`)
    let color2RvalueText = document.createTextNode(`${color2RvalueInteger}`)
    let color2GvalueText = document.createTextNode(`${color2GvalueInteger}`)
    let color2BvalueText = document.createTextNode(`${color2BvalueInteger}`)
    let color3RvalueText
    let color3GvalueText
    let color3BvalueText

    if (currentPalette.color3 === null) {
      color3RvalueText = document.createTextNode("...")
      color3GvalueText = document.createTextNode("...")
      color3BvalueText = document.createTextNode("...")
    } else {
      color3RvalueText = document.createTextNode(`${color3RvalueInteger}`)
      color3GvalueText = document.createTextNode(`${color3GvalueInteger}`)
      color3BvalueText = document.createTextNode(`${color3BvalueInteger}`)
    }

    clearThenAppend(paletteColor1Rvalue, color1RvalueText)
    clearThenAppend(paletteColor1Gvalue, color1GvalueText)
    clearThenAppend(paletteColor1Bvalue, color1BvalueText)
    clearThenAppend(paletteColor2Rvalue, color2RvalueText)
    clearThenAppend(paletteColor2Gvalue, color2GvalueText)
    clearThenAppend(paletteColor2Bvalue, color2BvalueText)
    clearThenAppend(paletteColor3Rvalue, color3RvalueText)
    clearThenAppend(paletteColor3Gvalue, color3GvalueText)
    clearThenAppend(paletteColor3Bvalue, color3BvalueText)

    this.addListenersToSliders()

    this.setColorSliders(selectedPattern, currentPalette)
  }

  setColorSliders = (selectedPattern, currentPalette) => {
    color1Rslider.value = color1RvalueInteger
    color1Gslider.value = color1GvalueInteger
    color1Bslider.value = color1BvalueInteger
    color2Rslider.value = color2RvalueInteger
    color2Gslider.value = color2GvalueInteger
    color2Bslider.value = color2BvalueInteger
    if (!(currentPalette.color3 === null)) {
      color3Rslider.value = color3RvalueInteger
      color3Gslider.value = color3GvalueInteger
      color3Bslider.value = color3BvalueInteger
    }
  }

  addListenersToSliders = () => {
    let sliders = document.getElementsByClassName("slider")

    for (var i = 0; i < sliders.length; i++) {
      sliders[i].addEventListener('mouseup', this.updateColorValues, false);
    }
  }

  updateColorValues = (event) => {
    let clickedSlider = event.target

    switch (clickedSlider.id) {
      case "color1-r":
        let color1Rvalue = clickedSlider.value
        let color1RvalueText = document.createTextNode(`${color1Rvalue}`)
        clearThenAppend(paletteColor1Rvalue, color1RvalueText)
        this.updateColorPreview(color1Rvalue, clickedSlider.id)
        paletteStart.generateSaveButton()
      break
      case "color1-g":
        let color1Gvalue = clickedSlider.value
        let color1GvalueText = document.createTextNode(`${color1Gvalue}`)
        clearThenAppend(paletteColor1Gvalue, color1GvalueText)
        this.updateColorPreview(color1Gvalue, clickedSlider.id)
        paletteStart.generateSaveButton()
      break
      case "color1-b":
        let color1Bvalue = clickedSlider.value
        let color1BvalueText = document.createTextNode(`${color1Bvalue}`)
        clearThenAppend(paletteColor1Bvalue, color1BvalueText)
        this.updateColorPreview(color1Bvalue, clickedSlider.id)
        paletteStart.generateSaveButton()
      break
      case "color2-r":
        let color2Rvalue = clickedSlider.value
        let color2RvalueText = document.createTextNode(`${color2Rvalue}`)
        clearThenAppend(paletteColor2Rvalue, color2RvalueText)
        this.updateColorPreview(color2Rvalue, clickedSlider.id)
        paletteStart.generateSaveButton()
      break
      case "color2-g":
        let color2Gvalue = clickedSlider.value
        let color2GvalueText = document.createTextNode(`${color2Gvalue}`)
        clearThenAppend(paletteColor2Gvalue, color2GvalueText)
        this.updateColorPreview(color2Gvalue, clickedSlider.id)
        paletteStart.generateSaveButton()
      break
      case "color2-b":
        let color2Bvalue = clickedSlider.value
        let color2BvalueText = document.createTextNode(`${color2Bvalue}`)
        clearThenAppend(paletteColor2Bvalue, color2BvalueText)
        this.updateColorPreview(color2Bvalue, clickedSlider.id)
        paletteStart.generateSaveButton()
      break
      case "color3-r":
        let color3Rvalue = clickedSlider.value
        let color3RvalueText = document.createTextNode(`${color3Rvalue}`)
        clearThenAppend(paletteColor3Rvalue, color3RvalueText)
        this.updateColorPreview(color3Rvalue, clickedSlider.id)
        paletteStart.generateSaveButton()
      break
      case "color3-g":
        let color3Gvalue = clickedSlider.value
        let color3GvalueText = document.createTextNode(`${color3Gvalue}`)
        clearThenAppend(paletteColor3Gvalue, color3GvalueText)
        this.updateColorPreview(color3Gvalue, clickedSlider.id)
        paletteStart.generateSaveButton()
      break
      case "color3-b":
        let color3Bvalue = clickedSlider.value
        let color3BvalueText = document.createTextNode(`${color3Bvalue}`)
        clearThenAppend(paletteColor3Bvalue, color3BvalueText)
        this.updateColorPreview(color3Bvalue, clickedSlider.id)
        paletteStart.generateSaveButton()
      break
    }
  }

  updateColorPreview = (changedColorValue, sliderID) => {
    let colorNumber = sliderID.split("-")[0]
    let colorLetter = sliderID.split("-")[1]
    
    switch (colorNumber) {
      case "color1":
        if (colorLetter === "r") {
          let colorValueG = paletteColor1Gvalue.textContent
          let colorValueB = paletteColor1Bvalue.textContent
          let rgbValues = `${changedColorValue}, ${colorValueG}, ${colorValueB}`
          color1ColorPreview.setAttribute("style", `background-color: rgb(${rgbValues});`)
          this.updatePatternPreview(colorNumber, rgbValues)
        } else if (colorLetter === "g") {
          let colorValueR = paletteColor1Rvalue.textContent
          let colorValueB = paletteColor1Bvalue.textContent
          let rgbValues = `${colorValueR}, ${changedColorValue}, ${colorValueB}`
          color1ColorPreview.setAttribute("style", `background-color: rgb(${rgbValues});`)
          this.updatePatternPreview(colorNumber, rgbValues)
        } else if (colorLetter === "b") {
          let colorValueR = paletteColor1Rvalue.textContent
          let colorValueG = paletteColor1Gvalue.textContent
          let rgbValues = `${colorValueR}, ${colorValueG}, ${changedColorValue}`
          color1ColorPreview.setAttribute("style", `background-color: rgb(${rgbValues});`)
          this.updatePatternPreview(colorNumber, rgbValues)
        }
        paletteCSSBox.className = "hidden"
        paletteStart.clearStyleName()
        paletteStart.generateStyleButton()
      break
      case "color2":
        if (colorLetter === "r") {
          let colorValueG = paletteColor2Gvalue.textContent
          let colorValueB = paletteColor2Bvalue.textContent
          let rgbValues = `${changedColorValue}, ${colorValueG}, ${colorValueB}`
          color2ColorPreview.setAttribute("style", `background-color: rgb(${rgbValues});`)
          this.updatePatternPreview(colorNumber, rgbValues)
        } else if (colorLetter === "g") {
          let colorValueR = paletteColor2Rvalue.textContent
          let colorValueB = paletteColor2Bvalue.textContent
          let rgbValues = `${colorValueR}, ${changedColorValue}, ${colorValueB}`
          color2ColorPreview.setAttribute("style", `background-color: rgb(${rgbValues});`)
          this.updatePatternPreview(colorNumber, rgbValues)
        } else if (colorLetter === "b") {
          let colorValueR = paletteColor2Rvalue.textContent
          let colorValueG = paletteColor2Gvalue.textContent
          let rgbValues = `${colorValueR}, ${colorValueG}, ${changedColorValue}`
          color2ColorPreview.setAttribute("style", `background-color: rgb(${rgbValues});`)
          this.updatePatternPreview(colorNumber, rgbValues)
        }
        paletteCSSBox.className = "hidden"
        paletteStart.clearStyleName()
        paletteStart.generateStyleButton()
      break
      case "color3":
        if (colorLetter === "r") {
          let colorValueG = paletteColor3Gvalue.textContent
          let colorValueB = paletteColor3Bvalue.textContent
          let rgbValues = `${changedColorValue}, ${colorValueG}, ${colorValueB}`
          color3ColorPreview.setAttribute("style", `background-color: rgb(${rgbValues});`)
          this.updatePatternPreview(colorNumber, rgbValues)
        } else if (colorLetter === "g") {
          let colorValueR = paletteColor3Rvalue.textContent
          let colorValueB = paletteColor3Bvalue.textContent
          let rgbValues = `${colorValueR}, ${changedColorValue}, ${colorValueB}`
          color3ColorPreview.setAttribute("style", `background-color: rgb(${rgbValues});`)
          this.updatePatternPreview(colorNumber, rgbValues)
        } else if (colorLetter === "b") {
          let colorValueR = paletteColor3Rvalue.textContent
          let colorValueG = paletteColor3Gvalue.textContent
          let rgbValues = `${colorValueR}, ${colorValueG}, ${changedColorValue}`
          color3ColorPreview.setAttribute("style", `background-color: rgb(${rgbValues});`)
          this.updatePatternPreview(colorNumber, rgbValues)
        }
        paletteCSSBox.className = "hidden"
        paletteStart.clearStyleName()
        paletteStart.generateStyleButton()
      break
    }
  }

  updatePatternPreview = (colorNumber, rgbValues) => {
    let patternStyleRaw = this.patterns[selectedPatternId - 1].style
    let patternPreview = document.getElementsByClassName("pattern-preview")[0]

    if (colorNumber === "color1") {
      let color2rgb = `${paletteColor2Rvalue.textContent}, ${paletteColor2Gvalue.textContent}, ${paletteColor2Bvalue.textContent}`
      let color3rgb = `${paletteColor3Rvalue.textContent}, ${paletteColor3Gvalue.textContent}, ${paletteColor3Bvalue.textContent}`
      let currentPatternStyle = patternStyleRaw.replace(/COLOR1/g, rgbValues).replace(/COLOR2/g, color2rgb).replace(/COLOR3/g, color3rgb)
      paletteStart.createCurrentStyleTextNode(currentPatternStyle)
      patternPreview.setAttribute("style", currentPatternStyle)
    } else if (colorNumber === "color2") {
      let color1rgb = `${paletteColor1Rvalue.textContent}, ${paletteColor1Gvalue.textContent}, ${paletteColor1Bvalue.textContent}`
      let color3rgb = `${paletteColor3Rvalue.textContent}, ${paletteColor3Gvalue.textContent}, ${paletteColor3Bvalue.textContent}`
      let currentPatternStyle = patternStyleRaw.replace(/COLOR1/g, color1rgb).replace(/COLOR2/g, rgbValues).replace(/COLOR3/g, color3rgb)
      paletteStart.createCurrentStyleTextNode(currentPatternStyle)
      patternPreview.setAttribute("style", currentPatternStyle)
    } else if (colorNumber === "color3") {
      let color1rgb = `${paletteColor1Rvalue.textContent}, ${paletteColor1Gvalue.textContent}, ${paletteColor1Bvalue.textContent}`
      let color2rgb = `${paletteColor2Rvalue.textContent}, ${paletteColor2Gvalue.textContent}, ${paletteColor2Bvalue.textContent}`
      let currentPatternStyle = patternStyleRaw.replace(/COLOR1/g, color1rgb).replace(/COLOR2/g, color2rgb).replace(/COLOR3/g, rgbValues)
      paletteStart.createCurrentStyleTextNode(currentPatternStyle)
      patternPreview.setAttribute("style", currentPatternStyle)
    }
  }

}

