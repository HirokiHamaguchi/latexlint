// !! AUTO_GENERATED !!
import LLAlignAnd from '../LL/LLAlignAnd';
import LLAlignEnd from '../LL/LLAlignEnd';
import LLAlignSingleLine from '../LL/LLAlignSingleLine';
import LLArticle from '../LL/LLArticle';
import LLBig from '../LL/LLBig';
import LLBracketCurly from '../LL/LLBracketCurly';
import LLBracketMissing from '../LL/LLBracketMissing';
import LLBracketRound from '../LL/LLBracketRound';
import LLColonEqq from '../LL/LLColonEqq';
import LLColonForMapping from '../LL/LLColonForMapping';
import LLCref from '../LL/LLCref';
import LLDoubleQuotes from '../LL/LLDoubleQuotes';
import LLENDash from '../LL/LLENDash';
import LLEqnarray from '../LL/LLEqnarray';
import LLFootnote from '../LL/LLFootnote';
import LLHeading from '../LL/LLHeading';
import LLJapaneseSpace from '../LL/LLJapaneseSpace';
import LLLlGg from '../LL/LLLlGg';
import LLNonASCII from '../LL/LLNonASCII';
import LLNonstandardNotation from '../LL/LLNonstandardNotation';
import LLPeriod from '../LL/LLPeriod';
import LLRefEq from '../LL/LLRefEq';
import LLSharp from '../LL/LLSharp';
import LLSI from '../LL/LLSI';
import LLSortedCites from '../LL/LLSortedCites';
import LLT from '../LL/LLT';
import LLTextLint from '../LL/LLTextLint';
import LLThousands from '../LL/LLThousands';
import LLTitle from '../LL/LLTitle';
import LLUnRef from '../LL/LLUnRef';
import LLURL from '../LL/LLURL';
import LLUserDefined from '../LL/LLUserDefined';

// Rules that require alignLikeEnvs parameter
export const alignRules = {
    LLAlignAnd,
    LLAlignEnd,
    LLAlignSingleLine,
};

// Rules that don't require alignLikeEnvs parameter
export const standardRules = {
    LLArticle,
    LLBig,
    LLBracketCurly,
    LLBracketMissing,
    LLBracketRound,
    LLColonEqq,
    LLColonForMapping,
    LLDoubleQuotes,
    LLENDash,
    LLEqnarray,
    LLFootnote,
    LLHeading,
    LLJapaneseSpace,
    LLLlGg,
    LLNonASCII,
    LLNonstandardNotation,
    LLPeriod,
    LLRefEq,
    LLSharp,
    LLSI,
    LLSortedCites,
    LLT,
    LLTextLint,
    LLThousands,
    LLTitle,
    LLUnRef,
    LLURL,
};

// Rules that require configuration parameters
export const configuredRules: { [key: string]: { rule: Function; configKey: "LLCrefExceptions" | "userDefinedRules" } } = {
    LLCref: {
        rule: LLCref,
        configKey: "LLCrefExceptions",
    },
    LLUserDefined: {
        rule: LLUserDefined,
        configKey: "userDefinedRules",
    },
};

