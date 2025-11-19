<!-- markdownlint-disable heading-start-left first-line-h1 -->

<div align="center">

<img src="images/mainIcon512.png" alt="mainIcon" width="150">

</div>

# LaTeX Lint

## Abstract

This extension provides a LaTeX Linter for `.tex` and `.md` files with useful commands for academic writing.

![abstract](images/abstract.png)

[Web Version](https://hirokihamaguchi.github.io/latexlint/) is also available.
We welcome any kind of feedback, suggestions, and pull requests!

## Rules

Here is the list of rules we detect.

<!-- AUTO_GENERATED_LIST -->

Please also refer to [sample/lint.pdf](https://github.com/hari64boli64/latexlint/blob/master/sample/lint.pdf) and [our Japanese article (日本語解説記事)](https://qiita.com/hari64/items/3f973625551fbce3a08a) if needed.

<!-- AUTO_GENERATED_RULES -->

## Other Features

You can also use the following features. These commands are available by clicking the icon on the editor toolbar.

![enableDisableButton](images/enableDisableButton.png)

### LaTeX Lint: Add Custom Detection Rule

Add your own rule to detect.
For example, we can detect `f^a` by the following steps.

#### 1. Select the string you want to detect (optional)

![addRule1](images/addRule1.png)

#### 2. Run the command (Add Custom Detection Rule)

Run the commands by clicking the icon or opening the command palette (`Ctrl`+`Shift`+`P`) and type `LaTeX Lint: Add Custom Detection Rule`.

![addRule2](images/addRule2.png)

#### 3. Follow the instructions

If you choose `string`, we detect the input itself.
If you choose `Regex`, we detect the pattern using Regex.

Then, you can define your own rule.

### LaTeX Lint: Choose Detection Rules

Select which rules to detect. Check the rules you want to detect.

![selectRules](images/selectRulesToDetect.png)

### LaTeX Lint: Rename Command or Label

Rename by pressing `F2` on the `\begin{name}`, `\end{name}` or `\label{name}`.

![renameCommand](images/renameCommand.png)

### Go to Label Definition

Jump to the corresponding `\label{xxx}` definition by pressing `F12` on `\ref{xxx}`, `\cref{xxx}`, or `\Cref{xxx}`.

This feature searches for the matching `\label{xxx}` in the current file and jumps to the first non-commented occurrence

### LaTeX Lint: Query Wolfram Alpha

Query Wolfram Alpha to solve the equation.

#### 1. Select the equation you want to solve

![askWolframAlpha1](images/askWolframAlpha1.png)

#### 2. Run the command (Query Wolfram Alpha)

Run the commands by clicking the icon or opening the command palette (`Ctrl`+`Shift`+`P`) and type `LaTeX Lint: Query Wolfram Alpha`.

![askWolframAlpha2](images/askWolframAlpha2.png)

#### 3. Check the Wolfram Alpha page

You can see the result on the Wolfram Alpha page. We remove some unnecessary commands when sending the equation.

![askWolframAlpha3](images/askWolframAlpha3.png)

## Note

As stated in the [Rules](#rules), false positives and false negatives may occur. We apologize for the inconvenience. If you find any errors, please report them via [GitHub Issues](https://github.com/hari64boli64/latexlint/issues).

**We always welcome any kind of feedback, suggestions, and pull requests!**

When writing papers, please ensure you follow the style specified by the academic society or publisher.

We hope our extension will help you write papers.

## Change Log

Refer to [CHANGELOG.md](CHANGELOG.md).

## License

This project consists of multiple components with different licenses:

1. Main Extension (Root Directory)
   Licensed under the [MIT License](LICENSE).
   See LICENSE file for details.

   (The library [to-title-case](https://github.com/gouch/to-title-case/tree/master) is also under MIT License.)

2. Web Component (web/ directory)
   Licensed under the [Apache License 2.0](web/LICENSE).
   See web/LICENSE file for details.

   The web component includes code from:
   * textlint (MIT License)
   * kuromoji.js (Apache License 2.0)

## Acknowledgement

In some aspects, our extension resembles

* LaTeX package [chktex](https://ctan.org/pkg/chktex)
* VS Code Extension [Markdownlint](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint)
* Linter for natural language text [textlint](https://github.com/textlint/textlint)
* VS Code Extension [LaTeX Begin End Auto Rename](https://marketplace.visualstudio.com/items?itemName=wxhenry.latex-begin-end-auto-rename)

We sincerely appreciate the developers of these tools.
