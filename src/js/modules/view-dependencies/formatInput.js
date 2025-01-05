
    export function formatInput(input) {

        ['input', 'keydown', 'paste'].forEach(ev => {

            input.addEventListener(ev, (e) => {

                // case: if it's an 'keydown' event:
                if(ev === 'keydown') {  
                    if(e.code === 'KeyZ' && e.metaKey) {    // tracking the undo operation
                        setTimeout(() => {    // I need timeout with 1ms to wait until the undo operation of ctrl+Z is over
                            if(input.value.slice(2).includes('> ')) {
                                const sliced = input.value.slice(2)    // slicing the first '> ' out
                                const extraPrefixIndex = sliced.indexOf('> ')
                                if (extraPrefixIndex !== -1) {    // Detect extra prefixes
                                    input.value = '> ' + sliced.slice(extraPrefixIndex + 2); // Remove extras
                                }
                            }
                        }, 10) 
                        /* NOTE: the flickering in the input happens because of this 10ms, which I must have so the browser could bring back the before-the-change/deletion value before I capture it --> else I capture the input value before the browser brings it back (and it's effectively null) --> I guess I will have to put up with that... which is a little annoying
                        */
                    }
                }


                // case: if it's an 'input' event:
                if(ev === 'input') {
                // If the input is empty or has only the prefix, reset it
                    if (input.value === '' || input.value === '>') {
                        input.value = '> ';
                    }
                    // Ensure the input always starts with "> "
                    if (!input.value.startsWith('> ')) {
                        input.value = '> ' + input.value.trimStart();
                    }
                    // Move the cursor 
                    if(input.selectionStart < 2) input.setSelectionRange(2, 2);
                    // input.setSelectionRange(input.value.length, input.value.length);
                }


                // case: if it's an 'paste' event:
                if (ev === 'paste') {
                    const pastedText = (e.clipboardData || window.clipboardData).getData('text'); // Retrieves the text data being pasted. `e.clipboardData` is a modern browser API providing access to clipboard content during a paste event. '.getData('text')' extracts the plain text content from the clipboard.
                    const currentValue = input.value; // Get current value in the input field
                    input.value = currentValue + pastedText.trim(); // Append the pasted text to the current value
                    e.preventDefault(); // Prevents the default paste behaviour of the browser
                    input.setSelectionRange(input.value.length, input.value.length); // Moves the blinking cursor (caret) to the end of the input field after updating its value
                }


            })
        })
    }
