
// a fn to make sure that '> ' at the beginning of the input is undeletable

    export function formatInput(input) {    // 'input' is 'View.formInput'

        // setting event listeners for 3 events: input, keydown, and paste 
        // ['input', 'keydown', 'paste'].forEach(ev => {
        ['input', 'keydown'].forEach(ev => {

            input.addEventListener(ev, (e) => {

                // case: if it's an 'keydown' event:
                if(ev === 'keydown') {  
                    if (e.code === 'KeyZ' && (e.metaKey || e.ctrlKey)) {    // tracking the undo operation: if ctrl+Z were pressed
                        setTimeout(() => {    // I need a small timeout to wait until the undo operation of ctrl+Z is over
                            if(input.value.slice(2).includes('> ')) {
                                const sliced = input.value.slice(2)    // slicing '> ' out
                                const extraPrefixIndex = sliced.indexOf('> ')
                                if (extraPrefixIndex !== -1) {    // detecting extra prefixes
                                    input.value = '> ' + sliced.slice(extraPrefixIndex + 2); // removing extras
                                }
                            }
                        }, 10) 
                        /* NOTE: the flickering in the input could happen because of this 10ms, which I must have so the browser could bring back the before-the-change/deletion value before I capture it --> else I capture the input value before the browser brings it back (and it's effectively null/nothing) --> I guess I will have to tolerate that...
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
                // if (ev === 'paste') {
                //     const pastedText = (e.clipboardData || window.clipboardData).getData('text'); // It retrieves the text data being pasted. `e.clipboardData` is a modern browser API providing access to clipboard content during a paste event. '.getData('text')' extracts the plain text content from the clipboard.
                //     const currentValue = input.value; 
                //     input.value = currentValue + pastedText.trim(); // Appends the pasted text to the current value
                //     e.preventDefault(); // Prevents the default paste behaviour of the browser
                //     // Move the cursor 
                //     if(input.selectionStart < 2) input.setSelectionRange(2, 2);
                //     // input.setSelectionRange(input.value.length, input.value.length); // Moves the blinking cursor (caret) to the end of the input field after updating its value
                // }


            })
        })
    }
