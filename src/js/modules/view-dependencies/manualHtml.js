export function manual() {
    const manual = `<div class="manual-section">
                <div class="manual-section-title">Commands To Add New:</div>
                <ol>
                    <li class="manual-section-line-wrapper">
                        <div class="manual-section-line">
                            <span class="manual-command"><span>add</span> buy milk</span> &mdash;
                            <span class="manual-command-explanation">Adds "buy milk"</span>
                        </div>
                    </li>
                    <li class="manual-section-line-wrapper">
                        <div class="manual-section-line">
                            <span class="manual-command"><span>add</span> buy milk -p high -c food -d today</span> &mdash;
                            <span class="manual-command-explanation">Adds "buy milk" with extra flags: priority (flag -p) will be "high", category (flag -c) will be "food", deadline (flag -d) will be "today"</span>
                        </div>
                    </li>
                    <li class="manual-section-line-wrapper">
                        <div class="manual-section-line">
                            <span class="manual-command"><span>add</span> food shopping -c food -s buy apples, buy oranges, buy bananas</span> &mdash;
                            <span class="manual-command-explanation">Adds "food shopping" with extra flags: category (-c) will be "food", and it will have 3 subtasks: "buy apples", "buy oranges", and "buy bananas"</span>
                        </div>
                    </li>
                    <li class="manual-section-line-wrapper">
                        <div class="manual-section-line">
                            <span class="manual-command"><span>add</span> 1 buy milk</span> &mdash;
                            <span class="manual-command-explanation">Assuming that there is an item with the index of 1 in the table, it adds a subtask to it, named "buy milk"</span>
                        </div>
                    </li>
                </ol>
            </div>
            <div class="manual-section">
                <div class="manual-section-title">Commands To Delete:</div>
                <ol>
                    <li class="manual-section-line-wrapper">
                        <div class="manual-section-line">
                            <span class="manual-command"><span>del</span> 1</span> &mdash;
                            <span class="manual-command-explanation">Deletes the item with the index of 1 (you can write "delete" instead of "del" there)</span>
                        </div>
                    </li>
                    <li class="manual-section-line-wrapper">
                        <div class="manual-section-line">
                            <span class="manual-command"><span>del</span> 1.1</span> &mdash;
                            <span class="manual-command-explanation">Deletes the subtask with the index of 1.1</span>
                        </div>
                    </li>
                </ol>
            </div>
            <div class="manual-section">
                <div class="manual-section-title">Commands To Edit:</div>
                <ol>
                    <li class="manual-section-line-wrapper">
                        <div class="manual-section-line">
                            <span class="manual-command"><span>edit</span> 1 -n hello world</span> &mdash;
                            <span class="manual-command-explanation">Changes the name (-n) of the item with the index of 1 to "hello world"</span>
                        </div>
                    </li>
                    <li class="manual-section-line-wrapper">
                        <div class="manual-section-line">
                            <span class="manual-command"><span>edit</span> 1 -n buy bread -p medium -c bakery -d tomorrow</span> &mdash;
                            <span class="manual-command-explanation">Changes the name (flag -n) of the item with the index of 1 to "buy bread", its priority (-p) to "medium", its category (-c) to "bakery", and its deadline (-d) to "tomorrow"</span>
                        </div>
                    </li>
                    <li class="manual-section-line-wrapper">
                        <div class="manual-section-line">
                            <span class="manual-command"><span>edit</span> 1 -f true</span> &mdash;
                            <span class="manual-command-explanation">Effectively, completes the to-do with the index of 1 (changes its finished flag to true)</span>
                        </div>
                    </li>
                    <li class="manual-section-line-wrapper">
                        <div class="manual-section-line">
                            <span class="manual-command"><span>edit</span> 1 -f false</span> &mdash;
                            <span class="manual-command-explanation">Effectively, uncompletes the to-do with the index of 1 (changes its finished flag to false)</span>
                        </div>
                    </li>
                    <li class="manual-section-line-wrapper">
                        <div class="manual-section-line">
                            <span class="manual-command"><span>edit</span> 1.1 -n do something</span> &mdash;
                            <span class="manual-command-explanation">Changes the name (-n) of the subtask with the index of 1.1 to "do something"</span>
                        </div>
                    </li>
                    <li class="manual-section-line-wrapper">
                        <div class="manual-section-line">
                            <span class="manual-command"><span>edit</span> 1.1 -f true</span> &mdash;
                            <span class="manual-command-explanation">Effectively, completes the subtask with the index of 1.1 (changes its finished flag to true)</span>
                        </div>
                    </li>
                </ol>
            </div>
            <div class="manual-section">
                <div class="manual-section-title">Commands To Filter:</div>
                <ol>
                    <li class="manual-section-line-wrapper">
                        <div class="manual-section-line">
                            <span class="manual-command"><span>fil</span> -p high</span> &mdash;
                            <span class="manual-command-explanation">Filters and shows only those items that have the priority set to "high" (you can write "filter" instead of "fil" there)</span>
                        </div>
                    </li>
                </ol>
            </div>
            <div class="manual-section">
                <div class="manual-section-title">Commands To Sort:</div>
                <ol>
                    <li class="manual-section-line-wrapper">
                        <div class="manual-section-line">
                            <span class="manual-command"><span>sort</span> priority</span> &mdash;
                            <span class="manual-command-explanation">Sorts the entire table by priority: from "high" to "low" or "null"</span>
                        </div>
                    </li>
                </ol>
            </div>
            <div class="manual-section">
                <div class="manual-section-title">Command To Change The Accent Color:</div>
                <ol>
                    <li class="manual-section-line-wrapper">
                        <div class="manual-section-line">
                            <span class="manual-command"><span>cc</span> coral</span> &mdash;
                            <span class="manual-command-explanation">Changes the color of the UI interface to "coral". You can use any HTML colors except those that are too dark since the background is black and its color cannot be changed. (you can write "changecol" instead of "cc" there)</span>
                        </div>
                    </li>
                </ol>
            </div>
            <div class="manual-section">
                <div class="manual-section-title">Command To Export:</div>
                <ol>
                    <li class="manual-section-line-wrapper">
                        <div class="manual-section-line">
                            <span class="manual-command"><span>export</span></span> &mdash;
                            <span class="manual-command-explanation">Exports a JSON file with all the recent settings and to-dos that you have set.</span>
                        </div>
                    </li>
                </ol>
            </div>
            <div class="manual-section">
                <div class="manual-section-title">Command To Import:</div>
                <ol>
                    <li class="manual-section-line-wrapper">
                        <div class="manual-section-line">
                            <span class="manual-command"><span>import</span></span> &mdash;
                            <span class="manual-command-explanation">A possibility to import your file, which must be formatted the same as the one you can export.</span>
                        </div>
                    </li>
                </ol>
            </div>
            <div class="manual-section">
                <div class="manual-section-title">Command To Clear All:</div>
                <ol>
                    <li class="manual-section-line-wrapper">
                        <div class="manual-section-line">
                            <span class="manual-command"><span>clearall</span></span> &mdash;
                            <span class="manual-command-explanation">This will delete all of your to-dos. It cannot be undone, so be careful.</span>
                        </div>
                    </li>
                </ol>
            </div>
            <div class="manual-section">
                <div class="manual-section-title">Commands To Toggle The Manual:</div>
                <ol>
                    <li class="manual-section-line-wrapper">
                        <div class="manual-section-line">
                            <span class="manual-command"><span>man</span> or <span>manual</span></span> &mdash;
                            <span class="manual-command-explanation">Shows this manual you're currently reading.</span>
                        </div>
                    </li>
                    <li class="manual-section-line-wrapper">
                        <div class="manual-section-line">
                            <span class="manual-command"><span>Q</span> or <span>Esc</span></span> &mdash;
                            <span class="manual-command-explanation">Press those keys to close this manual you're currently reading.</span>
                        </div>
                    </li>
                </ol>
            </div>`
    
    return manual
}