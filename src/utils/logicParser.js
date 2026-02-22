// src/utils/logicParser.js

// --- 1. Truth Table Generator ---
export const generateTruthTable = (expression) => {
  try {
    // 1. Clean the input and handle operators
    // Order matters! Replace 3-char symbols before 2-char symbols.
    let jsExpression = expression
      .replace(/\s/g, '')          // Remove spaces
      .replace(/<->/g, '===')      // Biconditional (A XNOR B)
      .replace(/->/g, '<=')        // Implication Hack: (A <= B) works for booleans!
      .replace(/\+/g, '||')        // OR
      .replace(/\*/g, '&&')        // AND
      .replace(/([A-Z])'/g, '!$1') // NOT (A')
      .replace(/!/g, '!');         // Standard NOT

    // 2. Extract Variables
    const variables = [...new Set(expression.match(/[A-Z]/g))].sort();
    if (variables.length === 0) return null;

    const rows = [];
    const numCombinations = Math.pow(2, variables.length);

    for (let i = 0; i < numCombinations; i++) {
      const rowData = {};
      variables.forEach((variable, index) => {
        // Shift bits to get 0 or 1 for this variable
        rowData[variable] = (i >> (variables.length - 1 - index)) & 1;
      });

      const colValues = Object.values(rowData);
      
      // Create function to evaluate: new Function("A", "B", "return !!(A && B)")
      // We wrap the expression in !!(...) to force a boolean result
      const safeEval = new Function(...variables, `return !!(${jsExpression});`);
      
      // Execute with row values (converted to booleans)
      // Note: We pass (v === 1) because JS logic operators work best with true/false
      const resultBool = safeEval(...colValues.map(v => v === 1));
      
      // Store result as 1 or 0
      rowData['Result'] = resultBool ? 1 : 0;
      rows.push(rowData);
    }

    return { headers: [...variables, 'Result'], rows };
  } catch (error) {
    // console.error("Parse Error:", error);
    return null;
  }
};

// --- 2. Quine-McCluskey Simplification Logic ---

// Helper: Check if two binary strings differ by exactly one bit
// e.g. "001" and "011" -> Differ by middle bit -> Return "0-1"
const combineTerms = (term1, term2) => {
  let diffCount = 0;
  let result = "";
  
  for (let i = 0; i < term1.length; i++) {
    if (term1[i] !== term2[i]) {
      diffCount++;
      result += "-"; // Place a dash where the bit changes
    } else {
      result += term1[i];
    }
  }
  
  return diffCount === 1 ? result : null;
};

// Helper: Convert "0-1" back to variables (e.g. A'C)
const termToExpression = (term, variables) => {
  // If term is all dashes (which shouldn't happen in valid logic), return True
  if (term.replace(/-/g, '').length === 0) return "1";

  return term.split('').map((char, index) => {
    if (char === '-') return ''; // Variable eliminated
    return char === '1' ? variables[index] : `${variables[index]}'`;
  }).join('');
};

// EXPORT THIS FUNCTION (This was likely missing!)
export const getSimplifiedExpression = (truthTable) => {
  if (!truthTable) return "";

  // 1. Get ON-Set (rows where result is 1) as binary strings
  let terms = truthTable.rows
    .filter(row => row.Result === 1)
    .map(row => {
      // Create a string like "010" based on the input columns
      return truthTable.headers.slice(0, -1).map(h => row[h]).join('');
    });

  // Edge Cases
  if (terms.length === 0) return "0"; // Contradiction (Always False)
  if (terms.length === truthTable.rows.length) return "1"; // Tautology (Always True)

  // 2. The Reduction Loop (Merge terms until we can't anymore)
  let reduced = true;
  while (reduced) {
    reduced = false;
    const nextTerms = new Set();
    const usedTerms = new Set();
    
    for (let i = 0; i < terms.length; i++) {
      for (let j = i + 1; j < terms.length; j++) {
        const combined = combineTerms(terms[i], terms[j]);
        if (combined) {
          nextTerms.add(combined);
          usedTerms.add(terms[i]);
          usedTerms.add(terms[j]);
          reduced = true;
        }
      }
    }
    
    // Keep terms that couldn't be combined (Prime Implicants) + new combined terms
    const remaining = terms.filter(t => !usedTerms.has(t));
    terms = [...new Set([...remaining, ...nextTerms])];
  }

  // 3. Convert back to A, B, C format
  // If we have terms like ["A", "A'"], logic dictates this is 1, but Q-M usually handles this during reduction.
  const finalExpr = terms
    .map(t => termToExpression(t, truthTable.headers.slice(0, -1)))
    .join(' + ');
    
  return finalExpr || "1";
};