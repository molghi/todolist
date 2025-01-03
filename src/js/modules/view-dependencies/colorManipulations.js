    // changes UI colour
    function changeUIColors(color, colorUI, showSystemMessage) {
        if(color === 'def' || color === 'default') {
            document.documentElement.style.setProperty('--accent', '#32cd32');
            colorUI = '#32CD32';
            return '#32cd32'
        }
        if(!color) {
            showSystemMessage('error: no color was passed');
            return null
        }
        if(!isValidHTMLColor(color)) {
            showSystemMessage(`error: "${color}" is not a valid html color or is too dark!`);
            return null
        }
        document.documentElement.style.setProperty('--accent', color);
        colorUI = color;
        return color
    }

    // =======================================================================================================================================

    // small helper fn for changeUIColors()
    function isValidHTMLColor(color) { // returns boolean

        // Create a temporary element to validate the colour:
        const element = document.createElement('div')
        element.style.color = color

        // Temporarily append the element to the document body
        document.body.appendChild(element)

        // PART 1/2: Check if the color is a valid HTML colour
        if (element.style.color === '') {
            return false
        }

        // PART 2/2: Check if the typed colour is not too dark:

        // Get the computed colour in RGB format
        const computedColor = window.getComputedStyle(element).color
        // console.log(`'${computedColor}'`)

        // Remove the temporary element from the document
        document.body.removeChild(element);

        // Extract RGB values using regex
        const match = computedColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (!match) {
            console.error(`Error parsing RGB from: ${computedColor}`);
            return false; // Invalid format, unexpected result
        }

        // Extract RGB components
        const [r, g, b] = match.slice(1).map(Number);

        // Debug: Log extracted RGB values
        // console.log(`Extracted RGB: r=${r}, g=${g}, b=${b}`);

        // Calculate relative luminance (W3C formula)
        const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

        // Debug: Log computed luminance
        // console.log(`Computed Luminance: ${luminance}`);

        // Define the darkness threshold (for #555)
        // const darknessThreshold = (0.2126 * 85 + 0.7152 * 85 + 0.0722 * 85) / 255;
        const darknessThreshold = 0.1

        // Debug: Log darkness threshold
        // console.log(`Darkness Threshold: ${darknessThreshold}`);

        // Return false if luminance is below the threshold
        return luminance >= darknessThreshold;
    }

    // =======================================================================================================================================

    // runs on app init: we check LS 'colorUI' and if exists, this fn runs
    function setAccentColor(color, colorUI) {
        if(!color) return
        document.documentElement.style.setProperty('--accent', color)
        colorUI = color
    }



    export { changeUIColors, isValidHTMLColor, setAccentColor }