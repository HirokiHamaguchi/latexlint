import * as assert from 'assert';
import toTitleCase from '../util/toTitleCase';

// Test cases from to-title-case
// https://github.com/gouch/to-title-case/blob/master/test/tests.json
// and some additional test cases by hari64boli64

const inputs = [
    "one two",
    "one two three",
    "Start a an and as at but by en for if in nor of on or per the to v vs via end",
    "a small word starts",
    "small word ends on",
    "questions?",
    "Two questions?",
    "one sentence. two sentences.",
    "we keep NASA capitalized",
    "pass camelCase through",
    "this sub-phrase is nice",
    "follow step-by-step instructions",
    "easy as one-two-three end",
    "start on-demand end",
    "start in-or-out end",
    "start e-commerce end",
    "start e-mail end",
    "keep that colo(u)r",
    "leave Q&A unscathed",
    "start title - end title",
    "start title-end title",
    "start title -- end title",
    "start title--end title",
    "don't break",
    "\"double quotes\"",
    "double quotes \"inner\" word",
    "fancy double quotes “inner” word",
    "'single quotes'",
    "single quotes 'inner' word",
    "fancy single quotes ‘inner’ word",
    "“‘a twice quoted subtitle’”",
    "have you read “The Lottery”?",
    "this vs. that",
    "this vs that",
    "this v. that",
    "this v that",
    "",
    "Scott Moritz and TheStreet.com’s million iPhone la-la land",
    "Notes and observations regarding Apple’s announcements from ‘The Beat Goes On’ special event",
    "2018",
    "section title with ref \\ref{eq:1}",
    "section title with ref~\\ref{eq:1}",
];

const excepts = [
    "One Two",
    "One Two Three",
    "Start a an and as at but by en for if in nor of on or per the to v vs via End",
    "A Small Word Starts",
    "Small Word Ends On",
    "Questions?",
    "Two Questions?",
    "One Sentence. Two Sentences.",
    "We Keep NASA Capitalized",
    "Pass camelCase Through",
    "This Sub-Phrase Is Nice",
    "Follow Step-by-Step Instructions",
    "Easy as One-Two-Three End",
    "Start On-Demand End",
    "Start In-or-Out End",
    "Start E-Commerce End",
    "Start E-Mail End",
    "Keep That Colo(u)r",
    "Leave Q&A Unscathed",
    "Start Title - End Title",
    "Start Title-End Title",
    "Start Title -- End Title",
    "Start Title--End Title",
    "Don't Break",
    "\"Double Quotes\"",
    "Double Quotes \"Inner\" Word",
    "Fancy Double Quotes “Inner” Word",
    "'Single Quotes'",
    "Single Quotes 'Inner' Word",
    "Fancy Single Quotes ‘Inner’ Word",
    "“‘A Twice Quoted Subtitle’”",
    "Have You Read “The Lottery”?",
    "This vs. That",
    "This vs That",
    "This v. That",
    "This v That",
    "",
    "Scott Moritz and TheStreet.com’s Million iPhone La-La Land",
    "Notes and Observations Regarding Apple’s Announcements From ‘The Beat Goes On’ Special Event",
    "2018",
    "Section Title With Ref \\ref{eq:1}",
    "Section Title With Ref~\\ref{eq:1}",
];

suite('Extension Test Suite', () => {
    for (let i = 0; i < inputs.length; i++)
        test(`Test toTitleCase: ${inputs[i]}`, () => {
            assert.strictEqual(toTitleCase(inputs[i]), excepts[i]);
        });

    for (const pythonFile of ['rules.test.py', 'isForMd.test.py'])
        test(`Test ${pythonFile}`, () => {
            const { spawnSync } = require('child_process');
            const pathToTestFile = require('path').dirname(__dirname);
            const result = spawnSync('python', [
                pathToTestFile.replace("out", "src") + '\\test\\' + pythonFile
            ]);
            assert.strictEqual(result.status, 0);
        });
});