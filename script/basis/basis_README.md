<!-- markdownlint-disable heading-start-left first-line-h1 -->

# LaTeX Lint

## Abstract

LaTeX Lint is a linter for `.tex` and `.md` files.

[VS Code Extension Version](https://marketplace.visualstudio.com/items?itemName=hari64boli64.latexlint) is available.

![abstract](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/images/abstract.png)

[Web Version](https://hirokihamaguchi.github.io/latexlint/) is also available.

![abstract_web](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/images/abstract_web.png)

## Rules

The detected rules are listed below.

**We strongly recommend enabling only the rules that match your preferences and writing style.** See [LaTeX Lint: Choose Detection Rules](#latex-lint-choose-detection-rules) for details.

<!-- AUTO_GENERATED_LIST -->

Please also refer to [sample/lint.pdf](https://github.com/hari64boli64/latexlint/blob/master/sample/lint.pdf) and [our Japanese article (日本語解説記事)](https://qiita.com/hari64/items/3f973625551fbce3a08a) if needed.

<!-- AUTO_GENERATED_RULES -->

## Disabling Rules

To disable a rule, add `% LLDisable` at the beginning of the line for LaTeX or `<!-- LLDisable -->` for Markdown.

```tex
Line containing an error. % LLDisable
```

```md
Line containing an error. <!-- LLDisable -->
```

To toggle the entire rule on or off, use [LaTeX Lint: Choose Detection Rules](#latex-lint-choose-detection-rules).

## Other Features

You can also use the following features in VS Code. These commands are available by clicking the icon on the editor toolbar.

![enableDisableButton](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/images/enableDisableButton.png)

### LaTeX Lint: Add Custom Detection Rule

Add a custom detection rule.
For example, we can detect `f^a` by the following steps.

#### 1. Select the string you want to detect (optional)

![addRule1](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/images/addRule1.png)

#### 2. Run the command (Add Custom Detection Rule)

Run the command by clicking the icon or by opening the command palette (`Ctrl`+`Shift`+`P`) and typing `LaTeX Lint: Add Custom Detection Rule`.

![addRule2](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/images/addRule2.png)

#### 3. Follow the instructions

If you choose `string`, we detect the input itself.
If you choose `Regex`, we detect the pattern using a regular expression.

Then, you can define your own rule.

### LaTeX Lint: Choose Detection Rules

Select which rules to detect. Check the rules you want to detect.

![selectRules](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/images/selectRulesToDetect.png)

### LaTeX Lint: Rename Command or Label

Rename by pressing `F2` on the `\begin{name}`, `\end{name}` or `\label{name}`.

![renameCommand](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/images/renameCommand.png)

### Go to Label Definition

Jump to the corresponding `\label{xxx}` definition by pressing `F12` on `\ref{xxx}`, `\cref{xxx}`, or `\Cref{xxx}`.

This feature searches for the matching `\label{xxx}` in the current file and jumps to the first non-commented occurrence.

### LaTeX Lint: Query Wolfram Alpha

Query Wolfram Alpha to solve the equation.

#### 1. Select the equation you want to solve

![askWolframAlpha1](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/images/askWolframAlpha1.png)

#### 2. Run the command (Query Wolfram Alpha)

Run the command by clicking the icon or by opening the command palette (`Ctrl`+`Shift`+`P`) and typing `LaTeX Lint: Query Wolfram Alpha`.

![askWolframAlpha2](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/images/askWolframAlpha2.png)

#### 3. Check the Wolfram Alpha page

You can see the result on the Wolfram Alpha page. Some unnecessary commands are removed before the equation is sent.

![askWolframAlpha3](https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/images/askWolframAlpha3.png)

## Note

As stated in the [Rules](#rules), false positives and false negatives may occur. We welcome any kind of [feedback](https://marketplace.visualstudio.com/items?itemName=hari64boli64.latexlint&ssr=false#review-details), [suggestions](https://github.com/HirokiHamaguchi/latexlint/issues), and [pull requests](https://github.com/HirokiHamaguchi/latexlint/pulls).

When writing papers, please ensure you follow the style specified by the academic society or publisher.

We hope this extension will be helpful for your academic writing.

## License

This project consists of multiple components with different licenses:

1. Main Extension
   Licensed under the [MIT License](LICENSE).
   See LICENSE file for details.

   (The library [to-title-case](https://github.com/gouch/to-title-case/tree/master) is also under MIT License.)

2. Web Component
   Licensed under the Apache License 2.0.
   See the webpage repository for details.

   The web component includes code from:
   * textlint (MIT License)
   * kuromoji.js (Apache License 2.0)

## Acknowledgement

Although we do not use them directly, part of our extension is inspired by the following excellent LaTeX checking tools:

* LaTeX package [chktex](https://ctan.org/pkg/chktex) (GNU General Public License, version 2 or newer)
* Linter for LaTeX [latexcheck](https://github.com/dainiak/latexcheck) (MIT License)

Additionally, our extension also resembles the following VS Code extensions in some features:

* VS Code Extension [Markdownlint](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint)
* VS Code Extension [LaTeX Begin End Auto Rename](https://marketplace.visualstudio.com/items?itemName=wxhenry.latex-begin-end-auto-rename)

We sincerely appreciate the developers of these tools.
