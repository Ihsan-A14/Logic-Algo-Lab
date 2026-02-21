// src/utils/logicParser.js

export const generateTruthTable = (expression) => {
  try {
    // 1. Clean the input:
    // Replace engineering symbols with JavaScript operators
    // + -> || (OR)
    // * -> && (AND)
    // ! or ' -> ! (NOT) - simplified handling
    let jsExpression = expression
      .replace(/([A-Z])'/g, '!$1') // Handle A' style NOT
      .replace(/\+/g, '||')        // Handle + as OR
      .replace(/\*/g, '&&')        // Handle * as AND
      .replace(/=/g, '===');       // Handle = as Equality

    // 2. Extract Variables (A, B, C...)
    // We look for unique capital letters
    const variables = [...new Set(expression.match(/[A-Z]/g))].sort();
    
    if (variables.length === 0) return null;

    // 3. Generate Rows (0 to 2^n)
    const rows = [];
    const numCombinations = Math.pow(2, variables.length);

    for (let i = 0; i < numCombinations; i++) {
      const rowData = {};
      
      // Create true/false values for this specific row
      // Example: If i=0, A=0, B=0. If i=1, A=0, B=1.
      variables.forEach((variable, index) => {
        // The bitwise magic to get 0 or 1
        const value = (i >> (variables.length - 1 - index)) & 1;
        rowData[variable] = value;
      });

      // 4. Evaluate the expression for this row
      // We create a temporary function to execute the logic safely
      const keys = Object.keys(rowData);
      const values = Object.values(rowData);
      
      // Create a function that takes (A, B, C) and returns the result
      // Note: We use "!!( ... )" to force the result to be a strictly boolean true/false
      // converting 0/1 to false/true for calculation
      const safeEval = new Function(...keys, `return !!(${jsExpression});`);
      
      // Convert 1/0 back to boolean for calculation, then result to 1/0
      const resultBool = safeEval(...values.map(v => v === 1));
      rowData['Result'] = resultBool ? 1 : 0;

      rows.push(rowData);
    }

    return { headers: [...variables, 'Result'], rows };

  } catch (error) {
    console.error("Logic Parse Error:", error);
    return null; // Return null if the user typed nonsense
  }
};