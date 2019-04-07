var name ='k8805';
var letter = 'Dear ' +name+'\n\n(1) 기술Stack- FronEnd  .- 기본 : HTML, CSS, JS .- JS Lib : jQuery .- Design Lib : Bootstrap .- UI Lib : ToastUI Grid  (* UI Lib로 React 도 고려)- BackEnd : Node.js- Framework : 없음 (* express.js 고려)- DB : MariaDB or Oracle- IDE : VSCode- 형상관리 : Git- 이슈트래킹 : YONA' + name;
console.log(letter);


var letter = `Dear ${name}

(${1+1}) 기술Stack- FronEnd  .- 기본 : HTML, CSS, JS .- JS Lib : jQuery .- Design Lib : Bootstrap .- UI Lib : ToastUI Grid  (* UI Lib로 React 도 고려)- BackEnd : Node.js- Framework : 없음 (* express.js 고려)- DB : MariaDB or Oracle- IDE : VSCode- 형상관리 : Git- 이슈트래킹 : YONA'  ${name}`;
console.log(letter);