import React, { useState } from 'react';

function App() {
  
  const [sourceCode, setSourceCode] = useState(
    "SET alpha = 40;\nSET beta = 25;\nCOMPUTE alpha + beta;\nSET gamma = 15;\nCOMPUTE alpha - gamma;"
  );
  
 
  const [compilerLogs, setCompilerLogs] = useState([
    ' Compiler execution engine online. Syntax parsing matrix standing by...'
  ]);

  
  const compileAndExecute = () => {
    const lines = sourceCode.split('\n');
    let memoryEnvironment = {};
    let calculatedTokens = [];
    let runtimeOutputs = [];
    let syntaxFailed = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.startsWith('//')) continue; 

      
      if (!line.endsWith(';')) {
        syntaxFailed = true;
        return { 
          tokens: [], 
          outputs: [], 
          error: `SYNTAX ERROR [Line ${i + 1}]: Missing terminating semicolon delimiter (';') at line end.` 
        };
      }

      
      const statement = line.slice(0, -1).trim();
      const segments = statement.split(/\s+/);
      const commandKeyword = segments[0].toUpperCase();

      
      if (commandKeyword === 'SET') {
        const varName = segments[1];
        const equalsSign = segments[2];
        const rawValue = segments[3];

        if (!varName || equalsSign !== '=' || !rawValue) {
          return { tokens: [], outputs: [], error: `COMPILATION FAULT [Line ${i + 1}]: Malformed assignment initialization matching 'SET [key] = [val]'.` };
        }

        const parsedNumeric = Number(rawValue);
        memoryEnvironment[varName] = parsedNumeric;

        calculatedTokens.push({ type: 'KEYWORD', val: 'SET', line: i + 1 });
        calculatedTokens.push({ type: 'IDENTIFIER', val: varName, line: i + 1 });
        calculatedTokens.push({ type: 'ASSIGNMENT', val: '=', line: i + 1 });
        calculatedTokens.push({ type: 'LITERAL_NUMBER', val: rawValue, line: i + 1 });

        runtimeOutputs.push(`Allocated register memory variable: ${varName} ➔ ${parsedNumeric}`);
      } 
      
      else if (commandKeyword === 'COMPUTE') {
        const firstOperand = segments[1];
        const operationalSign = segments[2];
        const secondOperand = segments[3];

        if (!firstOperand || !operationalSign || !secondOperand) {
          return { tokens: [], outputs: [], error: `COMPILATION FAULT [Line ${i + 1}]: Missing parameter arguments inside COMPUTE math matrix block.` };
        }

        
        const valA = memoryEnvironment[firstOperand] !== undefined ? memoryEnvironment[firstOperand] : Number(firstOperand);
        const valB = memoryEnvironment[secondOperand] !== undefined ? memoryEnvironment[secondOperand] : Number(secondOperand);

        if (isNaN(valA) || isNaN(valB)) {
          return { tokens: [], outputs: [], error: `RUNTIME BOUNDS ERROR [Line ${i + 1}]: Variable pointer reference key is uninitialized or is not a valid number.` };
        }

        let evaluatedResult = 0;
        if (operationalSign === '+') evaluatedResult = valA + valB;
        else if (operationalSign === '-') evaluatedResult = valA - valB;
        else if (operationalSign === '*') evaluatedResult = valA * valB;
        else {
          return { tokens: [], outputs: [], error: `SYNTAX REJECTION [Line ${i + 1}]: Unsupported arithmetic operator character: '${operationalSign}'` };
        }

        calculatedTokens.push({ type: 'KEYWORD', val: 'COMPUTE', line: i + 1 });
        calculatedTokens.push({ type: 'VARIABLE_REF', val: firstOperand, line: i + 1 });
        calculatedTokens.push({ type: 'OPERATOR', val: operationalSign, line: i + 1 });
        calculatedTokens.push({ type: 'VARIABLE_REF', val: secondOperand, line: i + 1 });

        runtimeOutputs.push(`Execution Result: ${firstOperand} (${valA}) ${operationalSign} ${secondOperand} (${valB}) ➔ ${evaluatedResult}`);
      } 
    
      else {
        return { tokens: [], outputs: [], error: `PARSING UNKNOWN EXCEPTION [Line ${i + 1}]: Unrecognized language primitive instruction instruction: '${commandKeyword}'` };
      }
    }

    return { tokens: calculatedTokens, outputs: runtimeOutputs, error: null };
  };

  
  const { tokens, outputs, error } = compileAndExecute();

 
  const [copyFeedback, setCopyFeedback] = useState(' Copy Source Script');
  const handleCopyCode = () => {
    navigator.clipboard.writeText(sourceCode);
    setCopyFeedback('Script Saved! ⚡');
    setTimeout(() => setCopyFeedback(' Copy Source Script'), 2000);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 24px', fontFamily: 'monospace', backgroundColor: '#070a13', color: '#f8fafc', minHeight: '90vh' }}>
      
      {/* HEADER HUD BAR CONTAINER */}
      <header style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '25px', marginBottom: '35px', gap: '20px' }}>
        <div>
          <h1 style={{ margin: '0', fontSize: '24px', fontWeight: 'bold', color: '#a855f7', letterSpacing: '-0.5px' }}> DevLang Runtime Compiler Lab</h1>
          <p style={{ margin: '4px 0 0 0', color: '#475569', fontSize: '12px' }}>A client-side AST token scanning compiler engine evaluating custom micro-language primitives live.</p>
        </div>
        
        <button onClick={handleCopyCode} style={{ padding: '10px 20px', backgroundColor: 'transparent', border: '1px solid #a855f7', color: '#a855f7', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', transition: '0.2s' }}>
          {copyFeedback}
        </button>
      </header>


      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '30px', marginBottom: '40px' }}>
        
        
        <section style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '25px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '13px', color: '#475569', textTransform: 'uppercase', margin: '0 0 12px 0' }}>DevLang Script Source Input Editor</h3>
            <textarea
              value={sourceCode}
              onChange={(e) => setSourceCode(e.target.value)}
              style={{ width: '100%', height: '180px', padding: '16px', backgroundColor: '#070a13', border: '1px solid #1e293b', borderRadius: '12px', color: '#e2e8f0', fontFamily: 'monospace', fontSize: '14px', lineHeight: '1.6', resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ padding: '12px 14px', backgroundColor: '#070a13', borderRadius: '8px', borderLeft: '4px solid #a855f7', fontSize: '11px', color: '#475569', lineHeight: '1.6' }}>
            <strong>Lexical Grammar Directives:</strong> Instruction keywords are explicitly case-sensitive (<code>SET</code>, <code>COMPUTE</code>). Statements must strictly terminate using a closing semicolon syntax token (<code>;</code>).
          </div>

          
          <div>
            <h3 style={{ fontSize: '12px', color: '#475569', margin: '0 0 12px 0', textTransform: 'uppercase' }}>Interpreter Console Trace Pipeline</h3>
            <div style={{ backgroundColor: '#070a13', borderRadius: '10px', padding: '15px', height: '140px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', border: '1px solid #1e293b' }}>
              {error ? (
                <div style={{ fontSize: '12px', color: '#f43f5e', backgroundColor: 'rgba(244, 63, 94, 0.08)', padding: '8px 12px', borderRadius: '4px', borderLeft: '4px solid #f43f5e' }}>
                  {error}
                </div>
              ) : (
                outputs.map((out, idx) => (
                  <div key={idx} style={{ fontSize: '12px', color: '#34d399' }}>
                    ✔ {out}
                  </div>
                ))
              )}
              {!error && outputs.length === 0 && (
                <div style={{ color: '#475569', fontSize: '11px' }}>Empty execution workspace lines tracking.</div>
              )}
            </div>
          </div>
        </section>

        
        <section style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '13px', color: '#475569', textTransform: 'uppercase', margin: '0 0 15px 0' }}>Calculated Abstract Lexical Token Map</h3>

          <div style={{ flexGrow: '1', backgroundColor: '#0f172a', border: '1px dashed #334155', borderRadius: '16px', padding: '20px', overflow: 'auto', minHeight: '360px' }}>
            {!error && tokens.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px' }}>
                {tokens.map((token, index) => (
                  <div key={index} style={{ 
                    backgroundColor: '#070a13', border: '1px solid #1e293b', padding: '12px', borderRadius: '8px', textAlign: 'center',
                    borderTop: `3px solid ${token.type === 'KEYWORD' ? '#a855f7' : token.type === 'IDENTIFIER' ? '#38bdf8' : token.type === 'OPERATOR' ? '#fbbf24' : '#34d399'}`
                  }}>
                    <div style={{ fontSize: '9px', color: '#475569', textTransform: 'uppercase', marginBottom: '4px' }}>{token.type}</div>
                    <div style={{ fontSize: '14px', color: '#fff', fontWeight: 'bold' }}>{token.val}</div>
                    <div style={{ fontSize: '9px', color: '#475569', marginTop: '6px' }}>Line {token.line}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: '#475569', textAlign: 'center', marginTop: '100px', fontSize: '12px' }}>
                {error ? ' Abstract tree execution aborted due to lexical validation constraints.' : ' Standby tracking states loop. Input valid script strings to see compiler outputs.'}
              </div>
            )}
          </div>
        </section>

      </div>

    </div>
  );
}

export default App;