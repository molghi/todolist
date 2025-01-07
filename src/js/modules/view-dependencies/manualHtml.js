export function manual() {
    const manual = `<div class="manual-section">
                <div class="manual-section-title">Commands To Add New:</div>
                <ol>
                    <li class="manual-section-line-wrapper">
                        <div class="manual-section-line">
                            <span class="manual-command"><span>add</span> buy milk</span> &mdash;
                            <span class="manual-command-explanation">Adds "buy milk" as a task on the list. You don't need to wrap your task name (or any other flag value) in quotes.</span>
                        </div>
                    </li>
                    <li class="manual-section-line-wrapper">
                        <div class="manual-section-line">
                            <span class="manual-command"><span>add</span> buy milk -p high -c food -d today</span> &mdash;
                            <span class="manual-command-explanation">Adds "buy milk" with extra flags: priority (flag -p or --prio) will be "high", category (flag -c or --cat) will be "food", deadline (flag -d or --dead) will be "today"</span>
                        </div>
                    </li>
                    <li class="manual-section-line-wrapper">
                        <div class="manual-section-line">
                            <span class="manual-command"><span>add</span> food shopping -c food -s buy apples, buy oranges, buy bananas</span> &mdash;
                            <span class="manual-command-explanation">Adds "food shopping" with extra flags: category (-c or --cat) will be "food", and it will have 3 subtasks (flag -s or --sub): "buy apples", "buy oranges", and "buy bananas" (if there is more than one subtask to add, they must be separated by commas)</span>
                        </div>
                    </li>
                    <li class="manual-section-line-wrapper">
                        <div class="manual-section-line">
                            <span class="manual-command"><span>add</span> 1 buy milk</span> &mdash;
                            <span class="manual-command-explanation">Assuming that there is an item with the index of 1 on the list, it adds a subtask to it, named "buy milk"</span>
                        </div>
                    </li>
                    <li class="manual-section-line-wrapper">
                        <div class="manual-section-line">
                            <span class="manual-command"><span>add</span> 1 buy milk, buy tea</span> &mdash;
                            <span class="manual-command-explanation">Assuming that there is an item with the index of 1 on the list, it adds 2 subtasks to it, "buy milk" and "buy tea" (if there is more than one subtask to add, they must be separated by commas)</span>
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
                <div class="manual-section-title">Commands To Edit/Complete:</div>
                <ol>
                    <li class="manual-section-line-wrapper">
                        <div class="manual-section-line">
                            <span class="manual-command"><span>edit</span> 1 -n hello world</span> &mdash;
                            <span class="manual-command-explanation">Changes the name (flag -n or --name) of the item with the index of 1 to "hello world". In editing, you must always pass flags, even when editing a name.</span>
                        </div>
                    </li>
                    <li class="manual-section-line-wrapper">
                        <div class="manual-section-line">
                            <span class="manual-command"><span>edit</span> 1 -n buy bread -p medium -c bakery -d tomorrow</span> &mdash;
                            <span class="manual-command-explanation">Changes the name (flag -n or --name) of the item with the index of 1 to "buy bread", its priority (flag -p or --prio) to "medium", its category (flag -c or --cat) to "bakery", and its deadline (flag -d or --dead) to "tomorrow"</span>
                        </div>
                    </li>
                    <li class="manual-section-line-wrapper">
                        <div class="manual-section-line">
                            <span class="manual-command"><span>edit</span> 1 -f true</span> &mdash;
                            <span class="manual-command-explanation">Effectively, completes the to-do with the index of 1 (changes its finished flag, -f or --finished, to true)</span>
                        </div>
                    </li>
                    <li class="manual-section-line-wrapper">
                        <div class="manual-section-line">
                            <span class="manual-command"><span>edit</span> 1 -f false</span> &mdash;
                            <span class="manual-command-explanation">Effectively, uncompletes the to-do with the index of 1 (changes its finished flag, -f or --finished, to false)</span>
                        </div>
                    </li>
                    <li class="manual-section-line-wrapper">
                        <div class="manual-section-line">
                            <span class="manual-command"><span>edit</span> 1.1 -n do something</span> &mdash;
                            <span class="manual-command-explanation">Changes the name (flag -n or --name) of the subtask with the index of 1.1 to "do something"</span>
                        </div>
                    </li>
                    <li class="manual-section-line-wrapper">
                        <div class="manual-section-line">
                            <span class="manual-command"><span>edit</span> 1.1 -f true</span> &mdash;
                            <span class="manual-command-explanation">Effectively, completes the subtask with the index of 1.1 (changes its finished flag, -f or --finished, to true)</span>
                        </div>
                    </li>
                </ol>
            </div>
            <div class="manual-section">
                <div class="manual-section-title">Commands To Filter:</div>
                <ol>
                    <li class="manual-section-line-wrapper">
                        <div class="manual-section-line">
                            <span class="manual-command"><span>fil</span> -n buy</span> &mdash;
                            <span class="manual-command-explanation">Filters by name (flag -n) and shows only those items that have "buy" in their names. To filter, you must always pass both a flag and a value to look for. (you can write "filter" instead of "fil" there)</span>
                        </div>
                    </li>
                    <li class="manual-section-line-wrapper">
                        <div class="manual-section-line">
                            <span class="manual-command"><span>fil</span> -p high</span> &mdash;
                            <span class="manual-command-explanation">Filters by priority (flag -p) and shows only those items that have the priority set to "high"</span>
                        </div>
                    </li>
                    <li class="manual-section-line-wrapper">
                        <div class="manual-section-line">
                            <span class="manual-command"><span>fil</span> -c food</span> &mdash;
                            <span class="manual-command-explanation">Filters by category (flag -c) and shows only those items that have "food" in their category</span>
                        </div>
                    </li>
                    <li class="manual-section-line-wrapper">
                        <div class="manual-section-line">
                            <span class="manual-command"><span>fil</span> -d overdue</span> &mdash;
                            <span class="manual-command-explanation">Filters by deadline (flag -d) and shows only those items that are overdue</span>
                        </div>
                    </li>
                    <li class="manual-section-line-wrapper">
                        <div class="manual-section-line">
                            <span class="manual-command"><span>fil</span> -s true</span> &mdash;
                            <span class="manual-command-explanation">Filters by the subtasks state (flag -s) and shows only those items that have subtasks</span>
                        </div>
                    </li>
                    <li class="manual-section-line-wrapper">
                        <div class="manual-section-line">
                            <span class="manual-command"><span>fil</span> -f false</span> &mdash;
                            <span class="manual-command-explanation">Filters by the finished state (-f) and shows only those items that are not finished</span>
                        </div>
                    </li>
                    <li class="manual-section-line-wrapper">
                        <div class="manual-section-line">
                            <span class="manual-command"><span>fil</span> all</span> &mdash;
                            <span class="manual-command-explanation">Removes any filter</span>
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
                    <li class="manual-section-line-wrapper">
                        <div class="manual-section-line">
                            <span class="manual-command"><span>sort</span> category</span> &mdash;
                            <span class="manual-command-explanation">Sorts the entire table by category: alphabetical A to Z</span>
                        </div>
                    </li>
                    <li class="manual-section-line-wrapper">
                        <div class="manual-section-line">
                            <span class="manual-command"><span>sort</span> deadline</span> &mdash;
                            <span class="manual-command-explanation">Sorts the entire table by deadline: from overdue to upcoming</span>
                        </div>
                    </li>
                    <li class="manual-section-line-wrapper">
                        <div class="manual-section-line">
                            <span class="manual-command"><span>sort</span> subtasks</span> &mdash;
                            <span class="manual-command-explanation">Sorts the entire table by subtasks: from those with subtasks to those without</span>
                        </div>
                    </li>
                    <li class="manual-section-line-wrapper">
                        <div class="manual-section-line">
                            <span class="manual-command"><span>sort</span> finished</span> &mdash;
                            <span class="manual-command-explanation">Sorts the entire table by finished: from the unfinished to finished</span>
                        </div>
                    </li>
                    <li class="manual-section-line-wrapper">
                        <div class="manual-section-line">
                            <span class="manual-command"><span>sort</span> def or sort default</span> &mdash;
                            <span class="manual-command-explanation">Returns the default state (unsorts it)</span>
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
                            <span class="manual-command-explanation">Changes the color of the UI interface to "coral". You can use any HTML colors except those that are too dark since the background is black and its color cannot be changed. You can write "cc def" to return to the default color. (you can write "changecol" instead of "cc" there)</span>
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
                            <span class="manual-command-explanation">A possibility to import your file, which must be formatted the same as the one you can export. Note: importing replaces all of your existing todos with those that are in your import.</span>
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
                            <span class="manual-command"><span>Esc</span></span> &mdash;
                            <span class="manual-command-explanation">Press this key to close this manual you're currently reading.</span>
                        </div>
                    </li>
                </ol>
            </div>`
    
    return manual
}