const categories = document.querySelectorAll(".box");
const questions = document.querySelectorAll(".smolbox");
const popup = document.getElementById("popup");
const start = document.querySelector(".start");
let timerInterval = null;
let timeLeft = 15;

const timerText = document.querySelector(".timer");
let selectedcat = null;
let selectedques = null;

categories.forEach((box) => {
  box.addEventListener("click", () => {
    if (box.classList.contains("active")) {
      box.classList.remove("active");
      selectedcat = null;
      return;
    }
    categories.forEach((b) => b.classList.remove("active"));
    box.classList.add("active");
    selectedcat = box.textContent.trim().toLowerCase();
  });
});

questions.forEach((q) => {
  q.addEventListener("click", () => {
    if (q.classList.contains("active")) {
      q.classList.remove("active");
      selectedques = null;
      return;
    }
    questions.forEach((qq) => qq.classList.remove("active"));
    q.classList.add("active");
    selectedques = Number(q.textContent);
  });
});

function showPopup(message) {
  popup.innerText = message;
  popup.classList.add("show");

  setTimeout(() => {
    popup.classList.remove("show");
  }, 2500);
}

const questionDiv = document.querySelector(".question");
let score = 0;
const singleArea = document.querySelector(".singleoptions");
const multiArea = document.querySelector(".multioptions");
const fillArea = document.querySelector(".fillarea");

const submitBtn = document.querySelector(".submit");
const container1 = document.querySelector(".container");
const container2 = document.querySelector(".container2");
let currentQuestion = null;
let questionIndex = 0;
let selectedQuestions = [];

start.addEventListener("click", () => {
  if (!selectedcat && !selectedques) {
    showPopup("😡 Please select category and number of questions");
  } else if (!selectedcat) {
    showPopup("😡Please select a category");
  } else if (!selectedques) {
    showPopup("😡Please select number of questions");
  } else {
    // Future quiz
    const allQuestions = questionslist[selectedcat];

    selectedQuestions = [...allQuestions]
      .sort(() => Math.random() - 0.5)
      .slice(0, selectedques);

    questionIndex = 0;

    loadQuestion();
    container1.style.display = "none";
    container2.style.display = "block";
  }
});

function loadQuestion() {
  resetStyles();
  submitBtn.textContent = "Check";

  currentQuestion = selectedQuestions[questionIndex];

  questionDiv.textContent = currentQuestion.question;

  singleArea.style.display = "none";
  multiArea.style.display = "none";
  fillArea.style.display = "none";

  if (currentQuestion.type === "single") {
    singleArea.style.display = "flex";
    renderOptions(singleArea);
  }

  if (currentQuestion.type === "multi") {
    multiArea.style.display = "flex";
    renderOptions(multiArea);
  }

  if (currentQuestion.type === "fill") {
    fillArea.style.display = "block";
  }

  const categoryDiv = document.querySelector(".categorydiv");

  if (currentQuestion.type === "single") {
    categoryDiv.textContent = "✅ Single Choice";
  } else if (currentQuestion.type === "multi") {
    categoryDiv.textContent = "☑️ Multiple Choice";
  } else {
    categoryDiv.textContent = "✏️ Fill in the Blank";
  }
  startTimer();
  document.querySelector(".fillinput").value = "";
}

function renderOptions(area) {
  area.innerHTML = "";

  currentQuestion.options.forEach((opt) => {
    const div = document.createElement("div");
    div.textContent = opt;

    if (currentQuestion.type === "single") {
      div.classList.add("soption");

      div.addEventListener("click", () => {
        document
          .querySelectorAll(".soption")
          .forEach((o) => o.classList.remove("sactive"));

        div.classList.add("sactive");
      });
    } else {
      div.classList.add("moption");

      div.addEventListener("click", () => {
        div.classList.toggle("mactive");
      });
    }

    area.appendChild(div);
  });
}

submitBtn.addEventListener("click", () => {
  if (submitBtn.textContent === "Next") {
    questionIndex++;

    if (questionIndex < selectedQuestions.length) {
      loadQuestion();
    } else {
      showFinalResult();
    }

    return;
  }

  clearInterval(timerInterval);
  checkAnswer();
});

function checkAnswer() {
  if (currentQuestion.type === "single") {
    checkSingle();
  }

  if (currentQuestion.type === "multi") {
    checkMulti();
  }

  if (currentQuestion.type === "fill") {
    checkFill();
  }

  submitBtn.textContent = "Next";
}

function checkSingle() {
  if (currentQuestion.type === "single") {
    const selected = document.querySelector(".sactive");
    const options = document.querySelectorAll(".soption");

    options.forEach((opt) => {
      if (opt.textContent === currentQuestion.answer) {
        opt.style.backgroundColor = "#b4f4c3"; // light green
      }

      if (
        selected &&
        opt === selected &&
        selected.textContent !== currentQuestion.answer
      ) {
        opt.style.backgroundColor = "#f0acb1"; // light red
      }
    });

    if (selected && selected.textContent === currentQuestion.answer) {
      score++;
    }
  }
}

function checkMulti() {
  if (currentQuestion.type === "multi") {
    const selected = document.querySelectorAll(".mactive");
    const correctAnswers = currentQuestion.answer
      .split(", ")
      .map((a) => a.trim());

    const options = document.querySelectorAll(".moption");

    let allCorrect = true;

    options.forEach((opt) => {
      const isSelected = opt.classList.contains("mactive");
      const isCorrect = correctAnswers.includes(opt.textContent);

      if (isSelected && isCorrect) {
        opt.style.backgroundColor = "#b4f4c3"; // yes
      } else if (!isSelected && isCorrect) {
        opt.style.backgroundColor = "#e2ffb1"; // missed
        allCorrect = false;
      } else if (isSelected && !isCorrect) {
        opt.style.backgroundColor = "#f0acb1"; // wrogn
        allCorrect = false;
      }
    });

    if (allCorrect && selected.length === correctAnswers.length) {
      score++;
    }
  }
}

function checkFill() {
  if (currentQuestion.type === "fill") {
    const input = document.querySelector(".fillinput");
    const userAnswer = input.value.trim().toLowerCase();
    const correctAnswer = currentQuestion.answer.toLowerCase();

    if (userAnswer === correctAnswer) {
      input.style.backgroundColor = "#b4f4c3"; // green
      score++;
    } else {
      input.style.backgroundColor = "#f0acb1"; // red
    }
  }
}

function resetStyles() {
  document.querySelectorAll(".soption, .moption").forEach((opt) => {
    opt.style.backgroundColor = "";
  });

  const input = document.querySelector(".fillinput");
  if (input) input.style.backgroundColor = "";
}

function startTimer() {
  clearInterval(timerInterval);

  timeLeft = 15;
  timerText.textContent = timeLeft;

  timerInterval = setInterval(() => {
    timeLeft--;
    timerText.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);

      if (submitBtn.textContent === "Check") {
        showCorrectAnswerOnly();
        submitBtn.textContent = "Next";
      }
    }
  }, 1000);
}

function showCorrectAnswerOnly() {
  if (currentQuestion.type === "single") {
    const options = document.querySelectorAll(".soption");

    options.forEach((opt) => {
      if (opt.textContent === currentQuestion.answer) {
        opt.style.backgroundColor = "#b4f4c3"; // green
      }
    });
  } else if (currentQuestion.type === "multi") {
    const correctAnswers = currentQuestion.answer
      .split(", ")
      .map((a) => a.trim());

    const options = document.querySelectorAll(".moption");

    options.forEach((opt) => {
      if (correctAnswers.includes(opt.textContent)) {
        opt.style.backgroundColor = "#b4f4c3"; // green
      }
    });
  } else if (currentQuestion.type === "fill") {
    const input = document.querySelector(".fillinput");
    input.style.backgroundColor = "#f0acb1";
    input.value = currentQuestion.answer;
  }
}

const questionslist = {
  programming: [
    {
      type: "single",
      question: "Which data structure uses FIFO order?",
      options: ["Stack", "Queue", "Tree", "Graph"],
      answer: "Queue",
    },
    {
      type: "single",
      question: "Which data structure uses LIFO order?",
      options: ["Queue", "Array", "Stack", "Linked List"],
      answer: "Stack",
    },
    {
      type: "single",
      question: "What is the time complexity of binary search?",
      options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
      answer: "O(log n)",
    },
    {
      type: "single",
      question: "Which keyword is used to define a constant in JavaScript?",
      options: ["var", "let", "const", "define"],
      answer: "const",
    },
    {
      type: "single",
      question: "Which language is primarily used for styling web pages?",
      options: ["HTML", "CSS", "Python", "C++"],
      answer: "CSS",
    },
    {
      type: "single",
      question: "Which of these is not a primitive data type in JavaScript?",
      options: ["String", "Number", "Boolean", "Class"],
      answer: "Class",
    },
    {
      type: "single",
      question: "Which symbol is used for comments in Python?",
      options: ["//", "#", "/*", "<!--"],
      answer: "#",
    },
    {
      type: "single",
      question: "Which loop guarantees execution at least once?",
      options: ["for", "while", "do-while", "foreach"],
      answer: "do-while",
    },
    {
      type: "single",
      question: "Which sorting algorithm has average O(n log n) complexity?",
      options: [
        "Bubble Sort",
        "Insertion Sort",
        "Merge Sort",
        "Selection Sort",
      ],
      answer: "Merge Sort",
    },
    {
      type: "single",
      question: "Which operator checks both value and type in JavaScript?",
      options: ["==", "=", "===", "!="],
      answer: "===",
    },

    {
      type: "single",
      question: "Which data structure is used in recursion?",
      options: ["Queue", "Stack", "Heap", "Tree"],
      answer: "Stack",
    },
    {
      type: "single",
      question: "What does HTML stand for?",
      options: [
        "Hyper Trainer Marking Language",
        "Hyper Text Markup Language",
        "High Text Machine Language",
        "Hyper Text Markdown Language",
      ],
      answer: "Hyper Text Markup Language",
    },
    {
      type: "single",
      question: "Which function is used to print output in Python?",
      options: ["echo()", "console.log()", "print()", "printf()"],
      answer: "print()",
    },
    {
      type: "single",
      question: "Which company developed Java?",
      options: ["Microsoft", "Sun Microsystems", "Google", "IBM"],
      answer: "Sun Microsystems",
    },
    {
      type: "single",
      question: "Which symbol is used for logical AND in most languages?",
      options: ["&&", "||", "&", "AND"],
      answer: "&&",
    },
    {
      type: "single",
      question: "Which of these is a NoSQL database?",
      options: ["MySQL", "PostgreSQL", "MongoDB", "Oracle"],
      answer: "MongoDB",
    },
    {
      type: "single",
      question: "Which data structure uses nodes connected by pointers?",
      options: ["Array", "Linked List", "Stack", "Queue"],
      answer: "Linked List",
    },
    {
      type: "single",
      question: "Which keyword is used for inheritance in Java?",
      options: ["implements", "extends", "inherits", "super"],
      answer: "extends",
    },
    {
      type: "single",
      question: "Which HTTP method is used to retrieve data?",
      options: ["POST", "PUT", "GET", "DELETE"],
      answer: "GET",
    },
    {
      type: "single",
      question: "Which of these is not an OOP principle?",
      options: ["Encapsulation", "Abstraction", "Polymorphism", "Compilation"],
      answer: "Compilation",
    },

    {
      type: "single",
      question: "Which operator is used for exponentiation in Python?",
      options: ["^", "**", "//", "%%"],
      answer: "**",
    },
    {
      type: "single",
      question:
        "Which data structure is best for implementing undo functionality?",
      options: ["Queue", "Stack", "Tree", "Graph"],
      answer: "Stack",
    },
    {
      type: "single",
      question: "Which language runs in a web browser?",
      options: ["Java", "C", "Python", "JavaScript"],
      answer: "JavaScript",
    },
    {
      type: "single",
      question: "Which keyword creates a class in Python?",
      options: ["def", "class", "struct", "object"],
      answer: "class",
    },
    {
      type: "single",
      question: "Which search algorithm works on sorted data only?",
      options: ["Linear Search", "Binary Search", "DFS", "BFS"],
      answer: "Binary Search",
    },
    {
      type: "single",
      question: "Which symbol denotes an ID selector in CSS?",
      options: [".", "#", "*", "@"],
      answer: "#",
    },
    {
      type: "single",
      question: "Which loop is entry-controlled?",
      options: ["do-while", "while", "repeat-until", "None"],
      answer: "while",
    },
    {
      type: "single",
      question: "Which keyword is used to handle exceptions in Python?",
      options: ["try", "catch", "throw", "error"],
      answer: "try",
    },
    {
      type: "single",
      question: "Which data structure is used in BFS?",
      options: ["Stack", "Queue", "Array", "Tree"],
      answer: "Queue",
    },
    {
      type: "single",
      question: "Which protocol is secure version of HTTP?",
      options: ["FTP", "HTTPS", "TCP", "SMTP"],
      answer: "HTTPS",
    },

    {
      type: "single",
      question: "Which sorting algorithm is the slowest in worst case?",
      options: ["Quick Sort", "Merge Sort", "Bubble Sort", "Heap Sort"],
      answer: "Bubble Sort",
    },
    {
      type: "single",
      question: "Which memory is volatile?",
      options: ["ROM", "Hard Disk", "RAM", "SSD"],
      answer: "RAM",
    },
    {
      type: "single",
      question: "Which SQL command removes a table?",
      options: ["DELETE", "REMOVE", "DROP", "CLEAR"],
      answer: "DROP",
    },
    {
      type: "single",
      question: "Which keyword is used to define a function in JavaScript?",
      options: ["func", "function", "define", "method"],
      answer: "function",
    },
    {
      type: "single",
      question: "Which data structure represents hierarchical data?",
      options: ["Array", "Tree", "Stack", "Queue"],
      answer: "Tree",
    },
    {
      type: "single",
      question: "Which traversal visits root first?",
      options: ["Inorder", "Preorder", "Postorder", "Levelorder"],
      answer: "Preorder",
    },
    {
      type: "single",
      question: "Which of these is a compiled language?",
      options: ["Python", "JavaScript", "C++", "PHP"],
      answer: "C++",
    },
    {
      type: "single",
      question: "Which operator is used for modulo in C?",
      options: ["/", "%", "//", "mod"],
      answer: "%",
    },
    {
      type: "single",
      question: "Which data structure uses key-value pairs?",
      options: ["Array", "Dictionary", "Stack", "Queue"],
      answer: "Dictionary",
    },
    {
      type: "single",
      question: "Which algorithm technique uses divide and conquer?",
      options: ["Merge Sort", "Bubble Sort", "Linear Search", "Selection Sort"],
      answer: "Merge Sort",
    },

    {
      type: "single",
      question: "Which symbol starts a single-line comment in Java?",
      options: ["#", "//", "<!--", "**"],
      answer: "//",
    },
    {
      type: "single",
      question:
        "Which concept allows same function name with different parameters?",
      options: ["Encapsulation", "Abstraction", "Overloading", "Overriding"],
      answer: "Overloading",
    },
    {
      type: "single",
      question: "Which normal form removes partial dependency?",
      options: ["1NF", "2NF", "3NF", "BCNF"],
      answer: "2NF",
    },
    {
      type: "single",
      question: "Which keyword stops a loop?",
      options: ["exit", "stop", "break", "return"],
      answer: "break",
    },
    {
      type: "single",
      question: "Which is not a valid variable name in most languages?",
      options: ["_count", "2value", "value2", "total_sum"],
      answer: "2value",
    },
    {
      type: "single",
      question: "Which is used to style React components?",
      options: ["CSS", "SQL", "Python", "XML"],
      answer: "CSS",
    },
    {
      type: "single",
      question: "Which data structure is used in DFS?",
      options: ["Queue", "Stack", "Array", "Linked List"],
      answer: "Stack",
    },
    {
      type: "single",
      question: "Which is a front-end framework?",
      options: ["Django", "React", "Node.js", "Flask"],
      answer: "React",
    },
    {
      type: "single",
      question: "Which keyword refers to current object in Java?",
      options: ["this", "self", "current", "object"],
      answer: "this",
    },
    {
      type: "single",
      question: "Which SQL clause filters rows?",
      options: ["ORDER BY", "GROUP BY", "WHERE", "HAVING"],
      answer: "WHERE",
    },

    {
      type: "single",
      question: "Which data structure allows random access?",
      options: ["Array", "Stack", "Queue", "Linked List"],
      answer: "Array",
    },
    {
      type: "single",
      question: "Which of these is dynamic typing language?",
      options: ["C", "C++", "Java", "Python"],
      answer: "Python",
    },
    {
      type: "single",
      question: "Which algorithm finds shortest path?",
      options: ["DFS", "BFS", "Dijkstra", "Bubble Sort"],
      answer: "Dijkstra",
    },
    {
      type: "single",
      question: "Which keyword creates object in Java?",
      options: ["create", "new", "object", "make"],
      answer: "new",
    },
    {
      type: "single",
      question: "Which operator increments value by 1?",
      options: ["+=", "++", "--", "**"],
      answer: "++",
    },
    {
      type: "single",
      question: "Which is used for version control?",
      options: ["Git", "Docker", "Linux", "Node"],
      answer: "Git",
    },
    {
      type: "single",
      question: "Which data structure avoids duplicate elements?",
      options: ["List", "Set", "Array", "Stack"],
      answer: "Set",
    },
    {
      type: "single",
      question: "Which loop is best when iterations are known?",
      options: ["while", "do-while", "for", "foreach"],
      answer: "for",
    },
    {
      type: "single",
      question: "Which HTTP status means Not Found?",
      options: ["200", "301", "404", "500"],
      answer: "404",
    },
    {
      type: "single",
      question: "Which keyword defines interface in Java?",
      options: ["interface", "implements", "extends", "abstract"],
      answer: "interface",
    },

    {
      type: "single",
      question: "Which is not a relational database?",
      options: ["MySQL", "Oracle", "MongoDB", "PostgreSQL"],
      answer: "MongoDB",
    },
    {
      type: "single",
      question: "Which function converts string to integer in JavaScript?",
      options: ["int()", "parseInt()", "toInteger()", "Number.parse()"],
      answer: "parseInt()",
    },
    {
      type: "single",
      question: "Which data structure is circular by nature?",
      options: ["Circular Queue", "Array", "Tree", "Stack"],
      answer: "Circular Queue",
    },
    {
      type: "single",
      question: "Which algorithm is stable?",
      options: ["Quick Sort", "Heap Sort", "Merge Sort", "Selection Sort"],
      answer: "Merge Sort",
    },
    {
      type: "single",
      question: "Which OOP concept hides internal details?",
      options: ["Encapsulation", "Abstraction", "Inheritance", "Polymorphism"],
      answer: "Abstraction",
    },
    {
      type: "single",
      question: "Which keyword throws exception in Java?",
      options: ["throw", "try", "catch", "error"],
      answer: "throw",
    },
    {
      type: "single",
      question: "Which tag links JavaScript in HTML?",
      options: ["<js>", "<script>", "<link>", "<code>"],
      answer: "<script>",
    },
    {
      type: "single",
      question: "Which method adds element at end of JS array?",
      options: ["push()", "pop()", "shift()", "unshift()"],
      answer: "push()",
    },
    {
      type: "single",
      question: "Which database language is used to query data?",
      options: ["SQL", "HTML", "CSS", "XML"],
      answer: "SQL",
    },
    {
      type: "single",
      question: "Which principle promotes code reuse?",
      options: ["Encapsulation", "Inheritance", "Abstraction", "Compilation"],
      answer: "Inheritance",
    },

    {
      type: "single",
      question: "Which traversal gives sorted order in BST?",
      options: ["Preorder", "Postorder", "Inorder", "Levelorder"],
      answer: "Inorder",
    },
    {
      type: "single",
      question: "Which is backend runtime for JavaScript?",
      options: ["React", "Angular", "Node.js", "Vue"],
      answer: "Node.js",
    },
    {
      type: "single",
      question: "Which symbol spreads array in JS?",
      options: ["...", "**", "&&", "||"],
      answer: "...",
    },
    {
      type: "single",
      question: "Which algorithm uses greedy approach?",
      options: ["Dijkstra", "Merge Sort", "DFS", "Binary Search"],
      answer: "Dijkstra",
    },
    {
      type: "single",
      question: "Which structure uses edges and vertices?",
      options: ["Tree", "Graph", "Stack", "Queue"],
      answer: "Graph",
    },
    {
      type: "single",
      question: "Which memory allocation happens at runtime?",
      options: ["Static", "Dynamic", "Compile-time", "Constant"],
      answer: "Dynamic",
    },
    {
      type: "single",
      question: "Which keyword makes variable block-scoped in JS?",
      options: ["var", "let", "global", "scope"],
      answer: "let",
    },
    {
      type: "single",
      question: "Which protocol sends emails?",
      options: ["SMTP", "HTTP", "FTP", "TCP"],
      answer: "SMTP",
    },
    {
      type: "single",
      question: "Which complexity is fastest?",
      options: ["O(n^2)", "O(n)", "O(log n)", "O(n log n)"],
      answer: "O(log n)",
    },
    {
      type: "single",
      question: "Which function removes last element in JS array?",
      options: ["pop()", "push()", "shift()", "slice()"],
      answer: "pop()",
    },

    {
      type: "single",
      question: "Which is not a programming paradigm?",
      options: ["Procedural", "Object-Oriented", "Functional", "Binary"],
      answer: "Binary",
    },
    {
      type: "single",
      question: "Which structure uses parent-child relation?",
      options: ["Graph", "Tree", "Stack", "Queue"],
      answer: "Tree",
    },
    {
      type: "single",
      question: "Which operator compares inequality in JS?",
      options: ["!=", "==", "===", "="],
      answer: "!=",
    },
    {
      type: "single",
      question: "Which keyword defines async function in JS?",
      options: ["async", "await", "promise", "defer"],
      answer: "async",
    },
    {
      type: "single",
      question: "Which database ensures ACID properties?",
      options: ["Relational Database", "NoSQL", "Graph DB", "Key-Value Store"],
      answer: "Relational Database",
    },
    {
      type: "single",
      question: "Which sorting algorithm selects minimum repeatedly?",
      options: ["Bubble Sort", "Selection Sort", "Merge Sort", "Quick Sort"],
      answer: "Selection Sort",
    },
    {
      type: "single",
      question: "Which keyword is used to exit function?",
      options: ["stop", "break", "return", "exit"],
      answer: "return",
    },
    {
      type: "single",
      question: "Which type stores true/false?",
      options: ["int", "float", "boolean", "char"],
      answer: "boolean",
    },
    {
      type: "single",
      question: "Which structure is best for priority handling?",
      options: ["Stack", "Queue", "Priority Queue", "Array"],
      answer: "Priority Queue",
    },
    {
      type: "single",
      question: "Which algorithm explores level by level?",
      options: ["DFS", "BFS", "Dijkstra", "Greedy"],
      answer: "BFS",
    },

    {
      type: "multi",
      question: "Which of the following are programming languages?",
      options: ["Python", "HTML", "Java", "C++"],
      answer: "Python, Java, C++",
    },
    {
      type: "multi",
      question: "Which are JavaScript data types?",
      options: ["String", "Number", "Boolean", "Float"],
      answer: "String, Number, Boolean",
    },
    {
      type: "multi",
      question: "Which are valid loop types in JavaScript?",
      options: ["for", "while", "repeat", "do-while"],
      answer: "for, while, do-while",
    },
    {
      type: "multi",
      question: "Which are OOP principles?",
      options: ["Encapsulation", "Inheritance", "Compilation", "Polymorphism"],
      answer: "Encapsulation, Inheritance, Polymorphism",
    },
    {
      type: "multi",
      question: "Which are HTTP methods?",
      options: ["GET", "POST", "FETCH", "DELETE"],
      answer: "GET, POST, DELETE",
    },
    {
      type: "multi",
      question: "Which are Java access modifiers?",
      options: ["public", "private", "protected", "global"],
      answer: "public, private, protected",
    },
    {
      type: "multi",
      question: "Which are CSS positioning values?",
      options: ["static", "relative", "absolute", "center"],
      answer: "static, relative, absolute",
    },
    {
      type: "multi",
      question: "Which are JavaScript array methods?",
      options: ["map", "filter", "reduce", "compile"],
      answer: "map, filter, reduce",
    },
    {
      type: "multi",
      question: "Which are sorting algorithms?",
      options: ["Bubble Sort", "Merge Sort", "Binary Search", "Quick Sort"],
      answer: "Bubble Sort, Merge Sort, Quick Sort",
    },
    {
      type: "multi",
      question: "Which are searching algorithms?",
      options: ["Linear Search", "Binary Search", "Merge Sort", "DFS"],
      answer: "Linear Search, Binary Search",
    },

    {
      type: "multi",
      question: "Which are JavaScript frameworks?",
      options: ["React", "Angular", "Vue", "Laravel"],
      answer: "React, Angular, Vue",
    },
    {
      type: "multi",
      question: "Which are backend technologies?",
      options: ["Node.js", "Django", "Spring", "Bootstrap"],
      answer: "Node.js, Django, Spring",
    },
    {
      type: "multi",
      question: "Which are NoSQL databases?",
      options: ["MongoDB", "Cassandra", "MySQL", "Redis"],
      answer: "MongoDB, Cassandra, Redis",
    },
    {
      type: "multi",
      question: "Which are front-end technologies?",
      options: ["HTML", "CSS", "JavaScript", "Java"],
      answer: "HTML, CSS, JavaScript",
    },
    {
      type: "multi",
      question: "Which are primitive data types in Java?",
      options: ["int", "char", "boolean", "Array"],
      answer: "int, char, boolean",
    },
    {
      type: "multi",
      question: "Which are logical operators in JavaScript?",
      options: ["&&", "||", "!", "%"],
      answer: "&&, ||, !",
    },
    {
      type: "multi",
      question: "Which are Git commands?",
      options: ["git clone", "git push", "git commit", "git build"],
      answer: "git clone, git push, git commit",
    },
    {
      type: "multi",
      question: "Which are types of inheritance?",
      options: ["Single", "Multiple", "Multilevel", "Binary"],
      answer: "Single, Multiple, Multilevel",
    },
    {
      type: "multi",
      question: "Which are database management systems?",
      options: ["MySQL", "Oracle", "MongoDB", "Photoshop"],
      answer: "MySQL, Oracle, MongoDB",
    },
    {
      type: "multi",
      question: "Which are cloud providers?",
      options: ["AWS", "Azure", "Google Cloud", "Firefox"],
      answer: "AWS, Azure, Google Cloud",
    },

    {
      type: "multi",
      question: "Which are bitwise operators?",
      options: ["&", "|", "^", "+"],
      answer: "&, |, ^",
    },
    {
      type: "multi",
      question: "Which are ES6 features?",
      options: [
        "Arrow Functions",
        "let/const",
        "Template Literals",
        "Pointers",
      ],
      answer: "Arrow Functions, let/const, Template Literals",
    },
    {
      type: "multi",
      question: "Which are graph traversal algorithms?",
      options: ["DFS", "BFS", "Bubble Sort", "Dijkstra"],
      answer: "DFS, BFS",
    },
    {
      type: "multi",
      question: "Which are types of joins in SQL?",
      options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "APPEND JOIN"],
      answer: "INNER JOIN, LEFT JOIN, RIGHT JOIN",
    },
    {
      type: "multi",
      question: "Which are characteristics of REST?",
      options: ["Stateless", "Client-Server", "Cacheable", "Compiled"],
      answer: "Stateless, Client-Server, Cacheable",
    },

    {
      type: "multi",
      question: "Which are responsive CSS units?",
      options: ["vw", "vh", "%", "px"],
      answer: "vw, vh, %",
    },
    {
      type: "multi",
      question: "Which are Java collection types?",
      options: ["List", "Set", "Map", "Pointer"],
      answer: "List, Set, Map",
    },
    {
      type: "multi",
      question: "Which are async techniques in JS?",
      options: ["Callbacks", "Promises", "async/await", "compile()"],
      answer: "Callbacks, Promises, async/await",
    },
    {
      type: "multi",
      question: "Which are Linux commands?",
      options: ["ls", "cd", "mkdir", "paint"],
      answer: "ls, cd, mkdir",
    },
    {
      type: "multi",
      question: "Which are software development models?",
      options: ["Waterfall", "Agile", "Spiral", "Binary"],
      answer: "Waterfall, Agile, Spiral",
    },

    {
      type: "multi",
      question: "Which are common data structures?",
      options: ["Array", "Stack", "Queue", "Compiler"],
      answer: "Array, Stack, Queue",
    },
    {
      type: "multi",
      question: "Which are machine learning types?",
      options: ["Supervised", "Unsupervised", "Reinforcement", "Compiled"],
      answer: "Supervised, Unsupervised, Reinforcement",
    },
    {
      type: "multi",
      question: "Which are JavaScript storage options?",
      options: ["localStorage", "sessionStorage", "cookies", "database()"],
      answer: "localStorage, sessionStorage, cookies",
    },
    {
      type: "multi",
      question: "Which are web security attacks?",
      options: ["XSS", "CSRF", "SQL Injection", "Flexbox"],
      answer: "XSS, CSRF, SQL Injection",
    },
    {
      type: "multi",
      question: "Which are mobile frameworks?",
      options: ["Flutter", "React Native", "Xamarin", "MySQL"],
      answer: "Flutter, React Native, Xamarin",
    },

    {
      type: "multi",
      question: "Which are characteristics of good code?",
      options: ["Readable", "Maintainable", "Efficient", "Colorful"],
      answer: "Readable, Maintainable, Efficient",
    },
    {
      type: "multi",
      question: "Which are comparison operators in JS?",
      options: ["==", "===", "!=", "<>"],
      answer: "==, ===, !=",
    },
    {
      type: "multi",
      question: "Which are types of testing?",
      options: [
        "Unit Testing",
        "Integration Testing",
        "System Testing",
        "Binary Testing",
      ],
      answer: "Unit Testing, Integration Testing, System Testing",
    },
    {
      type: "multi",
      question: "Which are data serialization formats?",
      options: ["JSON", "XML", "YAML", "HTML"],
      answer: "JSON, XML, YAML",
    },
    {
      type: "multi",
      question: "Which are CSS layout systems?",
      options: ["Flexbox", "Grid", "Table", "Binary"],
      answer: "Flexbox, Grid",
    },

    {
      type: "multi",
      question: "Which are exception handling keywords in Java?",
      options: ["try", "catch", "finally", "goto"],
      answer: "try, catch, finally",
    },
    {
      type: "multi",
      question: "Which are JavaScript error types?",
      options: ["SyntaxError", "TypeError", "ReferenceError", "LoopError"],
      answer: "SyntaxError, TypeError, ReferenceError",
    },
    {
      type: "multi",
      question: "Which are benefits of OOP?",
      options: ["Reusability", "Modularity", "Maintainability", "Color Coding"],
      answer: "Reusability, Modularity, Maintainability",
    },
    {
      type: "multi",
      question: "Which are valid Python data types?",
      options: ["int", "float", "str", "pointer"],
      answer: "int, float, str",
    },
    {
      type: "multi",
      question: "Which are types of APIs?",
      options: ["REST", "SOAP", "GraphQL", "Compiler"],
      answer: "REST, SOAP, GraphQL",
    },

    {
      type: "fill",
      question: "The data structure that follows FIFO principle is ______.",
      answer: "Queue",
    },
    {
      type: "fill",
      question: "The data structure that follows LIFO principle is ______.",
      answer: "Stack",
    },
    {
      type: "fill",
      question: "The time complexity of binary search is ______.",
      answer: "O(log n)",
    },
    {
      type: "fill",
      question:
        "In JavaScript, the keyword used to declare a constant is ______.",
      answer: "const",
    },
    {
      type: "fill",
      question: "In Python, single-line comments start with ______.",
      answer: "#",
    },
    {
      type: "fill",
      question: "The HTML tag used to include JavaScript is ______.",
      answer: "<script>",
    },
    {
      type: "fill",
      question: "The CSS selector used for IDs starts with ______.",
      answer: "#",
    },
    {
      type: "fill",
      question: "The SQL command used to remove a table is ______.",
      answer: "DROP",
    },
    {
      type: "fill",
      question: "The HTTP method used to retrieve data is ______.",
      answer: "GET",
    },
    {
      type: "fill",
      question:
        "The OOP principle that hides internal implementation is ______.",
      answer: "Abstraction",
    },

    {
      type: "fill",
      question:
        "The keyword used to define a function in JavaScript is ______.",
      answer: "function",
    },
    {
      type: "fill",
      question: "The traversal that gives sorted order in a BST is ______.",
      answer: "Inorder",
    },
    {
      type: "fill",
      question: "The algorithm that works only on sorted arrays is ______.",
      answer: "Binary Search",
    },
    {
      type: "fill",
      question: "The data structure used in recursion is ______.",
      answer: "Stack",
    },
    {
      type: "fill",
      question: "The Java keyword used for inheritance is ______.",
      answer: "extends",
    },
    {
      type: "fill",
      question: "The Python keyword used to handle exceptions is ______.",
      answer: "try",
    },
    {
      type: "fill",
      question: "The JavaScript operator that checks value and type is ______.",
      answer: "===",
    },
    {
      type: "fill",
      question: "The database language used to query data is ______.",
      answer: "SQL",
    },
    {
      type: "fill",
      question: "The sorting algorithm based on divide and conquer is ______.",
      answer: "Merge Sort",
    },
    {
      type: "fill",
      question: "The loop that executes at least once is ______.",
      answer: "do-while",
    },

    {
      type: "fill",
      question: "The Java keyword used to create an object is ______.",
      answer: "new",
    },
    {
      type: "fill",
      question: "The data structure that stores key-value pairs is ______.",
      answer: "Dictionary",
    },
    {
      type: "fill",
      question:
        "The JavaScript method used to add an element at the end of an array is ______.",
      answer: "push()",
    },
    {
      type: "fill",
      question: "The HTTP status code for Not Found is ______.",
      answer: "404",
    },
    {
      type: "fill",
      question:
        "The concept of using same function name with different parameters is called ______.",
      answer: "Overloading",
    },
    {
      type: "fill",
      question: "The memory that is volatile is ______.",
      answer: "RAM",
    },
    {
      type: "fill",
      question:
        "The algorithm used to find shortest path in weighted graph is ______.",
      answer: "Dijkstra",
    },
    {
      type: "fill",
      question: "The keyword used to exit a loop prematurely is ______.",
      answer: "break",
    },
    {
      type: "fill",
      question: "The data structure used in BFS is ______.",
      answer: "Queue",
    },
    {
      type: "fill",
      question:
        "The JavaScript runtime used for backend development is ______.",
      answer: "Node.js",
    },

    {
      type: "fill",
      question: "The data structure that avoids duplicate elements is ______.",
      answer: "Set",
    },
    {
      type: "fill",
      question: "The CSS property used to change text color is ______.",
      answer: "color",
    },
    {
      type: "fill",
      question: "The operator used for modulo in C is ______.",
      answer: "%",
    },
    {
      type: "fill",
      question: "The Java keyword referring to current object is ______.",
      answer: "this",
    },
    {
      type: "fill",
      question: "The SQL clause used to filter rows is ______.",
      answer: "WHERE",
    },
    {
      type: "fill",
      question: "The traversal that visits root first is ______.",
      answer: "Preorder",
    },
    {
      type: "fill",
      question:
        "The JavaScript keyword used to declare block-scoped variable is ______.",
      answer: "let",
    },
    {
      type: "fill",
      question:
        "The sorting algorithm that repeatedly selects the minimum element is ______.",
      answer: "Selection Sort",
    },
    {
      type: "fill",
      question: "The function used to print output in Python is ______.",
      answer: "print()",
    },
    {
      type: "fill",
      question: "The protocol used to send emails is ______.",
      answer: "SMTP",
    },

    {
      type: "fill",
      question: "The algorithm that explores nodes level by level is ______.",
      answer: "BFS",
    },
    {
      type: "fill",
      question: "The operator used for exponentiation in Python is ______.",
      answer: "**",
    },
    {
      type: "fill",
      question: "The SQL command used to retrieve data is ______.",
      answer: "SELECT",
    },
    {
      type: "fill",
      question:
        "The data structure that represents hierarchical data is ______.",
      answer: "Tree",
    },
    {
      type: "fill",
      question:
        "The JavaScript method used to remove the last element of an array is ______.",
      answer: "pop()",
    },
    {
      type: "fill",
      question: "The OOP principle that promotes code reuse is ______.",
      answer: "Inheritance",
    },
    {
      type: "fill",
      question: "The keyword used to throw an exception in Java is ______.",
      answer: "throw",
    },
    {
      type: "fill",
      question: "The time complexity of linear search is ______.",
      answer: "O(n)",
    },
    {
      type: "fill",
      question: "The normal form that removes partial dependency is ______.",
      answer: "2NF",
    },
    {
      type: "fill",
      question:
        "The data structure consisting of vertices and edges is ______.",
      answer: "Graph",
    },
  ],

  webdevelopement: [
    {
      type: "single",
      question: "Which HTML tag is used to define an internal style sheet?",
      options: ["<script>", "<style>", "<css>", "<link>"],
      answer: "<style>",
    },
    {
      type: "single",
      question: "What does CSS stand for?",
      options: [
        "Computer Style Sheets",
        "Creative Style Sheets",
        "Cascading Style Sheets",
        "Colorful Style Sheets",
      ],
      answer: "Cascading Style Sheets",
    },
    {
      type: "single",
      question:
        "Which HTML attribute specifies an alternate text for an image, if the image cannot be displayed?",
      options: ["title", "src", "alt", "href"],
      answer: "alt",
    },
    {
      type: "single",
      question: "Which is the correct CSS syntax?",
      options: [
        "body:color=black;",
        "{body:color=black;}",
        "body {color: black;}",
        "{body;color:black;}",
      ],
      answer: "body {color: black;}",
    },
    {
      type: "single",
      question: "How do you insert a comment in a CSS file?",
      options: [
        "// this is a comment",
        "/* this is a comment /",
        "' this is a comment",
        "",
      ],
      answer: "/ this is a comment /",
    },
    {
      type: "single",
      question: "Which property is used to change the background color in CSS?",
      options: ["color", "bgcolor", "background-color", "bg-color"],
      answer: "background-color",
    },
    {
      type: "single",
      question: "How do you add a background color for all <h1> elements?",
      options: [
        "h1 {background-color:#FFFFFF;}",
        "h1.all {background-color:#FFFFFF;}",
        "all.h1 {background-color:#FFFFFF;}",
        "h1 (background-color:#FFFFFF;)",
      ],
      answer: "h1 {background-color:#FFFFFF;}",
    },
    {
      type: "single",
      question: "Which CSS property controls the text size?",
      options: ["font-style", "text-size", "font-size", "text-style"],
      answer: "font-size",
    },
    {
      type: "single",
      question:
        "What is the correct syntax for referring to an external script called 'xxx.js'?",
      options: [
        "<script href='xxx.js'>",
        "<script name='xxx.js'>",
        "<script src='xxx.js'>",
        "<script file='xxx.js'>",
      ],
      answer: "<script src='xxx.js'>",
    },
    {
      type: "single",
      question: "How do you write 'Hello World' in an alert box?",
      options: [
        "msgBox('Hello World');",
        "alertBox('Hello World');",
        "msg('Hello World');",
        "alert('Hello World');",
      ],
      answer: "alert('Hello World');",
    },
    {
      type: "single",
      question: "How do you create a function in JavaScript?",
      options: [
        "function myFunction()",
        "function:myFunction()",
        "function = myFunction()",
        "create myFunction()",
      ],
      answer: "function myFunction()",
    },
    {
      type: "single",
      question: "How do you call a function named 'myFunction'?",
      options: [
        "call function myFunction()",
        "call myFunction()",
        "myFunction()",
        "execute myFunction()",
      ],
      answer: "myFunction()",
    },
    {
      type: "single",
      question: "How to write an IF statement in JavaScript?",
      options: ["if i = 5 then", "if i == 5 then", "if (i == 5)", "if i = 5"],
      answer: "if (i == 5)",
    },
    {
      type: "single",
      question: "How does a WHILE loop start?",
      options: [
        "while (i <= 10)",
        "while i = 1 to 10",
        "while (i <= 10; i++)",
        "while (i = 0; i <= 10)",
      ],
      answer: "while (i <= 10)",
    },
    {
      type: "single",
      question: "How does a FOR loop start?",
      options: [
        "for (i = 0; i <= 5)",
        "for (i = 0; i <= 5; i++)",
        "for i = 1 to 5",
        "for (i <= 5; i++)",
      ],
      answer: "for (i = 0; i <= 5; i++)",
    },
    {
      type: "single",
      question: "What is the correct way to write a JavaScript array?",
      options: [
        "var colors = 1 = ('red'), 2 = ('green')",
        "var colors = 'red', 'green'",
        "var colors = ['red', 'green']",
        "var colors = (1:'red', 2:'green')",
      ],
      answer: "var colors = ['red', 'green']",
    },
    {
      type: "single",
      question: "How do you round the number 7.25, to the nearest integer?",
      options: [
        "Math.rnd(7.25)",
        "Math.round(7.25)",
        "rnd(7.25)",
        "round(7.25)",
      ],
      answer: "Math.round(7.25)",
    },
    {
      type: "single",
      question: "How do you find the number with the highest value of x and y?",
      options: ["Math.max(x, y)", "Math.ceil(x, y)", "ceil(x, y)", "top(x, y)"],
      answer: "Math.max(x, y)",
    },
    {
      type: "single",
      question: "What is the correct HTML for creating a hyperlink?",
      options: [
        "<a name='http://www.w3schools.com'>W3Schools.com</a>",
        "<a href='http://www.w3schools.com'>W3Schools</a>",
        "<a url='http://www.w3schools.com'>W3Schools.com</a>",
        "<a>http://www.w3schools.com</a>",
      ],
      answer: "<a href='http://www.w3schools.com'>W3Schools</a>",
    },
    {
      type: "single",
      question: "Which character is used to indicate an end tag in HTML?",
      options: ["", "/", "<", "^"],
      answer: "/",
    },
    {
      type: "single",
      question: "How can you open a link in a new tab/browser window?",
      options: [
        "<a href='url' target='new'>",
        "<a href='url' new>",
        "<a href='url' target='_blank'>",
        "<a href='url' target='_window'>",
      ],
      answer: "<a href='url' target='_blank'>",
    },
    {
      type: "single",
      question: "Which HTML tag makes text bold?",
      options: ["<bold>", "<b>", "<bld>", "<bb>"],
      answer: "<b>",
    },
    {
      type: "single",
      question: "Which HTML tag makes text italic?",
      options: ["<i>", "<italic>", "<it>", "<ii>"],
      answer: "<i>",
    },
    {
      type: "single",
      question: "What is the correct HTML for inserting an image?",
      options: [
        "<img href='image.gif' alt='MyImage'>",
        "<image src='image.gif' alt='MyImage'>",
        "<img src='image.gif' alt='MyImage'>",
        "<img link='image.gif' alt='MyImage'>",
      ],
      answer: "<img src='image.gif' alt='MyImage'>",
    },
    {
      type: "single",
      question: "Which HTML tag is used to define a drop-down list?",
      options: ["<list>", "<select>", "<input type='dropdown'>", "<dropdown>"],
      answer: "<select>",
    },
    {
      type: "single",
      question:
        "Which HTML tag is used to define a multi-line text input control?",
      options: [
        "<textinput>",
        "<textarea>",
        "<input type='multiline'>",
        "<textbox>",
      ],
      answer: "<textarea>",
    },
    {
      type: "single",
      question: "Which HTML element defines the title of a document?",
      options: ["<meta>", "<head>", "<title>", "<h1>"],
      answer: "<title>",
    },
    {
      type: "single",
      question:
        "Which CSS property is used to change the text color of an element?",
      options: ["text-color", "fgcolor", "color", "font-color"],
      answer: "color",
    },
    {
      type: "single",
      question: "Which CSS property controls the text alignment?",
      options: ["text-style", "text-align", "text-position", "align-text"],
      answer: "text-align",
    },
    {
      type: "single",
      question: "Which property is used to remove the underline from links?",
      options: [
        "text-decoration: none;",
        "text-decoration: no-underline;",
        "text-style: none;",
        "decoration: none;",
      ],
      answer: "text-decoration: none;",
    },
    {
      type: "single",
      question: "How do you select an element with id 'demo'?",
      options: ["#demo", ".demo", "demo", "demo"],
      answer: "#demo",
    },
    {
      type: "single",
      question: "How do you select elements with class name 'test'?",
      options: ["#test", ".test", "test", "test"],
      answer: ".test",
    },
    {
      type: "single",
      question: "How do you select all p elements inside a div element?",
      options: ["div.p", "div + p", "div p", "div ~ p"],
      answer: "div p",
    },
    {
      type: "single",
      question: "What is the default value of the position property in CSS?",
      options: ["relative", "fixed", "absolute", "static"],
      answer: "static",
    },
    {
      type: "single",
      question:
        "Which JavaScript event occurs when the user clicks on an HTML element?",
      options: ["onmouseclick", "onchange", "onclick", "onmouseover"],
      answer: "onclick",
    },
    {
      type: "single",
      question: "How do you declare a JavaScript variable?",
      options: [
        "variable carName;",
        "v carName;",
        "var carName;",
        "string carName;",
      ],
      answer: "var carName;",
    },
    {
      type: "single",
      question: "Which operator is used to assign a value to a variable?",
      options: ["", "-", "=", "x"],
      answer: "=",
    },
    {
      type: "single",
      question: "What will the following code return: Boolean(10 > 9)",
      options: ["false", "true", "NaN", "undefined"],
      answer: "true",
    },
    {
      type: "single",
      question: "Is JavaScript case-sensitive?",
      options: ["Yes", "No", "Only for variables", "Only for functions"],
      answer: "Yes",
    },
    {
      type: "single",
      question: "Which data type is NOT supported in JavaScript?",
      options: ["Boolean", "Undefined", "Float", "String"],
      answer: "Float",
    },
    {
      type: "single",
      question: "What does DOM stand for?",
      options: [
        "Document Object Model",
        "Data Object Model",
        "Document Oriented Model",
        "Data Oriented Model",
      ],
      answer: "Document Object Model",
    },
    {
      type: "single",
      question: "Which method is used to access an HTML element by its ID?",
      options: [
        "getElementById()",
        "getElement(id)",
        "selectById()",
        "querySelector(id)",
      ],
      answer: "getElementById()",
    },
    {
      type: "single",
      question: "What is the purpose of the 'this' keyword in JavaScript?",
      options: [
        "Refers to the current HTML file",
        "Refers to the current object",
        "Refers to the parent function",
        "Refers to the window object always",
      ],
      answer: "Refers to the current object",
    },
    {
      type: "single",
      question:
        "Which keyword is used to declare a block-scoped variable in ES6?",
      options: ["var", "let", "constant", "block"],
      answer: "let",
    },
    {
      type: "single",
      question: "What does JSON stand for?",
      options: [
        "JavaScript Object Notation",
        "JavaScript Online Network",
        "Java Syntax Object Network",
        "JavaScript Output Node",
      ],
      answer: "JavaScript Object Notation",
    },
    {
      type: "single",
      question:
        "Which function is used to parse a JSON string into a JavaScript object?",
      options: [
        "JSON.stringify()",
        "JSON.parse()",
        "JSON.toObject()",
        "JSON.read()",
      ],
      answer: "JSON.parse()",
    },
    {
      type: "single",
      question: "What is a Closure in JavaScript?",
      options: [
        "A function inside another function",
        "A way to close the browser",
        "A closed CSS class",
        "Ending a loop",
      ],
      answer: "A function inside another function",
    },
    {
      type: "single",
      question:
        "Which CSS property is used to create space around elements, outside of any defined borders?",
      options: ["padding", "margin", "spacing", "border-spacing"],
      answer: "margin",
    },
    {
      type: "single",
      question:
        "Which CSS property is used to create space around elements, inside of any defined borders?",
      options: ["margin", "padding", "spacing", "inner-margin"],
      answer: "padding",
    },
    {
      type: "single",
      question:
        "How do you make each word in a text start with a capital letter using CSS?",
      options: [
        "text-transform: capitalize",
        "text-style: capital",
        "transform: capitalize",
        "font-transform: uppercase",
      ],
      answer: "text-transform: capitalize",
    },
    {
      type: "single",
      question: "Which property is used to change the font of an element?",
      options: ["font-weight", "font-style", "font-family", "font-type"],
      answer: "font-family",
    },
    {
      type: "single",
      question: "How do you make a list that lists its items with squares?",
      options: [
        "list-type: square;",
        "list-style-type: square;",
        "list-style: square;",
        "list: square;",
      ],
      answer: "list-style-type: square;",
    },
    {
      type: "single",
      question: "What is the correct CSS syntax to select all <p> elements?",
      options: ["p {}", "all.p {}", "#p {}", ".p {}"],
      answer: "p {}",
    },
    {
      type: "single",
      question: "What is the default flex-direction in CSS Flexbox?",
      options: ["column", "row", "row-reverse", "column-reverse"],
      answer: "row",
    },
    {
      type: "single",
      question: "Which property applies to flex containers, not flex items?",
      options: ["align-self", "flex-grow", "justify-content", "order"],
      answer: "justify-content",
    },
    {
      type: "single",
      question:
        "In React, what is used to pass data to a component from outside?",
      options: ["setState", "props", "PropTypes", "state"],
      answer: "props",
    },
    {
      type: "single",
      question:
        "Which hook is used to manage state in a functional React component?",
      options: ["useEffect", "useContext", "useState", "useReducer"],
      answer: "useState",
    },
    {
      type: "single",
      question: "What does JSX stand for?",
      options: [
        "JavaScript XML",
        "Java Syntax Extension",
        "JavaScript Extension",
        "JSON XML",
      ],
      answer: "JavaScript XML",
    },
    {
      type: "single",
      question: "Which method is required in a React class component?",
      options: [
        "componentDidMount()",
        "render()",
        "constructor()",
        "getInitialState()",
      ],
      answer: "render()",
    },
    {
      type: "single",
      question: "What is Node.js primarily used for?",
      options: [
        "Frontend development",
        "Styling web pages",
        "Backend development",
        "Database management",
      ],
      answer: "Backend development",
    },
    {
      type: "single",
      question: "Which package manager comes bundled with Node.js?",
      options: ["Yarn", "Bower", "npm", "Webpack"],
      answer: "npm",
    },
    {
      type: "single",
      question: "What does API stand for?",
      options: [
        "Application Programming Interface",
        "Advanced Programming Interface",
        "Application Process Integration",
        "Automated Program Interface",
      ],
      answer: "Application Programming Interface",
    },
    {
      type: "single",
      question: "Which HTTP status code signifies a successful request?",
      options: ["200", "404", "500", "301"],
      answer: "200",
    },
    {
      type: "single",
      question: "Which HTTP status code signifies an Internal Server Error?",
      options: ["400", "401", "403", "500"],
      answer: "500",
    },
    {
      type: "single",
      question: "What is the purpose of the 'alt' attribute on images?",
      options: [
        "To provide a tooltip",
        "For accessibility and fallback text",
        "To style the image",
        "To link the image",
      ],
      answer: "For accessibility and fallback text",
    },
    {
      type: "single",
      question:
        "Which CSS unit is relative to the font-size of the root element?",
      options: ["em", "rem", "px", "vh"],
      answer: "rem",
    },
    {
      type: "single",
      question: "What is the output of typeof null in JavaScript?",
      options: ["'null'", "'undefined'", "'object'", "'boolean'"],
      answer: "'object'",
    },
    {
      type: "single",
      question:
        "Which JavaScript method adds an element to the beginning of an array?",
      options: ["push()", "pop()", "shift()", "unshift()"],
      answer: "unshift()",
    },
    {
      type: "single",
      question: "Which JavaScript method removes the last element of an array?",
      options: ["pop()", "push()", "shift()", "splice()"],
      answer: "pop()",
    },
    {
      type: "single",
      question: "What does CORS stand for?",
      options: [
        "Cross-Origin Resource Sharing",
        "Cross-Origin Resource Security",
        "Computer Object Resource Sharing",
        "Code Origin Resource Sharing",
      ],
      answer: "Cross-Origin Resource Sharing",
    },
    {
      type: "single",
      question:
        "Which HTML element is used to specify a header for a document or section?",
      options: ["<head>", "<header>", "<top>", "<section>"],
      answer: "<header>",
    },
    {
      type: "single",
      question:
        "Which HTML element is used to specify a footer for a document or section?",
      options: ["<bottom>", "<footer>", "<end>", "<section>"],
      answer: "<footer>",
    },
    {
      type: "single",
      question: "What is the purpose of the <canvas> element in HTML5?",
      options: [
        "Displaying database records",
        "Drawing graphics via scripting",
        "Creating 3D models only",
        "Playing audio files",
      ],
      answer: "Drawing graphics via scripting",
    },
    {
      type: "single",
      question:
        "Which CSS property is used to specify the transparency of an element?",
      options: ["visibility", "opacity", "transparent", "filter"],
      answer: "opacity",
    },
    {
      type: "single",
      question: "How do you group selectors in CSS?",
      options: [
        "Separate with a comma",
        "Separate with a space",
        "Separate with a plus sign",
        "Separate with a hyphen",
      ],
      answer: "Separate with a comma",
    },
    {
      type: "single",
      question: "What is the correct syntax for a CSS comment?",
      options: ["// Comment", "", "/ Comment /", "' Comment"],
      answer: "/ Comment */",
    },
    {
      type: "single",
      question:
        "Which property is used to set the background image of an element?",
      options: ["background-image", "bg-image", "image", "background-picture"],
      answer: "background-image",
    },
    {
      type: "single",
      question: "How do you repeat a background image only vertically?",
      options: [
        "background-repeat: repeat-x;",
        "background-repeat: repeat-y;",
        "background-repeat: no-repeat;",
        "background-repeat: vertical;",
      ],
      answer: "background-repeat: repeat-y;",
    },
    {
      type: "single",
      question: "Which CSS property controls how an element is positioned?",
      options: ["display", "position", "float", "align"],
      answer: "position",
    },
    {
      type: "single",
      question: "What does 'float: left;' do in CSS?",
      options: [
        "Aligns text to the left",
        "Floats the element to the left of its container",
        "Removes the element from the document flow completely",
        "Makes the element invisible",
      ],
      answer: "Floats the element to the left of its container",
    },
    {
      type: "single",
      question:
        "Which pseudo-class is used to style an element when a user mouses over it?",
      options: [":active", ":focus", ":hover", ":visited"],
      answer: ":hover",
    },
    {
      type: "single",
      question: "What does 'display: none;' do?",
      options: [
        "Hides the element but keeps its space",
        "Hides the element and removes its space",
        "Makes the element transparent",
        "Minimizes the element",
      ],
      answer: "Hides the element and removes its space",
    },
    {
      type: "single",
      question: "What does 'visibility: hidden;' do?",
      options: [
        "Hides the element but keeps its space",
        "Hides the element and removes its space",
        "Makes the element transparent",
        "Deletes the element from the DOM",
      ],
      answer: "Hides the element but keeps its space",
    },
    {
      type: "single",
      question: "Which CSS property is used to add shadows to text?",
      options: ["box-shadow", "text-shadow", "font-shadow", "shadow"],
      answer: "text-shadow",
    },
    {
      type: "single",
      question: "Which HTML tag is used to define an interactive table?",
      options: ["<table>", "<grid>", "<data>", "<sheet>"],
      answer: "<table>",
    },
    {
      type: "single",
      question: "Which HTML element specifies a list item?",
      options: ["<ul>", "<ol>", "<li>", "<item>"],
      answer: "<li>",
    },
    {
      type: "single",
      question: "Which input type defines a slider control?",
      options: ["slider", "range", "controls", "scroll"],
      answer: "range",
    },
    {
      type: "single",
      question: "Which input type defines a field for an email address?",
      options: ["text", "email", "url", "message"],
      answer: "email",
    },
    {
      type: "single",
      question:
        "What is the correct JavaScript syntax to change the content of the HTML element <p id='demo'>This is a demonstration.</p>?",
      options: [
        "document.getElementById('demo').innerHTML = 'Hello World!';",
        "document.getElement('p').innerHTML = 'Hello World!';",
        "#demo.innerHTML = 'Hello World!';",
        "document.getElementById('demo').textContent = 'Hello World!';",
      ],
      answer: "document.getElementById('demo').innerHTML = 'Hello World!';",
    },
    {
      type: "single",
      question: "Where is the correct place to insert a JavaScript?",
      options: [
        "The <head> section",
        "The <body> section",
        "Both the <head> section and the <body> section are correct",
        "Outside the <html> tag",
      ],
      answer: "Both the <head> section and the <body> section are correct",
    },
    {
      type: "single",
      question: "Which JavaScript keyword is used to declare a constant?",
      options: ["var", "let", "const", "constant"],
      answer: "const",
    },
    {
      type: "single",
      question: "How do you write a strict equality check in JavaScript?",
      options: ["=", "==", "===", "!=="],
      answer: "===",
    },
    {
      type: "single",
      question: "Which built-in method returns the length of a string?",
      options: ["length()", "size()", "index()", "length"],
      answer: "length",
    },
    {
      type: "single",
      question:
        "Which JavaScript method is used to write text into an alert box?",
      options: [
        "console.log()",
        "document.write()",
        "alert()",
        "window.alertBox()",
      ],
      answer: "alert()",
    },
    {
      type: "single",
      question: "What is the result of '2' + 2 in JavaScript?",
      options: ["4", "'4'", "'22'", "NaN"],
      answer: "'22'",
    },
    {
      type: "single",
      question: "Which of these is a popular CSS framework?",
      options: ["React", "Angular", "Bootstrap", "Django"],
      answer: "Bootstrap",
    },
    {
      type: "single",
      question:
        "Which technology is used to define the structure of a webpage?",
      options: ["CSS", "JavaScript", "HTML", "PHP"],
      answer: "HTML",
    },
    {
      type: "single",
      question:
        "Which command is used to start a new React project using Create React App?",
      options: [
        "npm init react-app",
        "npx create-react-app my-app",
        "npm start react",
        "create-react my-app",
      ],
      answer: "npx create-react-app my-app",
    },
    {
      type: "single",
      question:
        "In Git, which command is used to save changes to the local repository?",
      options: ["git push", "git commit", "git save", "git add"],
      answer: "git commit",
    },
    {
      type: "single",
      question: "Which Web API is used to make HTTP requests from the browser?",
      options: ["Fetch API", "DOM API", "Canvas API", "Storage API"],
      answer: "Fetch API",
    },
    {
      type: "multi",
      question: "Which of the following are HTML block-level elements?",
      options: ["<div>", "<span>", "<p>", "<a>"],
      answer: "<div>, <p>",
    },
    {
      type: "multi",
      question: "Which of the following are valid CSS length units?",
      options: ["px", "em", "rem", "pt"],
      answer: "px, em, rem, pt",
    },
    {
      type: "multi",
      question: "Which of these are JavaScript primitive data types?",
      options: ["String", "Number", "Object", "Boolean"],
      answer: "String, Number, Boolean",
    },
    {
      type: "multi",
      question: "Which of the following are CSS layout modules?",
      options: ["Flexbox", "Grid", "Float", "Table"],
      answer: "Flexbox, Grid",
    },
    {
      type: "multi",
      question: "Which tags belong in the HTML <head> section?",
      options: ["<title>", "<meta>", "<body>", "<link>"],
      answer: "<title>, <meta>, <link>",
    },
    {
      type: "multi",
      question:
        "Which of these are valid ways to declare variables in modern JavaScript?",
      options: ["var", "let", "const", "def"],
      answer: "var, let, const",
    },
    {
      type: "multi",
      question: "Which of the following are valid HTTP methods?",
      options: ["GET", "POST", "PUSH", "DELETE"],
      answer: "GET, POST, DELETE",
    },
    {
      type: "multi",
      question: "Which properties are associated with CSS Flexbox?",
      options: [
        "justify-content",
        "align-items",
        "flex-direction",
        "grid-template-columns",
      ],
      answer: "justify-content, align-items, flex-direction",
    },
    {
      type: "multi",
      question: "Which of these are front-end JavaScript frameworks/libraries?",
      options: ["React", "Angular", "Vue", "Express"],
      answer: "React, Angular, Vue",
    },
    {
      type: "multi",
      question: "Which of the following are valid CSS pseudo-classes?",
      options: [":hover", ":active", "::before", ":focus"],
      answer: ":hover, :active, :focus",
    },
    {
      type: "multi",
      question:
        "Which attributes are essential for accessible images and inputs?",
      options: ["alt", "title", "aria-label", "style"],
      answer: "alt, aria-label",
    },
    {
      type: "multi",
      question: "Which array methods mutate the original array in JavaScript?",
      options: ["push()", "pop()", "map()", "splice()"],
      answer: "push(), pop(), splice()",
    },
    {
      type: "multi",
      question: "Which array methods return a new array in JavaScript?",
      options: ["map()", "filter()", "forEach()", "slice()"],
      answer: "map(), filter(), slice()",
    },
    {
      type: "multi",
      question: "Which statements are used for error handling in JavaScript?",
      options: ["try", "catch", "finally", "error"],
      answer: "try, catch, finally",
    },
    {
      type: "multi",
      question: "Which of the following are Web Storage APIs?",
      options: ["localStorage", "sessionStorage", "cookies", "IndexedDB"],
      answer: "localStorage, sessionStorage, IndexedDB",
    },
    {
      type: "multi",
      question: "Which CSS properties are used to control the box model?",
      options: ["margin", "padding", "border", "font-size"],
      answer: "margin, padding, border",
    },
    {
      type: "multi",
      question: "Which values are valid for the CSS 'display' property?",
      options: ["block", "inline", "flex", "hidden"],
      answer: "block, inline, flex",
    },
    {
      type: "multi",
      question:
        "Which of the following are features introduced in ES6 (ES2015)?",
      options: [
        "Arrow functions",
        "Promises",
        "Template literals",
        "var keyword",
      ],
      answer: "Arrow functions, Promises, Template literals",
    },
    {
      type: "multi",
      question:
        "Which tools are commonly used as module bundlers in web development?",
      options: ["Webpack", "Parcel", "Rollup", "NPM"],
      answer: "Webpack, Parcel, Rollup",
    },
    {
      type: "multi",
      question: "Which properties define a CSS Grid layout?",
      options: [
        "display: grid",
        "grid-template-columns",
        "grid-gap",
        "flex-wrap",
      ],
      answer: "display: grid, grid-template-columns, grid-gap",
    },
    {
      type: "multi",
      question: "Which HTML5 tags are considered semantic?",
      options: ["<article>", "<div>", "<section>", "<nav>"],
      answer: "<article>, <section>, <nav>",
    },
    {
      type: "multi",
      question: "Which events are related to mouse actions in JavaScript?",
      options: ["onclick", "onmouseover", "onkeydown", "onmouseout"],
      answer: "onclick, onmouseover, onmouseout",
    },
    {
      type: "multi",
      question:
        "Which elements are necessary for a basic HTML5 document structure?",
      options: ["<!DOCTYPE html>", "<html>", "<head>", "<script>"],
      answer: "<!DOCTYPE html>, <html>, <head>",
    },
    {
      type: "multi",
      question: "Which of these are CSS preprocessors?",
      options: ["SASS", "LESS", "Stylus", "Babel"],
      answer: "SASS, LESS, Stylus",
    },
    {
      type: "multi",
      question: "Which headers are related to CORS?",
      options: [
        "Access-Control-Allow-Origin",
        "Access-Control-Allow-Methods",
        "Content-Type",
        "Authorization",
      ],
      answer: "Access-Control-Allow-Origin, Access-Control-Allow-Methods",
    },
    {
      type: "multi",
      question: "Which data formats are commonly used for API responses?",
      options: ["JSON", "XML", "CSV", "CSS"],
      answer: "JSON, XML",
    },
    {
      type: "multi",
      question: "Which features are specific to React?",
      options: ["JSX", "Virtual DOM", "Two-way data binding", "Hooks"],
      answer: "JSX, Virtual DOM, Hooks",
    },
    {
      type: "multi",
      question: "Which are popular Node.js frameworks?",
      options: ["Express", "NestJS", "Koa", "Django"],
      answer: "Express, NestJS, Koa",
    },
    {
      type: "multi",
      question: "Which are common web vulnerabilities?",
      options: [
        "Cross-Site Scripting (XSS)",
        "SQL Injection",
        "Cross-Site Request Forgery (CSRF)",
        "Semantic HTML",
      ],
      answer:
        "Cross-Site Scripting (XSS), SQL Injection, Cross-Site Request Forgery (CSRF)",
    },
    {
      type: "multi",
      question: "Which of these are valid HTML form input types?",
      options: ["text", "password", "checkbox", "button"],
      answer: "text, password, checkbox, button",
    },
    {
      type: "multi",
      question:
        "Which of the following are valid values for 'position' in CSS?",
      options: ["static", "relative", "absolute", "center"],
      answer: "static, relative, absolute",
    },
    {
      type: "multi",
      question:
        "Which objects are available in the browser's global scope (Window)?",
      options: ["document", "console", "localStorage", "process"],
      answer: "document, console, localStorage",
    },
    {
      type: "multi",
      question: "Which methods belong to the JavaScript console object?",
      options: ["log()", "error()", "warn()", "print()"],
      answer: "log(), error(), warn()",
    },
    {
      type: "multi",
      question: "Which elements are inline by default?",
      options: ["<span>", "<a>", "<div>", "<strong>"],
      answer: "<span>, <a>, <strong>",
    },
    {
      type: "multi",
      question: "Which of these are state management libraries for React?",
      options: ["Redux", "MobX", "Zustand", "Express"],
      answer: "Redux, MobX, Zustand",
    },
    {
      type: "multi",
      question: "Which of these are valid JavaScript loop constructs?",
      options: ["for", "while", "do...while", "foreach"],
      answer: "for, while, do...while",
    },
    {
      type: "multi",
      question: "Which methods are used to parse strings into numbers in JS?",
      options: ["parseInt()", "parseFloat()", "Number()", "toString()"],
      answer: "parseInt(), parseFloat(), Number()",
    },
    {
      type: "multi",
      question: "Which tools help in debugging JavaScript in the browser?",
      options: [
        "Chrome DevTools",
        "console.log",
        "Breakpoints",
        "CSS Validator",
      ],
      answer: "Chrome DevTools, console.log, Breakpoints",
    },
    {
      type: "multi",
      question: "Which of these are features of Progressive Web Apps (PWAs)?",
      options: [
        "Offline capabilities",
        "Push notifications",
        "Installable on home screen",
        "Requires a database",
      ],
      answer:
        "Offline capabilities, Push notifications, Installable on home screen",
    },
    {
      type: "multi",
      question: "Which attributes can be used with the <script> tag?",
      options: ["src", "async", "defer", "href"],
      answer: "src, async, defer",
    },
    {
      type: "multi",
      question: "Which of these describe REST API architectural constraints?",
      options: ["Stateless", "Client-Server", "Cacheable", "Two-way binding"],
      answer: "Stateless, Client-Server, Cacheable",
    },
    {
      type: "multi",
      question: "Which CSS properties handle typography?",
      options: ["font-family", "line-height", "letter-spacing", "z-index"],
      answer: "font-family, line-height, letter-spacing",
    },
    {
      type: "multi",
      question: "Which properties are used in CSS animations?",
      options: [
        "animation-name",
        "animation-duration",
        "keyframes",
        "transition-delay",
      ],
      answer: "animation-name, animation-duration, keyframes",
    },
    {
      type: "multi",
      question: "Which JS methods are used to select DOM elements?",
      options: [
        "getElementById",
        "querySelector",
        "querySelectorAll",
        "getDOMNode",
      ],
      answer: "getElementById, querySelector, querySelectorAll",
    },

    {
      type: "multi",
      question: "Which formats are supported for images on the web?",
      options: ["JPEG", "PNG", "SVG", "TXT"],
      answer: "JPEG, PNG, SVG",
    },
    {
      type: "multi",
      question: "Which technologies are often part of the MERN stack?",
      options: ["MongoDB", "Express", "React", "Node.js"],
      answer: "MongoDB, Express, React, Node.js",
    },
    {
      type: "multi",
      question: "Which keywords are related to asynchronous JavaScript?",
      options: ["async", "await", "Promise", "sync"],
      answer: "async, await, Promise",
    },
    {
      type: "multi",
      question: "Which CSS properties are part of the background shorthand?",
      options: [
        "background-color",
        "background-image",
        "background-repeat",
        "background-font",
      ],
      answer: "background-color, background-image, background-repeat",
    },
    {
      type: "multi",
      question: "Which tags are used to construct an HTML table?",
      options: ["<table>", "<tr>", "<td>", "<list>"],
      answer: "<table>, <tr>, <td>",
    },
    {
      type: "fill",
      question: "The HTML tag used to define a hyperlink is ______.",
      answer: "<a>",
    },
    {
      type: "fill",
      question: "The CSS property to change text color is ______.",
      answer: "color",
    },
    {
      type: "fill",
      question:
        "The JavaScript method to write into the browser console is ______.",
      answer: "console.log()",
    },
    {
      type: "fill",
      question: "The default port for HTTP traffic is ______.",
      answer: "80",
    },
    {
      type: "fill",
      question: "The default port for HTTPS traffic is ______.",
      answer: "443",
    },
    {
      type: "fill",
      question: "The acronym DOM stands for Document Object ______.",
      answer: "Model",
    },
    {
      type: "fill",
      question: "The HTML tag for the most important heading is ______.",
      answer: "<h1>",
    },
    {
      type: "fill",
      question: "In CSS, the ID selector is denoted by a ______ symbol.",
      answer: "#",
    },
    {
      type: "fill",
      question: "In CSS, the class selector is denoted by a ______ symbol.",
      answer: ".",
    },
    {
      type: "fill",
      question:
        "The JavaScript keyword to define a block-scoped constant is ______.",
      answer: "const",
    },
    {
      type: "fill",
      question: "The file extension for a JavaScript file is ______.",
      answer: ".js",
    },
    {
      type: "fill",
      question: "The HTML tag used to embed an image is ______.",
      answer: "<img>",
    },
    {
      type: "fill",
      question: "The CSS property used to make text bold is ______.",
      answer: "font-weight",
    },
    {
      type: "fill",
      question:
        "The JavaScript array method that adds items to the end is ______.",
      answer: "push()",
    },
    {
      type: "fill",
      question: "The acronym API stands for Application Programming ______.",
      answer: "Interface",
    },
    {
      type: "fill",
      question: "In React, a function component returns ______ code.",
      answer: "JSX",
    },
    {
      type: "fill",
      question:
        "The CSS box model consists of margins, borders, padding, and the actual ______.",
      answer: "content",
    },
    {
      type: "fill",
      question:
        "The HTML attribute used to uniquely identify an element is ______.",
      answer: "id",
    },
    {
      type: "fill",
      question:
        "The JavaScript function used to delay code execution is ______.",
      answer: "setTimeout()",
    },
    {
      type: "fill",
      question:
        "The CSS property to hide an element without losing its space is visibility: ______.",
      answer: "hidden",
    },
    {
      type: "fill",
      question:
        "The CSS layout module designed for one-dimensional layouts is ______.",
      answer: "Flexbox",
    },
    {
      type: "fill",
      question:
        "The CSS layout module designed for two-dimensional layouts is ______.",
      answer: "Grid",
    },
    {
      type: "fill",
      question: "The JavaScript operator '===' checks both value and ______.",
      answer: "type",
    },
    {
      type: "fill",
      question:
        "To include an external CSS file, you use the ______ tag inside the <head>.",
      answer: "<link>",
    },
    {
      type: "fill",
      question: "The CSS unit 'vh' stands for Viewport ______.",
      answer: "Height",
    },
    {
      type: "fill",
      question: "The package manager for Node.js is abbreviated as ______.",
      answer: "npm",
    },
    {
      type: "fill",
      question: "In JavaScript, 'NaN' stands for Not a ______.",
      answer: "Number",
    },
    {
      type: "fill",
      question:
        "The HTML tag used to group block-level elements for styling is ______.",
      answer: "<div>",
    },
    {
      type: "fill",
      question:
        "The HTML tag used to group inline-elements for styling is ______.",
      answer: "<span>",
    },
    {
      type: "fill",
      question: "The JavaScript keyword used to resolve a Promise is .",
      answer: "await",
    },
    {
      type: "fill",
      question:
        "The JSON. method converts a JavaScript object into a JSON string.",
      answer: "stringify()",
    },
    {
      type: "fill",
      question: "The HTML tag to create an ordered list is ______.",
      answer: "<ol>",
    },
    {
      type: "fill",
      question: "The HTML tag to create an unordered list is ______.",
      answer: "<ul>",
    },
    {
      type: "fill",
      question: "The CSS property to add a shadow to a box is ______.",
      answer: "box-shadow",
    },
    {
      type: "fill",
      question: "The React hook used to perform side effects is ______.",
      answer: "useEffect",
    },
    {
      type: "fill",
      question:
        "The JS method document.______ is used to select the first element matching a CSS selector.",
      answer: "querySelector()",
    },
    {
      type: "fill",
      question:
        "In a URL, the section after '?' used to pass data to the server is the ______ string.",
      answer: "query",
    },
    {
      type: "fill",
      question: "The HTTP status code 404 means Not ______.",
      answer: "Found",
    },
    {
      type: "fill",
      question: "The CSS rule @media is used to create ______ designs.",
      answer: "responsive",
    },
    {
      type: "fill",
      question:
        "A function passed as an argument to another function is called a ______ function.",
      answer: "callback",
    },
    {
      type: "fill",
      question:
        "The HTML attribute that specifies the destination of a link is ______.",
      answer: "href",
    },
    {
      type: "fill",
      question: "The acronym CSS stands for Cascading Style ______.",
      answer: "Sheets",
    },
    {
      type: "fill",
      question:
        "To start a Node.js server from a file named app.js, the command is node ______.",
      answer: "app.js",
    },
    {
      type: "fill",
      question:
        "The CSS property that specifies the space between the element's border and inner content is ______.",
      answer: "padding",
    },
    {
      type: "fill",
      question:
        "The CSS property that specifies the space outside an element's border is ______.",
      answer: "margin",
    },
    {
      type: "fill",
      question:
        "In HTML forms, the ______ attribute specifies where to send the form data.",
      answer: "action",
    },
    {
      type: "fill",
      question:
        "The window.______ object contains information about the current URL.",
      answer: "location",
    },
    {
      type: "fill",
      question:
        "A JavaScript object used to store data locally in the browser with no expiration time is ______.",
      answer: "localStorage",
    },
    {
      type: "fill",
      question: "The HTML5 element <video> is used to embed ______ content.",
      answer: "video",
    },
    {
      type: "fill",
      question: "The keyword used to define a class in JavaScript is ______.",
      answer: "class",
    },
  ],

  computernetworks: [
    {
      type: "single",
      question: "Which of the following is not a network topology?",
      options: ["Star", "Ring", "Bus", "Peer-to-Peer"],
      answer: "Peer-to-Peer",
    },
    {
      type: "single",
      question: "Which layer of the OSI model does a router operate at?",
      options: [
        "Data Link Layer",
        "Network Layer",
        "Transport Layer",
        "Physical Layer",
      ],
      answer: "Network Layer",
    },
    {
      type: "single",
      question: "What is the standard port number for HTTP?",
      options: ["21", "25", "80", "443"],
      answer: "80",
    },
    {
      type: "single",
      question: "What is the standard port number for HTTPS?",
      options: ["80", "443", "22", "21"],
      answer: "443",
    },
    {
      type: "single",
      question:
        "Which protocol is used to translate domain names to IP addresses?",
      options: ["DHCP", "DNS", "FTP", "ARP"],
      answer: "DNS",
    },
    {
      type: "single",
      question: "Which protocol assigns IP addresses to devices dynamically?",
      options: ["DNS", "DHCP", "SMTP", "SNMP"],
      answer: "DHCP",
    },
    {
      type: "single",
      question: "What is the size of an IPv4 address?",
      options: ["16 bits", "32 bits", "64 bits", "128 bits"],
      answer: "32 bits",
    },
    {
      type: "single",
      question: "What is the size of an IPv6 address?",
      options: ["32 bits", "64 bits", "128 bits", "256 bits"],
      answer: "128 bits",
    },
    {
      type: "single",
      question: "Which protocol is used for sending emails?",
      options: ["POP3", "IMAP", "SMTP", "FTP"],
      answer: "SMTP",
    },
    {
      type: "single",
      question: "What does LAN stand for?",
      options: [
        "Large Area Network",
        "Local Area Network",
        "Logical Area Network",
        "Link Access Network",
      ],
      answer: "Local Area Network",
    },
    {
      type: "single",
      question:
        "Which device connects multiple networks and routes packets between them?",
      options: ["Hub", "Switch", "Router", "Repeater"],
      answer: "Router",
    },
    {
      type: "single",
      question: "At which OSI layer does a switch primarily operate?",
      options: ["Physical", "Data Link", "Network", "Transport"],
      answer: "Data Link",
    },
    {
      type: "single",
      question: "What is the length of a MAC address?",
      options: ["16 bits", "32 bits", "48 bits", "64 bits"],
      answer: "48 bits",
    },
    {
      type: "single",
      question:
        "Which address is known as the physical address of a network interface card?",
      options: ["IP Address", "MAC Address", "Port Number", "Socket Address"],
      answer: "MAC Address",
    },
    {
      type: "single",
      question: "Which protocol resolves IP addresses to MAC addresses?",
      options: ["ARP", "RARP", "DNS", "DHCP"],
      answer: "ARP",
    },
    {
      type: "single",
      question: "Which of these is a connectionless transport layer protocol?",
      options: ["TCP", "UDP", "IP", "HTTP"],
      answer: "UDP",
    },
    {
      type: "single",
      question:
        "Which of these is a connection-oriented transport layer protocol?",
      options: ["UDP", "IP", "TCP", "ICMP"],
      answer: "TCP",
    },
    {
      type: "single",
      question: "What is the default subnet mask for a Class A IP address?",
      options: ["255.0.0.0", "255.255.0.0", "255.255.255.0", "255.255.255.255"],
      answer: "255.0.0.0",
    },
    {
      type: "single",
      question: "What is the default subnet mask for a Class C IP address?",
      options: ["255.0.0.0", "255.255.0.0", "255.255.255.0", "255.255.255.255"],
      answer: "255.255.255.0",
    },
    {
      type: "single",
      question: "Which port does SSH use?",
      options: ["21", "22", "23", "25"],
      answer: "22",
    },
    {
      type: "single",
      question: "Which port does Telnet use?",
      options: ["21", "22", "23", "25"],
      answer: "23",
    },
    {
      type: "single",
      question:
        "Which tool is used to test the reachability of a host on an IP network?",
      options: ["Traceroute", "Ping", "Netstat", "Ifconfig"],
      answer: "Ping",
    },
    {
      type: "single",
      question: "What protocol does Ping use to send echo requests?",
      options: ["TCP", "UDP", "ICMP", "IGMP"],
      answer: "ICMP",
    },
    {
      type: "single",
      question: "Which layer is responsible for routing in the OSI model?",
      options: [
        "Transport Layer",
        "Data Link Layer",
        "Network Layer",
        "Physical Layer",
      ],
      answer: "Network Layer",
    },
    {
      type: "single",
      question: "How many layers are there in the OSI model?",
      options: ["4", "5", "6", "7"],
      answer: "7",
    },
    {
      type: "single",
      question: "How many layers are typically in the TCP/IP model?",
      options: ["3", "4", "6", "7"],
      answer: "4",
    },
    {
      type: "single",
      question: "Which layer in OSI provides logical addressing?",
      options: ["Data Link", "Network", "Transport", "Session"],
      answer: "Network",
    },
    {
      type: "single",
      question: "Which OSI layer provides encryption and compression?",
      options: ["Application", "Presentation", "Session", "Transport"],
      answer: "Presentation",
    },
    {
      type: "single",
      question:
        "Which OSI layer establishes, maintains, and terminates connections?",
      options: ["Transport", "Session", "Presentation", "Data Link"],
      answer: "Session",
    },
    {
      type: "single",
      question: "What unit of data is transmitted at the Data Link layer?",
      options: ["Bit", "Frame", "Packet", "Segment"],
      answer: "Frame",
    },
    {
      type: "single",
      question: "What unit of data is transmitted at the Network layer?",
      options: ["Bit", "Frame", "Packet", "Segment"],
      answer: "Packet",
    },
    {
      type: "single",
      question:
        "What unit of data is transmitted at the Transport layer (TCP)?",
      options: ["Bit", "Frame", "Packet", "Segment"],
      answer: "Segment",
    },
    {
      type: "single",
      question: "Which of the following is an internal routing protocol?",
      options: ["BGP", "OSPF", "ARP", "DNS"],
      answer: "OSPF",
    },
    {
      type: "single",
      question: "Which protocol is an exterior gateway protocol?",
      options: ["RIP", "EIGRP", "OSPF", "BGP"],
      answer: "BGP",
    },
    {
      type: "single",
      question: "Which topology uses a central hub or switch?",
      options: ["Bus", "Ring", "Star", "Mesh"],
      answer: "Star",
    },
    {
      type: "single",
      question: "Which network type spans across cities or countries?",
      options: ["LAN", "PAN", "MAN", "WAN"],
      answer: "WAN",
    },
    {
      type: "single",
      question: "What is the loopback IPv4 address?",
      options: ["192.168.1.1", "127.0.0.1", "10.0.0.1", "255.255.255.255"],
      answer: "127.0.0.1",
    },
    {
      type: "single",
      question: "Which class of IP address is used for multicast?",
      options: ["Class A", "Class B", "Class C", "Class D"],
      answer: "Class D",
    },
    {
      type: "single",
      question: "Which device amplifies or regenerates the network signal?",
      options: ["Switch", "Router", "Repeater", "Bridge"],
      answer: "Repeater",
    },
    {
      type: "single",
      question: "At which layer does a Hub operate?",
      options: ["Physical", "Data Link", "Network", "Transport"],
      answer: "Physical",
    },
    {
      type: "single",
      question: "What is a major advantage of a Mesh topology?",
      options: ["Low cost", "Ease of setup", "Redundancy", "Uses less cable"],
      answer: "Redundancy",
    },
    {
      type: "single",
      question: "Which IEEE standard defines Wi-Fi?",
      options: ["802.3", "802.11", "802.15", "802.1Q"],
      answer: "802.11",
    },
    {
      type: "single",
      question: "Which IEEE standard defines Ethernet?",
      options: ["802.11", "802.15", "802.3", "802.5"],
      answer: "802.3",
    },
    {
      type: "single",
      question: "What does CSMA/CD stand for?",
      options: [
        "Carrier Sense Multiple Access with Collision Detection",
        "Carrier Signal Multi Access with Collision Detection",
        "Carrier Sense Multiple Access with Connection Detection",
        "Code Sense Multiple Access with Collision Detection",
      ],
      answer: "Carrier Sense Multiple Access with Collision Detection",
    },
    {
      type: "single",
      question: "Which access method is used in Ethernet networks?",
      options: ["CSMA/CA", "CSMA/CD", "Token Passing", "Polling"],
      answer: "CSMA/CD",
    },
    {
      type: "single",
      question: "Which access method is used in Wi-Fi networks?",
      options: ["CSMA/CD", "CSMA/CA", "Token Ring", "ALOHA"],
      answer: "CSMA/CA",
    },
    {
      type: "single",
      question: "What does VPN stand for?",
      options: [
        "Virtual Public Network",
        "Virtual Private Network",
        "Visual Private Network",
        "Variable Private Network",
      ],
      answer: "Virtual Private Network",
    },
    {
      type: "single",
      question: "Which protocol provides secure file transfer over SSH?",
      options: ["FTP", "TFTP", "SFTP", "SNMP"],
      answer: "SFTP",
    },
    {
      type: "single",
      question: "What port does TFTP use?",
      options: ["20", "21", "69", "161"],
      answer: "69",
    },
    {
      type: "single",
      question: "Which protocol is used for network management and monitoring?",
      options: ["SMTP", "SNMP", "ICMP", "IGMP"],
      answer: "SNMP",
    },
    {
      type: "single",
      question: "What port does SNMP use by default?",
      options: ["25", "110", "143", "161"],
      answer: "161",
    },
    {
      type: "single",
      question:
        "Which IP address range represents Class A private IP addresses?",
      options: [
        "10.0.0.0 - 10.255.255.255",
        "172.16.0.0 - 172.31.255.255",
        "192.168.0.0 - 192.168.255.255",
        "169.254.0.0 - 169.254.255.255",
      ],
      answer: "10.0.0.0 - 10.255.255.255",
    },
    {
      type: "single",
      question: "What does APIPA stand for?",
      options: [
        "Automatic Private IP Addressing",
        "Automatic Public IP Addressing",
        "Assigned Private IP Allocation",
        "Available Public IP Allocation",
      ],
      answer: "Automatic Private IP Addressing",
    },
    {
      type: "single",
      question: "Which of these is an APIPA address?",
      options: ["10.0.0.5", "172.16.0.1", "169.254.1.1", "192.168.1.10"],
      answer: "169.254.1.1",
    },
    {
      type: "single",
      question:
        "What is the process of hiding private IP addresses behind a single public IP address called?",
      options: ["Routing", "Switching", "NAT", "Subnetting"],
      answer: "NAT",
    },
    {
      type: "single",
      question: "What is the broadcast address for the subnet 192.168.1.0/24?",
      options: [
        "192.168.1.1",
        "192.168.1.254",
        "192.168.1.255",
        "192.168.255.255",
      ],
      answer: "192.168.1.255",
    },
    {
      type: "single",
      question: "How many usable host IP addresses are in a /24 subnet?",
      options: ["256", "255", "254", "128"],
      answer: "254",
    },
    {
      type: "single",
      question:
        "Which command displays the IP address configuration in Windows?",
      options: ["ifconfig", "ipconfig", "ping", "netstat"],
      answer: "ipconfig",
    },
    {
      type: "single",
      question:
        "Which command displays the IP address configuration in Linux/Unix?",
      options: ["ipconfig", "ifconfig", "traceroute", "nslookup"],
      answer: "ifconfig",
    },
    {
      type: "single",
      question: "Which tool traces the path a packet takes to its destination?",
      options: ["Ping", "Nslookup", "Traceroute", "Ifconfig"],
      answer: "Traceroute",
    },
    {
      type: "single",
      question: "What is the transport layer data unit for UDP?",
      options: ["Segment", "Datagram", "Packet", "Frame"],
      answer: "Datagram",
    },
    {
      type: "single",
      question: "What feature does TCP provide that UDP does not?",
      options: [
        "Port addressing",
        "Checksums",
        "Guaranteed delivery",
        "Fast transmission",
      ],
      answer: "Guaranteed delivery",
    },
    {
      type: "single",
      question: "What is the three-way handshake primarily used for?",
      options: [
        "Terminating a connection",
        "Establishing a TCP connection",
        "Error checking",
        "Flow control",
      ],
      answer: "Establishing a TCP connection",
    },
    {
      type: "single",
      question: "Which flag is used to initiate a TCP connection?",
      options: ["ACK", "FIN", "SYN", "RST"],
      answer: "SYN",
    },
    {
      type: "single",
      question: "Which flag is used to forcefully terminate a TCP connection?",
      options: ["SYN", "ACK", "FIN", "RST"],
      answer: "RST",
    },
    {
      type: "single",
      question: "What does TTL stand for in networking?",
      options: [
        "Time To Live",
        "Time To Leave",
        "Transfer Time Limit",
        "Total Transmission Length",
      ],
      answer: "Time To Live",
    },
    {
      type: "single",
      question: "What happens when a packet's TTL reaches 0?",
      options: [
        "It is forwarded",
        "It is dropped",
        "It is returned to sender",
        "It is broadcasted",
      ],
      answer: "It is dropped",
    },
    {
      type: "single",
      question: "Which protocol uses distance-vector routing?",
      options: ["OSPF", "BGP", "RIP", "IS-IS"],
      answer: "RIP",
    },
    {
      type: "single",
      question: "Which routing protocol uses link-state routing?",
      options: ["RIP", "OSPF", "EIGRP", "BGP"],
      answer: "OSPF",
    },
    {
      type: "single",
      question: "Which algorithm is used by link-state routing protocols?",
      options: ["Bellman-Ford", "Dijkstra", "RSA", "Diffie-Hellman"],
      answer: "Dijkstra",
    },
    {
      type: "single",
      question: "Which algorithm is used by distance-vector routing protocols?",
      options: ["Dijkstra", "Bellman-Ford", "Kruskal", "Prim"],
      answer: "Bellman-Ford",
    },
    {
      type: "single",
      question: "What does HTTP stand for?",
      options: [
        "HyperText Transfer Protocol",
        "HyperText Transmission Protocol",
        "HyperLink Transfer Protocol",
        "HighText Transfer Protocol",
      ],
      answer: "HyperText Transfer Protocol",
    },
    {
      type: "single",
      question: "Which protocol is used for securely browsing the web?",
      options: ["HTTP", "HTTPS", "FTP", "SSH"],
      answer: "HTTPS",
    },
    {
      type: "single",
      question:
        "Which wireless encryption standard is considered the most secure currently?",
      options: ["WEP", "WPA", "WPA2", "WPA3"],
      answer: "WPA3",
    },
    {
      type: "single",
      question: "What is the primary function of a firewall?",
      options: [
        "Speed up internet",
        "Filter network traffic",
        "Assign IP addresses",
        "Host websites",
      ],
      answer: "Filter network traffic",
    },
    {
      type: "single",
      question:
        "Which type of firewall inspects the state of active connections?",
      options: [
        "Packet-filtering",
        "Stateful inspection",
        "Proxy",
        "Application-level",
      ],
      answer: "Stateful inspection",
    },
    {
      type: "single",
      question: "What is the main advantage of fiber optic cables?",
      options: [
        "Low cost",
        "High immunity to EMI",
        "Easy to install",
        "Flexibility",
      ],
      answer: "High immunity to EMI",
    },
    {
      type: "single",
      question:
        "Which connector is typically used with Unshielded Twisted Pair (UTP) cables?",
      options: ["BNC", "ST", "RJ-45", "SC"],
      answer: "RJ-45",
    },
    {
      type: "single",
      question: "Which layer is responsible for error detection like CRC?",
      options: ["Application", "Data Link", "Session", "Network"],
      answer: "Data Link",
    },
    {
      type: "single",
      question: "What is multiplexing?",
      options: [
        "Sending one signal over many lines",
        "Combining multiple signals into one medium",
        "Splitting a network into subnets",
        "Encrypting a data stream",
      ],
      answer: "Combining multiple signals into one medium",
    },
    {
      type: "single",
      question:
        "Which technique is used to increase the capacity of a fiber optic cable?",
      options: ["TDM", "FDM", "WDM", "CDMA"],
      answer: "WDM",
    },
    {
      type: "single",
      question: "What is the metric used by RIP to determine the best path?",
      options: ["Bandwidth", "Delay", "Hop count", "Load"],
      answer: "Hop count",
    },
    {
      type: "single",
      question: "What is the maximum hop count allowed in RIP?",
      options: ["10", "15", "16", "255"],
      answer: "15",
    },
    {
      type: "single",
      question: "Which technology creates a virtual LAN to segment a network?",
      options: ["VPN", "NAT", "VLAN", "STP"],
      answer: "VLAN",
    },
    {
      type: "single",
      question: "What protocol prevents network loops in Ethernet networks?",
      options: ["ARP", "STP", "OSPF", "RIP"],
      answer: "STP",
    },
    {
      type: "single",
      question: "What does STP stand for in networking?",
      options: [
        "Standard Transmission Protocol",
        "Spanning Tree Protocol",
        "Secure Transfer Protocol",
        "Shielded Twisted Pair",
      ],
      answer: "Spanning Tree Protocol",
    },
    {
      type: "single",
      question:
        "Which organization is responsible for IP address space allocation globally?",
      options: ["IEEE", "IETF", "ICANN/IANA", "W3C"],
      answer: "ICANN/IANA",
    },
    {
      type: "single",
      question: "What is the PDU for the physical layer?",
      options: ["Bit", "Frame", "Packet", "Segment"],
      answer: "Bit",
    },
    {
      type: "single",
      question:
        "What feature does an unmanaged switch lack compared to a managed switch?",
      options: [
        "MAC address table",
        "VLAN configuration",
        "Port density",
        "Forwarding frames",
      ],
      answer: "VLAN configuration",
    },
    {
      type: "single",
      question: "In IPv6, what is used instead of ARP?",
      options: ["RARP", "NDP", "DHCPv6", "ICMPv6"],
      answer: "NDP",
    },
    {
      type: "single",
      question: "Which part of the IP address indicates the network portion?",
      options: ["Subnet Mask", "MAC Address", "Host ID", "Port Number"],
      answer: "Subnet Mask",
    },
    {
      type: "single",
      question: "What is a characteristic of a half-duplex connection?",
      options: [
        "Both sides transmit simultaneously",
        "Only one side can transmit at a time",
        "No transmission is possible",
        "Used only in fiber optics",
      ],
      answer: "Only one side can transmit at a time",
    },
    {
      type: "single",
      question: "Which of these is a full-duplex communication?",
      options: [
        "Walkie-talkie",
        "Telephone call",
        "Television broadcast",
        "Radio broadcast",
      ],
      answer: "Telephone call",
    },
    {
      type: "single",
      question: "What is the size of the TCP header at minimum?",
      options: ["8 bytes", "16 bytes", "20 bytes", "32 bytes"],
      answer: "20 bytes",
    },
    {
      type: "single",
      question: "What is the size of the UDP header?",
      options: ["4 bytes", "8 bytes", "16 bytes", "20 bytes"],
      answer: "8 bytes",
    },
    {
      type: "single",
      question:
        "Which protocol retrieves email from a mail server but leaves a copy on the server?",
      options: ["SMTP", "POP3", "IMAP", "FTP"],
      answer: "IMAP",
    },
    {
      type: "single",
      question: "What does QoS stand for in networking?",
      options: [
        "Quality of Service",
        "Quantity of Service",
        "Quality of Systems",
        "Quick Online Service",
      ],
      answer: "Quality of Service",
    },
    {
      type: "single",
      question: "What port does BGP use?",
      options: ["TCP 179", "UDP 520", "TCP 89", "UDP 179"],
      answer: "TCP 179",
    },
    {
      type: "single",
      question: "What is a 'botnet'?",
      options: [
        "A network of infected devices controlled remotely",
        "A subnet for robots",
        "A legitimate search engine network",
        "A firewall configuration tool",
      ],
      answer: "A network of infected devices controlled remotely",
    },
    {
      type: "single",
      question:
        "What type of attack involves overwhelming a server with traffic?",
      options: ["Phishing", "Man-in-the-Middle", "DDoS", "SQL Injection"],
      answer: "DDoS",
    },
    {
      type: "multi",
      question: "Which of the following operate at the Data Link Layer?",
      options: ["Switch", "Router", "Bridge", "Hub"],
      answer: "Switch, Bridge",
    },
    {
      type: "multi",
      question:
        "Which of the following are protocols used in the Application Layer?",
      options: ["HTTP", "TCP", "FTP", "SMTP"],
      answer: "HTTP, FTP, SMTP",
    },
    {
      type: "multi",
      question: "Which of these are Transport Layer protocols?",
      options: ["TCP", "IP", "UDP", "ICMP"],
      answer: "TCP, UDP",
    },
    {
      type: "multi",
      question: "Which of the following are types of network topologies?",
      options: ["Star", "Mesh", "Square", "Ring"],
      answer: "Star, Mesh, Ring",
    },
    {
      type: "multi",
      question: "Which of the following are valid IPv4 classes?",
      options: ["Class A", "Class B", "Class F", "Class G"],
      answer: "Class A, Class B",
    },
    {
      type: "multi",
      question: "Which of these are Private IP address ranges?",
      options: ["10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16", "8.8.8.8/32"],
      answer: "10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16",
    },
    {
      type: "multi",
      question: "Which protocols are used for sending/receiving email?",
      options: ["SMTP", "POP3", "IMAP", "SNMP"],
      answer: "SMTP, POP3, IMAP",
    },
    {
      type: "multi",
      question: "Which of the following are characteristics of TCP?",
      options: [
        "Connection-oriented",
        "Connectionless",
        "Reliable delivery",
        "No acknowledgment",
      ],
      answer: "Connection-oriented, Reliable delivery",
    },
    {
      type: "multi",
      question: "Which of the following are characteristics of UDP?",
      options: ["Fast", "Connectionless", "Reliable", "Guaranteed delivery"],
      answer: "Fast, Connectionless",
    },
    {
      type: "multi",
      question: "Which of these devices can segment a collision domain?",
      options: ["Hub", "Switch", "Router", "Bridge"],
      answer: "Switch, Router, Bridge",
    },
    {
      type: "multi",
      question: "Which of these devices can segment a broadcast domain?",
      options: ["Switch", "Router", "Layer 3 Switch", "Hub"],
      answer: "Router, Layer 3 Switch",
    },
    {
      type: "multi",
      question: "Which algorithms are used for routing?",
      options: ["Dijkstra's", "Bellman-Ford", "RSA", "AES"],
      answer: "Dijkstra's, Bellman-Ford",
    },
    {
      type: "multi",
      question: "Which of these are interior gateway protocols (IGP)?",
      options: ["OSPF", "RIP", "EIGRP", "BGP"],
      answer: "OSPF, RIP, EIGRP",
    },
    {
      type: "multi",
      question: "Which flags exist in a TCP header?",
      options: ["SYN", "ACK", "FIN", "RST"],
      answer: "SYN, ACK, FIN, RST",
    },
    {
      type: "multi",
      question: "Which of the following use UDP by default?",
      options: ["DNS", "DHCP", "HTTP", "TFTP"],
      answer: "DNS, DHCP, TFTP",
    },
    {
      type: "multi",
      question:
        "Which of the following are valid MAC addresses format elements?",
      options: [
        "Hexadecimal characters",
        "48 bits long",
        "32 bits long",
        "Separated by colons or hyphens",
      ],
      answer:
        "Hexadecimal characters, 48 bits long, Separated by colons or hyphens",
    },
    {
      type: "multi",
      question: "Which of the following are components of a URL?",
      options: ["Protocol", "Domain name", "MAC address", "Path"],
      answer: "Protocol, Domain name, Path",
    },
    {
      type: "multi",
      question:
        "Which layers of the OSI model make up the TCP/IP Application layer?",
      options: ["Application", "Presentation", "Session", "Transport"],
      answer: "Application, Presentation, Session",
    },
    {
      type: "multi",
      question: "Which of these are unguided media?",
      options: ["Fiber optic", "Microwaves", "Radio waves", "Coaxial cable"],
      answer: "Microwaves, Radio waves",
    },
    {
      type: "multi",
      question: "Which of these are guided (wired) transmission media?",
      options: ["Coaxial cable", "Twisted pair", "Fiber optic", "Infrared"],
      answer: "Coaxial cable, Twisted pair, Fiber optic",
    },
    {
      type: "multi",
      question: "Which fields are present in an IPv4 header?",
      options: ["TTL", "Source IP", "Source MAC", "Checksum"],
      answer: "TTL, Source IP, Checksum",
    },
    {
      type: "multi",
      question: "Which fields are present in an Ethernet frame?",
      options: ["Preamble", "Source MAC", "Payload", "Source IP"],
      answer: "Preamble, Source MAC, Payload",
    },
    {
      type: "multi",
      question:
        "Which of the following are common wireless security protocols?",
      options: ["WEP", "WPA2", "IPsec", "WPA3"],
      answer: "WEP, WPA2, WPA3",
    },
    {
      type: "multi",
      question: "Which of these are considered Network layer protocols?",
      options: ["IP", "ICMP", "IGMP", "TCP"],
      answer: "IP, ICMP, IGMP",
    },
    {
      type: "multi",
      question: "Which functions does the Data Link layer provide?",
      options: [
        "Framing",
        "Error detection",
        "Physical addressing",
        "Logical addressing",
      ],
      answer: "Framing, Error detection, Physical addressing",
    },
    {
      type: "multi",
      question:
        "Which tools can be used to resolve domain names to IP addresses?",
      options: ["nslookup", "dig", "ping", "tracert"],
      answer: "nslookup, dig",
    },
    {
      type: "multi",
      question: "Which commands can be used to view open ports on a system?",
      options: ["netstat", "ss", "ifconfig", "ping"],
      answer: "netstat, ss",
    },
    {
      type: "multi",
      question: "Which of the following are forms of NAT?",
      options: [
        "Static NAT",
        "Dynamic NAT",
        "PAT (Port Address Translation)",
        "MAC NAT",
      ],
      answer: "Static NAT, Dynamic NAT, PAT (Port Address Translation)",
    },
    {
      type: "multi",
      question: "Which of the following use Port 80 or 443?",
      options: ["HTTP", "HTTPS", "Web traffic", "SSH"],
      answer: "HTTP, HTTPS, Web traffic",
    },
    {
      type: "multi",
      question: "Which phases are part of the DHCP DORA process?",
      options: ["Discover", "Offer", "Request", "Acknowledge"],
      answer: "Discover, Offer, Request, Acknowledge",
    },
    {
      type: "multi",
      question:
        "Which of these are examples of wide area network (WAN) technologies?",
      options: ["Frame Relay", "Ethernet", "MPLS", "Wi-Fi"],
      answer: "Frame Relay, MPLS",
    },
    {
      type: "multi",
      question: "Which statements are true about IPv6?",
      options: [
        "Uses 128-bit addresses",
        "Uses hexadecimal notation",
        "Requires NAT for internet access",
        "Has built-in IPsec",
      ],
      answer:
        "Uses 128-bit addresses, Uses hexadecimal notation, Has built-in IPsec",
    },
    {
      type: "multi",
      question: "Which of the following are common types of VPNs?",
      options: [
        "Site-to-Site",
        "Remote Access",
        "Local Access",
        "Host-to-Host",
      ],
      answer: "Site-to-Site, Remote Access",
    },
    {
      type: "multi",
      question: "Which are symptoms of network congestion?",
      options: ["Packet loss", "High latency", "Jitter", "Increased bandwidth"],
      answer: "Packet loss, High latency, Jitter",
    },
    {
      type: "multi",
      question:
        "Which of these methods are used for congestion control in TCP?",
      options: [
        "Slow Start",
        "Congestion Avoidance",
        "Fast Retransmit",
        "Token Bucket",
      ],
      answer: "Slow Start, Congestion Avoidance, Fast Retransmit",
    },
    {
      type: "multi",
      question: "Which of the following are multiplexing techniques?",
      options: ["TDM", "FDM", "WDM", "CSMA"],
      answer: "TDM, FDM, WDM",
    },
    {
      type: "multi",
      question:
        "Which of these are valid port states in STP (Spanning Tree Protocol)?",
      options: ["Blocking", "Listening", "Learning", "Forwarding"],
      answer: "Blocking, Listening, Learning, Forwarding",
    },
    {
      type: "multi",
      question: "Which of the following are types of DNS records?",
      options: ["A record", "MX record", "CNAME record", "MAC record"],
      answer: "A record, MX record, CNAME record",
    },
    {
      type: "multi",
      question: "Which IP addresses are reserved for special purposes?",
      options: ["127.0.0.1", "255.255.255.255", "8.8.8.8", "169.254.x.x"],
      answer: "127.0.0.1, 255.255.255.255, 169.254.x.x",
    },
    {
      type: "multi",
      question: "Which network devices operate at Layer 1 of the OSI model?",
      options: ["Hub", "Repeater", "Cable", "Switch"],
      answer: "Hub, Repeater, Cable",
    },
    {
      type: "multi",
      question: "Which of the following define a socket in TCP/IP?",
      options: [
        "IP Address",
        "Port Number",
        "MAC Address",
        "Protocol (TCP/UDP)",
      ],
      answer: "IP Address, Port Number, Protocol (TCP/UDP)",
    },
    {
      type: "multi",
      question: "Which of these are types of cast in IPv4?",
      options: ["Unicast", "Multicast", "Broadcast", "Anycast"],
      answer: "Unicast, Multicast, Broadcast",
    },
    {
      type: "multi",
      question: "Which of these are advantages of using VLANs?",
      options: [
        "Security",
        "Broadcast control",
        "Increased physical cabling",
        "Flexibility",
      ],
      answer: "Security, Broadcast control, Flexibility",
    },
    {
      type: "multi",
      question: "Which are characteristics of a client-server architecture?",
      options: [
        "Centralized control",
        "Clients request services",
        "Servers provide services",
        "Every node acts as a server",
      ],
      answer:
        "Centralized control, Clients request services, Servers provide services",
    },
    {
      type: "multi",
      question: "Which of the following protocols operate over TCP?",
      options: ["HTTP", "FTP", "SMTP", "TFTP"],
      answer: "HTTP, FTP, SMTP",
    },
    {
      type: "multi",
      question: "Which of the following protocols operate over UDP?",
      options: ["DHCP", "TFTP", "SNMP", "SSH"],
      answer: "DHCP, TFTP, SNMP",
    },
    {
      type: "multi",
      question: "Which fields are used in an IPv6 header?",
      options: ["Version", "Traffic Class", "Hop Limit", "Header Checksum"],
      answer: "Version, Traffic Class, Hop Limit",
    },
    {
      type: "multi",
      question: "Which are characteristics of fiber optic cables?",
      options: [
        "Uses light to transmit data",
        "Susceptible to EMI",
        "High bandwidth",
        "Long distance transmission",
      ],
      answer:
        "Uses light to transmit data, High bandwidth, Long distance transmission",
    },
    {
      type: "multi",
      question: "Which of the following can cause signal degradation?",
      options: ["Attenuation", "Distortion", "Noise", "Amplification"],
      answer: "Attenuation, Distortion, Noise",
    },
    {
      type: "multi",
      question: "Which are valid categories of twisted pair cables?",
      options: ["Cat 5e", "Cat 6", "Cat 7", "Cat Fiber"],
      answer: "Cat 5e, Cat 6, Cat 7",
    },
    {
      type: "fill",
      question:
        "The ______ layer of the OSI model is responsible for routing packets.",
      answer: "Network",
    },
    {
      type: "fill",
      question:
        "The ______ protocol translates domain names into IP addresses.",
      answer: "DNS",
    },
    {
      type: "fill",
      question: "The abbreviation HTTP stands for HyperText ______ Protocol.",
      answer: "Transfer",
    },
    {
      type: "fill",
      question: "Port ______ is typically used for secure web traffic (HTTPS).",
      answer: "443",
    },
    {
      type: "fill",
      question:
        "Port ______ is typically used for standard web traffic (HTTP).",
      answer: "80",
    },
    {
      type: "fill",
      question:
        "The protocol used to dynamically assign IP addresses to devices is ______.",
      answer: "DHCP",
    },
    {
      type: "fill",
      question: "A MAC address is ______ bits long.",
      answer: "48",
    },
    {
      type: "fill",
      question: "An IPv4 address is ______ bits long.",
      answer: "32",
    },
    {
      type: "fill",
      question: "An IPv6 address is ______ bits long.",
      answer: "128",
    },
    {
      type: "fill",
      question:
        "The protocol used to find the MAC address from a known IP address is ______.",
      answer: "ARP",
    },
    {
      type: "fill",
      question: "The ______ address 127.0.0.1 is used for loopback testing.",
      answer: "IP",
    },
    {
      type: "fill",
      question:
        "A network device that forwards data based on MAC addresses is a ______.",
      answer: "Switch",
    },
    {
      type: "fill",
      question:
        "A network device that forwards data based on IP addresses is a ______.",
      answer: "Router",
    },
    {
      type: "fill",
      question: "The connection-oriented transport layer protocol is ______.",
      answer: "TCP",
    },
    {
      type: "fill",
      question: "The connectionless transport layer protocol is ______.",
      answer: "UDP",
    },
    {
      type: "fill",
      question:
        "The PDU (Protocol Data Unit) at the Data Link layer is called a ______.",
      answer: "Frame",
    },
    {
      type: "fill",
      question:
        "The PDU (Protocol Data Unit) at the Network layer is called a ______.",
      answer: "Packet",
    },
    {
      type: "fill",
      question: "The OSI model consists of ______ layers.",
      answer: "7",
    },
    {
      type: "fill",
      question:
        "The ______ topology connects all devices to a single central cable.",
      answer: "Bus",
    },
    {
      type: "fill",
      question:
        "The ______ topology connects all devices to a central switch or hub.",
      answer: "Star",
    },
    {
      type: "fill",
      question:
        "The ______ layer ensures reliable data delivery and handles error recovery.",
      answer: "Transport",
    },
    {
      type: "fill",
      question:
        "The command line tool used to check network connectivity to a host is ______.",
      answer: "ping",
    },
    {
      type: "fill",
      question: "The acronym LAN stands for ______ Area Network.",
      answer: "Local",
    },
    {
      type: "fill",
      question: "The acronym WAN stands for ______ Area Network.",
      answer: "Wide",
    },
    {
      type: "fill",
      question:
        "The command line tool used to view the path packets take to a destination is ______.",
      answer: "traceroute",
    },
    {
      type: "fill",
      question: "The default subnet mask for a Class C IP address is ______.",
      answer: "255.255.255.0",
    },
    {
      type: "fill",
      question:
        "The protocol used to securely access remote servers via terminal is ______.",
      answer: "SSH",
    },
    {
      type: "fill",
      question: "Port 25 is used by the ______ protocol for sending emails.",
      answer: "SMTP",
    },
    {
      type: "fill",
      question:
        "The feature that translates private IP addresses to public ones is ______.",
      answer: "NAT",
    },
    {
      type: "fill",
      question:
        "The ______ layer of OSI handles formatting, encrypting, and compressing data.",
      answer: "Presentation",
    },
    {
      type: "fill",
      question:
        "The ______ layer of OSI establishes, manages, and terminates sessions.",
      answer: "Session",
    },
    {
      type: "fill",
      question:
        "A network security system that monitors and controls incoming and outgoing traffic is a ______.",
      answer: "Firewall",
    },
    {
      type: "fill",
      question: "The acronym VPN stands for Virtual ______ Network.",
      answer: "Private",
    },
    {
      type: "fill",
      question: "The ______ protocol operates over port 21.",
      answer: "FTP",
    },
    {
      type: "fill",
      question:
        "A logically segmented network created within a physical switch is called a ______.",
      answer: "VLAN",
    },
    {
      type: "fill",
      question:
        "The protocol that prevents looping in Ethernet networks is ______.",
      answer: "STP",
    },
    {
      type: "fill",
      question:
        "The algorithm commonly used by link-state routing protocols like OSPF is ______.",
      answer: "Dijkstra",
    },
    {
      type: "fill",
      question:
        "The distance-vector routing protocol that uses hop count as a metric is ______.",
      answer: "RIP",
    },
    {
      type: "fill",
      question:
        "The ______ field in an IP header prevents a packet from circulating indefinitely.",
      answer: "TTL",
    },
    {
      type: "fill",
      question:
        "The acronym MAC in MAC address stands for Media Access ______.",
      answer: "Control",
    },
    {
      type: "fill",
      question:
        "The acronym CSMA/CD stands for Carrier Sense Multiple Access with Collision .",
      answer: "Detection",
    },
    {
      type: "fill",
      question:
        "Wi-Fi networks primarily use the CSMA/ method for channel access.",
      answer: "CA",
    },
    {
      type: "fill",
      question: "Fiber optic cables use ______ to transmit data.",
      answer: "Light",
    },
    {
      type: "fill",
      question: "The most secure current Wi-Fi encryption standard is ______.",
      answer: "WPA3",
    },
    {
      type: "fill",
      question:
        "A ______ attack overloads a server with traffic from multiple sources.",
      answer: "DDoS",
    },
    {
      type: "fill",
      question:
        "The interior gateway protocol that uses bandwidth and delay as metrics is ______.",
      answer: "EIGRP",
    },
    {
      type: "fill",
      question:
        "The protocol used to manage and monitor network devices is ______.",
      answer: "SNMP",
    },
    {
      type: "fill",
      question: "The IP address 255.255.255.255 is used for network-wide .",
      answer: "Broadcast",
    },
    {
      type: "fill",
      question:
        "A connection where data can flow in both directions simultaneously is called full-.",
      answer: "duplex",
    },
    {
      type: "fill",
      question:
        "The ______ address specifies a process or application on a host.",
      answer: "Port",
    },
  ],
  machinelearning: [
    {
      type: "single",
      question: "Which of the following is a supervised learning algorithm?",
      options: ["K-Means", "PCA", "Support Vector Machine", "Apriori"],
      answer: "Support Vector Machine",
    },
    {
      type: "single",
      question: "What is the primary goal of regression algorithms?",
      options: [
        "Predict categorical labels",
        "Predict continuous values",
        "Group similar data points",
        "Reduce dimensionality",
      ],
      answer: "Predict continuous values",
    },
    {
      type: "single",
      question: "Which algorithm is commonly used for binary classification?",
      options: ["Linear Regression", "Logistic Regression", "K-Means", "PCA"],
      answer: "Logistic Regression",
    },
    {
      type: "single",
      question: "What does SVM stand for in machine learning?",
      options: [
        "Simple Vector Machine",
        "Support Vector Machine",
        "Standard Vector Model",
        "Supervised Vector Machine",
      ],
      answer: "Support Vector Machine",
    },
    {
      type: "single",
      question:
        "Which metric is best for evaluating an imbalanced classification dataset?",
      options: ["Accuracy", "Mean Squared Error", "F1-Score", "R-squared"],
      answer: "F1-Score",
    },
    {
      type: "single",
      question: "What is the purpose of the loss function?",
      options: [
        "To increase training speed",
        "To measure the error of the model",
        "To initialize weights",
        "To activate neurons",
      ],
      answer: "To measure the error of the model",
    },
    {
      type: "single",
      question: "Which algorithm builds a forest of decision trees?",
      options: ["AdaBoost", "Random Forest", "Gradient Boosting", "XGBoost"],
      answer: "Random Forest",
    },
    {
      type: "single",
      question: "What is overfitting in machine learning?",
      options: [
        "Model performs well on test data but poorly on training data",
        "Model performs well on training data but poorly on unseen data",
        "Model performs poorly on both training and test data",
        "Model trains too fast",
      ],
      answer: "Model performs well on training data but poorly on unseen data",
    },
    {
      type: "single",
      question: "Which technique is used to prevent overfitting?",
      options: [
        "Increasing model complexity",
        "Regularization",
        "Removing dropout layers",
        "Using less training data",
      ],
      answer: "Regularization",
    },
    {
      type: "single",
      question: "What does PCA do?",
      options: [
        "Classifies images",
        "Reduces dimensionality",
        "Clusters data",
        "Generates text",
      ],
      answer: "Reduces dimensionality",
    },
    {
      type: "single",
      question:
        "Which algorithm uses the 'k' nearest neighbors to make predictions?",
      options: ["K-Means", "KNN", "SVM", "Decision Tree"],
      answer: "KNN",
    },
    {
      type: "single",
      question: "In K-Means clustering, what does 'K' represent?",
      options: [
        "Number of features",
        "Number of iterations",
        "Number of clusters",
        "Learning rate",
      ],
      answer: "Number of clusters",
    },
    {
      type: "single",
      question:
        "Which gradient descent variant updates weights after every single training example?",
      options: [
        "Batch Gradient Descent",
        "Mini-batch Gradient Descent",
        "Stochastic Gradient Descent",
        "Momentum",
      ],
      answer: "Stochastic Gradient Descent",
    },
    {
      type: "single",
      question: "What does a confusion matrix evaluate?",
      options: [
        "Regression models",
        "Classification models",
        "Clustering models",
        "Dimensionality reduction",
      ],
      answer: "Classification models",
    },
    {
      type: "single",
      question:
        "What is the range of output for a standard Sigmoid activation function?",
      options: ["-1 to 1", "0 to 1", "-infinity to infinity", "0 to infinity"],
      answer: "0 to 1",
    },
    {
      type: "single",
      question:
        "Which activation function outputs zero for negative inputs and the input itself for positive inputs?",
      options: ["Sigmoid", "Tanh", "ReLU", "Softmax"],
      answer: "ReLU",
    },
    {
      type: "single",
      question:
        "Which neural network architecture is best suited for image recognition?",
      options: ["RNN", "CNN", "LSTM", "Autoencoder"],
      answer: "CNN",
    },
    {
      type: "single",
      question:
        "Which neural network architecture is best suited for sequential data like text or time series?",
      options: ["CNN", "RNN", "MLP", "GAN"],
      answer: "RNN",
    },
    {
      type: "single",
      question:
        "What is the process of updating neural network weights based on the loss gradient called?",
      options: [
        "Forward propagation",
        "Backpropagation",
        "Epoch",
        "Activation",
      ],
      answer: "Backpropagation",
    },
    {
      type: "single",
      question: "Which algorithm is based on Bayes' Theorem?",
      options: ["Decision Tree", "Random Forest", "Naive Bayes", "SVM"],
      answer: "Naive Bayes",
    },
    {
      type: "single",
      question: "What is a hyperparameter?",
      options: [
        "A parameter learned during training",
        "A parameter set before the learning process begins",
        "A feature in the dataset",
        "The final output of the model",
      ],
      answer: "A parameter set before the learning process begins",
    },
    {
      type: "single",
      question:
        "Which metric represents the ratio of correctly predicted positive observations to the total predicted positives?",
      options: ["Recall", "Accuracy", "Precision", "F1-Score"],
      answer: "Precision",
    },
    {
      type: "single",
      question:
        "Which metric represents the ratio of correctly predicted positive observations to the all observations in actual class?",
      options: ["Precision", "Accuracy", "Recall", "F1-Score"],
      answer: "Recall",
    },
    {
      type: "single",
      question: "What does ROC stand for in ROC Curve?",
      options: [
        "Receiver Operating Characteristic",
        "Relative Output Curve",
        "Region Of Classification",
        "Regression Operator Curve",
      ],
      answer: "Receiver Operating Characteristic",
    },
    {
      type: "single",
      question: "Which of the following is an unsupervised learning algorithm?",
      options: [
        "Linear Regression",
        "Logistic Regression",
        "K-Means",
        "Decision Tree",
      ],
      answer: "K-Means",
    },
    {
      type: "single",
      question:
        "What is the term for combining multiple models to improve performance?",
      options: [
        "Clustering",
        "Ensemble Learning",
        "Dimensionality Reduction",
        "Deep Learning",
      ],
      answer: "Ensemble Learning",
    },
    {
      type: "single",
      question:
        "Which ensemble method trains models sequentially, correcting the errors of the previous ones?",
      options: ["Bagging", "Boosting", "Stacking", "Voting"],
      answer: "Boosting",
    },
    {
      type: "single",
      question: "Random Forest is an example of which ensemble technique?",
      options: ["Boosting", "Stacking", "Bagging", "Cascading"],
      answer: "Bagging",
    },
    {
      type: "single",
      question: "What is a major problem associated with Decision Trees?",
      options: [
        "They cannot handle categorical data",
        "They are prone to overfitting",
        "They require feature scaling",
        "They cannot be visualized",
      ],
      answer: "They are prone to overfitting",
    },
    {
      type: "single",
      question:
        "Which function is typically used in the output layer of a multi-class classification neural network?",
      options: ["Sigmoid", "ReLU", "Softmax", "Tanh"],
      answer: "Softmax",
    },
    {
      type: "single",
      question: "What does a dropout layer do in a neural network?",
      options: [
        "Increases learning rate",
        "Randomly ignores some neurons during training to prevent overfitting",
        "Adds extra features to the data",
        "Sorts the weights",
      ],
      answer:
        "Randomly ignores some neurons during training to prevent overfitting",
    },
    {
      type: "single",
      question: "What does CNN stand for?",
      options: [
        "Computer Neural Network",
        "Convolutional Neural Network",
        "Complex Neural Node",
        "Calculated Node Network",
      ],
      answer: "Convolutional Neural Network",
    },
    {
      type: "single",
      question:
        "What operation is primarily used in CNNs to extract features from images?",
      options: ["Addition", "Convolution", "Division", "Integration"],
      answer: "Convolution",
    },
    {
      type: "single",
      question:
        "Which pooling method selects the highest value from a feature map patch?",
      options: ["Average Pooling", "Min Pooling", "Max Pooling", "Sum Pooling"],
      answer: "Max Pooling",
    },
    {
      type: "single",
      question: "What problem do LSTMs solve in traditional RNNs?",
      options: [
        "Overfitting",
        "Vanishing gradient problem",
        "High memory usage",
        "Slow training speed",
      ],
      answer: "Vanishing gradient problem",
    },
    {
      type: "single",
      question: "Which algorithm is used for association rule mining?",
      options: ["K-Means", "Apriori", "PCA", "SVM"],
      answer: "Apriori",
    },
    {
      type: "single",
      question:
        "In reinforcement learning, what does the agent aim to maximize?",
      options: ["Loss", "Cumulative reward", "Error rate", "Number of steps"],
      answer: "Cumulative reward",
    },
    {
      type: "single",
      question:
        "What defines the environment's response to an agent's action in reinforcement learning?",
      options: ["Policy", "State and Reward", "Value function", "Q-table"],
      answer: "State and Reward",
    },
    {
      type: "single",
      question: "What does NLP stand for?",
      options: [
        "Neural Logic Programming",
        "Natural Language Processing",
        "Node Level Processing",
        "Numeric Learning Process",
      ],
      answer: "Natural Language Processing",
    },
    {
      type: "single",
      question:
        "Which technique converts words into dense vectors of real numbers?",
      options: ["Word Embedding", "Stemming", "Lemmatization", "Tokenization"],
      answer: "Word Embedding",
    },
    {
      type: "single",
      question:
        "Which metric evaluates the performance of a regression model by measuring the average squared difference between estimated and actual values?",
      options: ["MAE", "RMSE", "MSE", "R-squared"],
      answer: "MSE",
    },
    {
      type: "single",
      question:
        "What is the process of converting categorical data into a binary matrix called?",
      options: [
        "Label Encoding",
        "One-Hot Encoding",
        "Feature Scaling",
        "Normalization",
      ],
      answer: "One-Hot Encoding",
    },
    {
      type: "single",
      question:
        "What technique brings all numerical features to a similar scale without distorting differences in the ranges of values?",
      options: [
        "Encoding",
        "Imputation",
        "Normalization/Scaling",
        "Tokenization",
      ],
      answer: "Normalization/Scaling",
    },
    {
      type: "single",
      question: "What is an epoch in deep learning?",
      options: [
        "One forward pass of a single batch",
        "One forward pass of the entire dataset",
        "One forward and backward pass of the entire dataset",
        "The initialization of weights",
      ],
      answer: "One forward and backward pass of the entire dataset",
    },
    {
      type: "single",
      question:
        "What defines the size of the step the optimization algorithm takes towards the minimum of the loss function?",
      options: ["Batch size", "Learning rate", "Epoch", "Momentum"],
      answer: "Learning rate",
    },
    {
      type: "single",
      question: "Which of the following is a clustering evaluation metric?",
      options: ["F1-Score", "Silhouette Score", "R-squared", "Precision"],
      answer: "Silhouette Score",
    },
    {
      type: "single",
      question: "What does a high bias model usually suffer from?",
      options: [
        "Overfitting",
        "Underfitting",
        "High variance",
        "Perfect generalization",
      ],
      answer: "Underfitting",
    },
    {
      type: "single",
      question: "What does a high variance model usually suffer from?",
      options: [
        "Underfitting",
        "Overfitting",
        "High bias",
        "Low training accuracy",
      ],
      answer: "Overfitting",
    },
    {
      type: "single",
      question: "What is the tradeoff between bias and variance called?",
      options: [
        "Bias-Variance Tradeoff",
        "Over-Under Dilemma",
        "Error Minimization",
        "Model Tuning",
      ],
      answer: "Bias-Variance Tradeoff",
    },
    {
      type: "single",
      question:
        "Which algorithm finds the hyperplane that best separates two classes with the maximum margin?",
      options: ["Logistic Regression", "Decision Tree", "SVM", "KNN"],
      answer: "SVM",
    },
    {
      type: "single",
      question:
        "What trick does SVM use to transform data into a higher dimension?",
      options: [
        "Gradient trick",
        "Kernel trick",
        "Polynomial trick",
        "Dimensionality trick",
      ],
      answer: "Kernel trick",
    },
    {
      type: "single",
      question: "Which of the following is an anomaly detection algorithm?",
      options: ["Isolation Forest", "Linear Regression", "Apriori", "Word2Vec"],
      answer: "Isolation Forest",
    },
    {
      type: "single",
      question: "What is the primary output of a generative model?",
      options: [
        "Class labels",
        "New data samples resembling training data",
        "Clusters",
        "Dimensionality reduced vectors",
      ],
      answer: "New data samples resembling training data",
    },
    {
      type: "single",
      question:
        "Which architecture consists of a Generator and a Discriminator?",
      options: ["CNN", "RNN", "GAN", "Autoencoder"],
      answer: "GAN",
    },
    {
      type: "single",
      question:
        "In k-fold cross-validation, how many times is the model trained and evaluated?",
      options: ["1", "k-1", "k", "k+1"],
      answer: "k",
    },
    {
      type: "single",
      question:
        "Which hyperparameter search technique evaluates all possible combinations of provided hyperparameter values?",
      options: [
        "Random Search",
        "Grid Search",
        "Bayesian Optimization",
        "Gradient Descent",
      ],
      answer: "Grid Search",
    },
    {
      type: "single",
      question: "What is early stopping used for?",
      options: [
        "To speed up data loading",
        "To prevent underfitting",
        "To prevent overfitting by halting training when validation performance degrades",
        "To reduce the learning rate",
      ],
      answer:
        "To prevent overfitting by halting training when validation performance degrades",
    },
    {
      type: "single",
      question: "What is TF-IDF used for?",
      options: [
        "Image classification",
        "Text representation and feature extraction",
        "Audio processing",
        "Clustering numeric data",
      ],
      answer: "Text representation and feature extraction",
    },
    {
      type: "single",
      question:
        "Which term describes data that has not been seen by the model during training?",
      options: [
        "Validation/Test Data",
        "Training Data",
        "Feature Data",
        "Historical Data",
      ],
      answer: "Validation/Test Data",
    },
    {
      type: "single",
      question: "What is data leakage?",
      options: [
        "When data is lost from the database",
        "When information from outside the training dataset is used to create the model",
        "When memory limit is exceeded",
        "When data is unencrypted",
      ],
      answer:
        "When information from outside the training dataset is used to create the model",
    },
    {
      type: "single",
      question:
        "Which algorithm is a probabilistic classifier based on strong independence assumptions between features?",
      options: ["SVM", "Decision Tree", "Naive Bayes", "KNN"],
      answer: "Naive Bayes",
    },
    {
      type: "single",
      question:
        "Which clustering algorithm works by iteratively updating cluster centroids?",
      options: [
        "DBSCAN",
        "Hierarchical Clustering",
        "K-Means",
        "Gaussian Mixture Models",
      ],
      answer: "K-Means",
    },
    {
      type: "single",
      question:
        "Which clustering algorithm can find arbitrarily shaped clusters and is robust to outliers?",
      options: ["K-Means", "DBSCAN", "Agglomerative", "PCA"],
      answer: "DBSCAN",
    },
    {
      type: "single",
      question: "What is a dendrogram typically used to visualize?",
      options: [
        "Neural network architecture",
        "Decision Tree rules",
        "Hierarchical clustering results",
        "PCA components",
      ],
      answer: "Hierarchical clustering results",
    },
    {
      type: "single",
      question: "What is the vanishing gradient problem?",
      options: [
        "Gradients become too large and cause instability",
        "Gradients become extremely small, preventing weights from updating",
        "The model learns too fast",
        "The dataset is too small",
      ],
      answer:
        "Gradients become extremely small, preventing weights from updating",
    },
    {
      type: "single",
      question: "What does a target variable represent in supervised learning?",
      options: [
        "The input features",
        "The value or class to be predicted",
        "The learning rate",
        "The evaluation metric",
      ],
      answer: "The value or class to be predicted",
    },
    {
      type: "single",
      question: "Which of the following is an L1 regularization technique?",
      options: ["Ridge", "Lasso", "Elastic Net", "Dropout"],
      answer: "Lasso",
    },
    {
      type: "single",
      question: "Which of the following is an L2 regularization technique?",
      options: ["Ridge", "Lasso", "Elastic Net", "Dropout"],
      answer: "Ridge",
    },
    {
      type: "single",
      question: "What does the R-squared metric indicate?",
      options: [
        "The classification accuracy",
        "The proportion of variance in the dependent variable explained by the model",
        "The mean error",
        "The number of clusters",
      ],
      answer:
        "The proportion of variance in the dependent variable explained by the model",
    },
    {
      type: "single",
      question: "What is an autoencoder primarily used for?",
      options: [
        "Supervised classification",
        "Unsupervised representation learning and dimensionality reduction",
        "Reinforcement learning",
        "Text generation",
      ],
      answer:
        "Unsupervised representation learning and dimensionality reduction",
    },
    {
      type: "single",
      question: "What is the core component of a Transformer architecture?",
      options: [
        "Convolutional layers",
        "Self-attention mechanism",
        "Recurrent cells",
        "Pooling layers",
      ],
      answer: "Self-attention mechanism",
    },
    {
      type: "single",
      question: "Which model architecture is BERT based on?",
      options: ["RNN", "CNN", "Transformer", "GAN"],
      answer: "Transformer",
    },
    {
      type: "single",
      question: "What is data augmentation?",
      options: [
        "Increasing model layers",
        "Generating new training examples by applying transformations to existing data",
        "Deleting missing values",
        "Combining multiple datasets",
      ],
      answer:
        "Generating new training examples by applying transformations to existing data",
    },
    {
      type: "single",
      question: "What is a major advantage of XGBoost?",
      options: [
        "It doesn't require any parameters",
        "It handles missing values internally and is highly optimized",
        "It is an unsupervised algorithm",
        "It works directly on raw text without encoding",
      ],
      answer: "It handles missing values internally and is highly optimized",
    },
    {
      type: "single",
      question:
        "What is the process of handling missing values in a dataset called?",
      options: ["Encoding", "Imputation", "Scaling", "Extraction"],
      answer: "Imputation",
    },
    {
      type: "single",
      question:
        "Which metric combines Precision and Recall into a single score?",
      options: ["Accuracy", "ROC AUC", "F1-Score", "MSE"],
      answer: "F1-Score",
    },
    {
      type: "single",
      question: "In Q-Learning, what does the Q represent?",
      options: [
        "Quality of an action in a given state",
        "Quantity of rewards",
        "Queue length",
        "Quotient of states",
      ],
      answer: "Quality of an action in a given state",
    },
    {
      type: "single",
      question:
        "Which technique reduces the number of features by keeping only the most important ones?",
      options: [
        "Feature scaling",
        "Feature selection",
        "Feature encoding",
        "Feature generation",
      ],
      answer: "Feature selection",
    },
    {
      type: "single",
      question:
        "Which algorithm computes the distance between a new data point and all training data points?",
      options: ["Decision Tree", "Random Forest", "KNN", "Logistic Regression"],
      answer: "KNN",
    },
    {
      type: "single",
      question: "What does SMOTE do?",
      options: [
        "Removes outliers",
        "Generates synthetic examples for the minority class to handle imbalance",
        "Scales features",
        "Reduces dimensionality",
      ],
      answer:
        "Generates synthetic examples for the minority class to handle imbalance",
    },
    {
      type: "single",
      question: "Which of these is not a common kernel in SVM?",
      options: [
        "Linear",
        "Polynomial",
        "Radial Basis Function (RBF)",
        "Softmax",
      ],
      answer: "Softmax",
    },
    {
      type: "single",
      question:
        "Which part of an Autoencoder reduces the input data into a latent-space representation?",
      options: ["Decoder", "Encoder", "Bottleneck", "Output layer"],
      answer: "Encoder",
    },
    {
      type: "single",
      question: "What does a learning curve plot?",
      options: [
        "Model performance vs. training time or dataset size",
        "Accuracy vs. Precision",
        "True Positive Rate vs. False Positive Rate",
        "Loss vs. Weights",
      ],
      answer: "Model performance vs. training time or dataset size",
    },
    {
      type: "single",
      question:
        "In a decision tree, what is a node that does not split further called?",
      options: ["Root node", "Decision node", "Leaf node", "Internal node"],
      answer: "Leaf node",
    },
    {
      type: "single",
      question:
        "What metric is often used to decide the best split in a Decision Tree for classification?",
      options: [
        "Mean Squared Error",
        "Gini Impurity",
        "R-squared",
        "Cosine Similarity",
      ],
      answer: "Gini Impurity",
    },
    {
      type: "single",
      question:
        "What is the primary difference between a parameter and a hyperparameter?",
      options: [
        "Parameters are set by the user, hyperparameters are learned",
        "Parameters are learned by the model, hyperparameters are set by the user",
        "There is no difference",
        "Parameters are only used in Deep Learning",
      ],
      answer:
        "Parameters are learned by the model, hyperparameters are set by the user",
    },
    {
      type: "single",
      question:
        "Which optimization algorithm adapts the learning rate for each parameter?",
      options: ["Standard SGD", "Adam", "Batch Gradient Descent", "Momentum"],
      answer: "Adam",
    },
    {
      type: "single",
      question: "What is transfer learning?",
      options: [
        "Transferring data from one database to another",
        "Using a pre-trained model as a starting point for a new, related task",
        "Transferring weights from a CNN to an RNN",
        "Changing the programming language of a model",
      ],
      answer:
        "Using a pre-trained model as a starting point for a new, related task",
    },
    {
      type: "single",
      question: "Which is an example of a sequence-to-sequence task?",
      options: [
        "Image classification",
        "House price prediction",
        "Machine translation",
        "Clustering customers",
      ],
      answer: "Machine translation",
    },
    {
      type: "single",
      question: "What does the term 'latent space' refer to?",
      options: [
        "A physical server location",
        "A compressed, lower-dimensional representation of data",
        "The space between layers in a network",
        "Data that has been deleted",
      ],
      answer: "A compressed, lower-dimensional representation of data",
    },
    {
      type: "single",
      question: "What does the 'k' in k-fold cross-validation represent?",
      options: [
        "The number of features",
        "The number of folds or subsets the data is divided into",
        "The number of clusters",
        "The number of nearest neighbors",
      ],
      answer: "The number of folds or subsets the data is divided into",
    },
    {
      type: "single",
      question:
        "Which concept describes an agent taking action in an environment to maximize reward?",
      options: [
        "Supervised Learning",
        "Unsupervised Learning",
        "Reinforcement Learning",
        "Semi-supervised Learning",
      ],
      answer: "Reinforcement Learning",
    },
    {
      type: "single",
      question: "What does word2vec do?",
      options: [
        "Converts text into audio",
        "Represents words as dense vectors capturing semantic meaning",
        "Translates text between languages",
        "Classifies documents",
      ],
      answer: "Represents words as dense vectors capturing semantic meaning",
    },
    {
      type: "single",
      question: "Which of these is a generative model?",
      options: [
        "Random Forest",
        "Logistic Regression",
        "Variational Autoencoder (VAE)",
        "SVM",
      ],
      answer: "Variational Autoencoder (VAE)",
    },
    {
      type: "single",
      question: "What is the purpose of batch normalization?",
      options: [
        "To normalize the output of a network",
        "To normalize inputs of each layer to stabilize and accelerate training",
        "To combine multiple batches",
        "To clean messy data",
      ],
      answer:
        "To normalize inputs of each layer to stabilize and accelerate training",
    },
    {
      type: "single",
      question:
        "Which library is most commonly used for array operations in Python for ML?",
      options: ["Pandas", "Matplotlib", "NumPy", "Seaborn"],
      answer: "NumPy",
    },
    {
      type: "single",
      question:
        "Which library is a popular open-source machine learning framework developed by Google?",
      options: ["PyTorch", "TensorFlow", "Scikit-Learn", "Keras"],
      answer: "TensorFlow",
    },
    {
      type: "single",
      question:
        "What is the main purpose of the 'train_test_split' function in Scikit-Learn?",
      options: [
        "To split data into numeric and categorical features",
        "To divide data into a training set and a testing set",
        "To split images into pixels",
        "To divide a dataset into distinct clusters",
      ],
      answer: "To divide data into a training set and a testing set",
    },
    {
      type: "single",
      question: "What is 'zero-shot learning'?",
      options: [
        "A model learning with zero data",
        "A model making predictions on classes it has never seen during training",
        "Training a model in zero seconds",
        "Using zero parameters",
      ],
      answer:
        "A model making predictions on classes it has never seen during training",
    },
    {
      type: "single",
      question: "In a CNN, what does 'padding' do?",
      options: [
        "Adds artificial data to the dataset",
        "Adds zeros around the input border to preserve spatial dimensions after convolution",
        "Increases the learning rate",
        "Combines max and average pooling",
      ],
      answer:
        "Adds zeros around the input border to preserve spatial dimensions after convolution",
    },
    {
      type: "multi",
      question: "Which of the following are Supervised Learning algorithms?",
      options: ["Linear Regression", "K-Means", "Random Forest", "PCA"],
      answer: "Linear Regression, Random Forest",
    },
    {
      type: "multi",
      question: "Which of the following are Unsupervised Learning algorithms?",
      options: ["PCA", "K-Means", "SVM", "DBSCAN"],
      answer: "PCA, K-Means, DBSCAN",
    },
    {
      type: "multi",
      question: "Which are evaluation metrics for Classification?",
      options: ["Accuracy", "Mean Squared Error", "Precision", "F1-Score"],
      answer: "Accuracy, Precision, F1-Score",
    },
    {
      type: "multi",
      question: "Which are evaluation metrics for Regression?",
      options: ["Mean Absolute Error", "Accuracy", "R-squared", "Recall"],
      answer: "Mean Absolute Error, R-squared",
    },
    {
      type: "multi",
      question: "Which of the following are common activation functions?",
      options: ["ReLU", "Sigmoid", "Cosine", "Tanh"],
      answer: "ReLU, Sigmoid, Tanh",
    },
    {
      type: "multi",
      question: "Which are ensemble learning techniques?",
      options: ["Bagging", "Clustering", "Boosting", "Stacking"],
      answer: "Bagging, Boosting, Stacking",
    },
    {
      type: "multi",
      question:
        "Which algorithms can be used for both classification and regression?",
      options: [
        "Decision Trees",
        "K-Means",
        "Random Forest",
        "Support Vector Machines",
      ],
      answer: "Decision Trees, Random Forest, Support Vector Machines",
    },
    {
      type: "multi",
      question: "Which are techniques used to prevent overfitting?",
      options: [
        "Dropout",
        "Regularization",
        "Increasing model complexity",
        "Early Stopping",
      ],
      answer: "Dropout, Regularization, Early Stopping",
    },
    {
      type: "multi",
      question: "Which are hyperparameters of a Random Forest?",
      options: ["Number of trees", "Max depth", "Learning rate", "Weights"],
      answer: "Number of trees, Max depth",
    },
    {
      type: "multi",
      question: "Which are valid gradient descent optimization algorithms?",
      options: ["Adam", "RMSprop", "PCA", "Adagrad"],
      answer: "Adam, RMSprop, Adagrad",
    },
    {
      type: "multi",
      question: "Which of the following are types of Neural Networks?",
      options: ["CNN", "RNN", "KNN", "GAN"],
      answer: "CNN, RNN, GAN",
    },
    {
      type: "multi",
      question: "Which are methods for handling missing data?",
      options: [
        "Mean Imputation",
        "Dropping rows",
        "One-Hot Encoding",
        "Using algorithms that support missing values",
      ],
      answer:
        "Mean Imputation, Dropping rows, Using algorithms that support missing values",
    },
    {
      type: "multi",
      question: "Which are steps in text preprocessing for NLP?",
      options: ["Tokenization", "Stemming", "Pooling", "Stop-word removal"],
      answer: "Tokenization, Stemming, Stop-word removal",
    },
    {
      type: "multi",
      question: "Which are advantages of Decision Trees?",
      options: [
        "Easy to interpret",
        "Handle non-linear data",
        "Always prevent overfitting",
        "Require little data preprocessing",
      ],
      answer:
        "Easy to interpret, Handle non-linear data, Require little data preprocessing",
    },
    {
      type: "multi",
      question: "Which of the following are deep learning frameworks?",
      options: ["PyTorch", "TensorFlow", "Scikit-Learn", "Keras"],
      answer: "PyTorch, TensorFlow, Keras",
    },
    {
      type: "multi",
      question: "Which are distance metrics commonly used in KNN?",
      options: ["Euclidean", "Manhattan", "Minkowski", "Sigmoid"],
      answer: "Euclidean, Manhattan, Minkowski",
    },
    {
      type: "multi",
      question: "Which of the following are forms of cross-validation?",
      options: ["K-Fold", "Leave-One-Out", "Stratified K-Fold", "Grid Search"],
      answer: "K-Fold, Leave-One-Out, Stratified K-Fold",
    },
    {
      type: "multi",
      question: "Which are properties of the Sigmoid activation function?",
      options: [
        "Outputs between 0 and 1",
        "S-shaped curve",
        "Outputs between -1 and 1",
        "Prone to vanishing gradients",
      ],
      answer:
        "Outputs between 0 and 1, S-shaped curve, Prone to vanishing gradients",
    },
    {
      type: "multi",
      question:
        "Which components are typical in a Convolutional Neural Network?",
      options: [
        "Convolutional Layer",
        "Pooling Layer",
        "Fully Connected Layer",
        "Recurrent Layer",
      ],
      answer: "Convolutional Layer, Pooling Layer, Fully Connected Layer",
    },
    {
      type: "multi",
      question: "Which are applications of Reinforcement Learning?",
      options: [
        "Game playing (e.g., Chess, Go)",
        "Robotics control",
        "Stock market prediction",
        "Autonomous driving",
      ],
      answer:
        "Game playing (e.g., Chess, Go), Robotics control, Autonomous driving",
    },
    {
      type: "multi",
      question: "Which are common dimensionality reduction techniques?",
      options: ["PCA", "t-SNE", "LDA", "K-Means"],
      answer: "PCA, t-SNE, LDA",
    },
    {
      type: "multi",
      question: "Which of the following apply to Logistic Regression?",
      options: [
        "Used for classification",
        "Outputs a probability",
        "Uses a sigmoid function",
        "Cannot handle linearly separable data",
      ],
      answer:
        "Used for classification, Outputs a probability, Uses a sigmoid function",
    },
    {
      type: "multi",
      question: "Which are elements of a confusion matrix?",
      options: [
        "True Positives",
        "False Positives",
        "True Negatives",
        "Mean Error",
      ],
      answer: "True Positives, False Positives, True Negatives",
    },
    {
      type: "multi",
      question: "Which techniques deal with imbalanced datasets?",
      options: [
        "SMOTE",
        "Undersampling the majority class",
        "Oversampling the minority class",
        "Min-Max Scaling",
      ],
      answer:
        "SMOTE, Undersampling the majority class, Oversampling the minority class",
    },
    {
      type: "multi",
      question: "Which of these are tree-based algorithms?",
      options: ["Decision Tree", "Random Forest", "XGBoost", "SVM"],
      answer: "Decision Tree, Random Forest, XGBoost",
    },
    {
      type: "multi",
      question: "Which of the following use the concept of gradient descent?",
      options: [
        "Linear Regression",
        "Neural Networks",
        "Logistic Regression",
        "Naive Bayes",
      ],
      answer: "Linear Regression, Neural Networks, Logistic Regression",
    },
    {
      type: "multi",
      question: "Which are characteristics of the ReLU activation function?",
      options: [
        "Outputs 0 for negative inputs",
        "Helps mitigate vanishing gradient problem",
        "Computationally expensive",
        "Used mostly in hidden layers",
      ],
      answer:
        "Outputs 0 for negative inputs, Helps mitigate vanishing gradient problem, Used mostly in hidden layers",
    },
    {
      type: "multi",
      question: "Which algorithms rely on distance calculations?",
      options: ["KNN", "K-Means", "Decision Trees", "SVM"],
      answer: "KNN, K-Means, SVM",
    },
    {
      type: "multi",
      question: "Which of the following are types of generative models?",
      options: ["GANs", "VAEs", "Random Forest", "Autoregressive models"],
      answer: "GANs, VAEs, Autoregressive models",
    },
    {
      type: "multi",
      question: "Which are valid pooling operations in CNNs?",
      options: ["Max Pooling", "Average Pooling", "Min Pooling", "Sum Pooling"],
      answer: "Max Pooling, Average Pooling",
    },
    {
      type: "multi",
      question: "Which are core components of a GAN?",
      options: ["Generator", "Discriminator", "Encoder", "Decoder"],
      answer: "Generator, Discriminator",
    },
    {
      type: "multi",
      question: "Which metrics are used to evaluate cluster quality?",
      options: [
        "Silhouette Score",
        "Davies-Bouldin Index",
        "F1-Score",
        "Inertia (Within-cluster sum of squares)",
      ],
      answer:
        "Silhouette Score, Davies-Bouldin Index, Inertia (Within-cluster sum of squares)",
    },
    {
      type: "multi",
      question:
        "Which models are specifically designed to handle sequential data?",
      options: ["RNN", "LSTM", "CNN", "GRU"],
      answer: "RNN, LSTM, GRU",
    },
    {
      type: "multi",
      question: "Which are techniques used for hyperparameter tuning?",
      options: [
        "Grid Search",
        "Random Search",
        "Bayesian Optimization",
        "Backpropagation",
      ],
      answer: "Grid Search, Random Search, Bayesian Optimization",
    },
    {
      type: "multi",
      question: "Which of these terms are related to Decision Trees?",
      options: [
        "Information Gain",
        "Gini Impurity",
        "Entropy",
        "Learning Rate",
      ],
      answer: "Information Gain, Gini Impurity, Entropy",
    },
    {
      type: "multi",
      question: "Which features represent a High Bias model?",
      options: [
        "Underfitting",
        "Overly simplistic",
        "Performs well on training data",
        "High training error",
      ],
      answer: "Underfitting, Overly simplistic, High training error",
    },
    {
      type: "multi",
      question: "Which features represent a High Variance model?",
      options: [
        "Overfitting",
        "Captures noise as patterns",
        "High training error",
        "Poor generalization to test data",
      ],
      answer:
        "Overfitting, Captures noise as patterns, Poor generalization to test data",
    },
    {
      type: "multi",
      question: "Which techniques map words to vectors?",
      options: ["Word2Vec", "GloVe", "FastText", "ResNet"],
      answer: "Word2Vec, GloVe, FastText",
    },
    {
      type: "multi",
      question: "Which are valid loss functions for neural networks?",
      options: [
        "Cross-Entropy Loss",
        "Mean Squared Error",
        "Hinge Loss",
        "Accuracy",
      ],
      answer: "Cross-Entropy Loss, Mean Squared Error, Hinge Loss",
    },
    {
      type: "multi",
      question: "Which are true about Naive Bayes?",
      options: [
        "Based on Bayes' theorem",
        "Assumes feature independence",
        "Very fast to train",
        "Requires huge amounts of neural layers",
      ],
      answer:
        "Based on Bayes' theorem, Assumes feature independence, Very fast to train",
    },
    {
      type: "multi",
      question: "Which are standard steps in an ML pipeline?",
      options: [
        "Data Collection",
        "Data Preprocessing",
        "Model Training",
        "Hardware Manufacturing",
      ],
      answer: "Data Collection, Data Preprocessing, Model Training",
    },
    {
      type: "multi",
      question: "Which of the following are types of clustering?",
      options: [
        "Hierarchical",
        "Partitional (e.g., K-Means)",
        "Density-based",
        "Supervised",
      ],
      answer: "Hierarchical, Partitional (e.g., K-Means), Density-based",
    },
    {
      type: "multi",
      question: "Which of the following are variants of Gradient Descent?",
      options: [
        "Stochastic Gradient Descent",
        "Batch Gradient Descent",
        "Mini-batch Gradient Descent",
        "Linear Gradient Descent",
      ],
      answer:
        "Stochastic Gradient Descent, Batch Gradient Descent, Mini-batch Gradient Descent",
    },
    {
      type: "multi",
      question: "Which algorithms use the Kernel Trick?",
      options: ["SVM", "Kernel PCA", "Logistic Regression", "Decision Tree"],
      answer: "SVM, Kernel PCA",
    },
    {
      type: "multi",
      question: "Which architectures utilize Attention mechanisms?",
      options: ["Transformers", "BERT", "GPT", "Standard MLP"],
      answer: "Transformers, BERT, GPT",
    },
    {
      type: "multi",
      question: "Which methods are used for Feature Scaling?",
      options: [
        "Min-Max Normalization",
        "Standardization (Z-score)",
        "One-Hot Encoding",
        "Robust Scaling",
      ],
      answer:
        "Min-Max Normalization, Standardization (Z-score), Robust Scaling",
    },
    {
      type: "multi",
      question: "Which are true about the Learning Rate?",
      options: [
        "Controls step size during weight update",
        "If too high, model may diverge",
        "If too low, training takes too long",
        "Determines the number of layers",
      ],
      answer:
        "Controls step size during weight update, If too high, model may diverge, If too low, training takes too long",
    },
    {
      type: "multi",
      question: "Which terms apply to Reinforcement Learning?",
      options: ["Agent", "Environment", "Reward", "Label"],
      answer: "Agent, Environment, Reward",
    },
    {
      type: "multi",
      question: "Which algorithms create linear decision boundaries?",
      options: ["Logistic Regression", "Linear SVM", "Random Forest", "KNN"],
      answer: "Logistic Regression, Linear SVM",
    },
    {
      type: "multi",
      question: "Which are popular pre-trained CNN architectures?",
      options: ["ResNet", "VGG16", "Inception", "Word2Vec"],
      answer: "ResNet, VGG16, Inception",
    },
    {
      type: "fill",
      question: "In machine learning, SVM stands for Support ______ Machine.",
      answer: "Vector",
    },
    {
      type: "fill",
      question:
        "The process of predicting continuous numeric values is called ______.",
      answer: "Regression",
    },
    {
      type: "fill",
      question:
        "The process of predicting categorical labels is called ______.",
      answer: "Classification",
    },
    {
      type: "fill",
      question: "The abbreviation KNN stands for K-Nearest ______.",
      answer: "Neighbors",
    },
    {
      type: "fill",
      question: "In K-Means, the 'K' refers to the number of ______.",
      answer: "Clusters",
    },
    {
      type: "fill",
      question:
        "A model that performs well on training data but poorly on test data is said to be ______.",
      answer: "Overfitting",
    },
    {
      type: "fill",
      question:
        "A model that is too simple to capture the underlying patterns in data is said to be ______.",
      answer: "Underfitting",
    },
    {
      type: "fill",
      question:
        "The algorithm that combines multiple weak learners to create a strong learner sequentially is called ______.",
      answer: "Boosting",
    },
    {
      type: "fill",
      question:
        "An ensemble method that builds multiple independent decision trees and averages their results is called a Random ______.",
      answer: "Forest",
    },
    {
      type: "fill",
      question:
        "The algorithm used to update weights in a neural network by computing gradients backward from the output is ______.",
      answer: "Backpropagation",
    },
    {
      type: "fill",
      question:
        "The metric calculated as True Positives / (True Positives + False Positives) is ______.",
      answer: "Precision",
    },
    {
      type: "fill",
      question:
        "The metric calculated as True Positives / (True Positives + False Negatives) is ______.",
      answer: "Recall",
    },
    {
      type: "fill",
      question:
        "The harmonic mean of precision and recall is the ______-Score.",
      answer: "F1",
    },
    {
      type: "fill",
      question:
        "An epoch refers to one complete pass through the entire ______ dataset.",
      answer: "Training",
    },
    {
      type: "fill",
      question:
        "The hyperparameter that controls how much to change the model in response to the estimated error each time the model weights are updated is the ______ rate.",
      answer: "Learning",
    },
    {
      type: "fill",
      question: "CNN stands for ______ Neural Network.",
      answer: "Convolutional",
    },
    {
      type: "fill",
      question: "RNN stands for ______ Neural Network.",
      answer: "Recurrent",
    },
    {
      type: "fill",
      question:
        "In a CNN, the layer that reduces spatial dimensions is called a ______ layer.",
      answer: "Pooling",
    },
    {
      type: "fill",
      question:
        "The activation function that outputs exactly the input if it is positive, and zero otherwise, is ______.",
      answer: "ReLU",
    },
    {
      type: "fill",
      question:
        "The activation function typically used in the output layer for multi-class classification is ______.",
      answer: "Softmax",
    },
    {
      type: "fill",
      question:
        "A technique used to prevent overfitting by randomly setting a fraction of input units to 0 during training is called ______.",
      answer: "Dropout",
    },
    {
      type: "fill",
      question: "PCA stands for Principal ______ Analysis.",
      answer: "Component",
    },
    {
      type: "fill",
      question: "L1 regularization is also known as ______ regression.",
      answer: "Lasso",
    },
    {
      type: "fill",
      question: "L2 regularization is also known as ______ regression.",
      answer: "Ridge",
    },
    {
      type: "fill",
      question:
        "The branch of ML where an agent learns to make decisions by performing actions and receiving rewards is ______ Learning.",
      answer: "Reinforcement",
    },
    {
      type: "fill",
      question:
        "The table used to evaluate the performance of a classification model, showing true vs predicted values, is a ______ Matrix.",
      answer: "Confusion",
    },
    {
      type: "fill",
      question:
        "Variables that are determined before the learning process begins are called ______.",
      answer: "Hyperparameters",
    },
    {
      type: "fill",
      question:
        "The process of encoding categorical variables into binary vectors (0s and 1s) is called ______-hot encoding.",
      answer: "One",
    },
    {
      type: "fill",
      question:
        "In NLP, TF-IDF stands for Term Frequency-Inverse ______ Frequency.",
      answer: "Document",
    },
    {
      type: "fill",
      question: "The abbreviation GAN stands for Generative ______ Network.",
      answer: "Adversarial",
    },
    {
      type: "fill",
      question:
        "In a GAN, the network that tries to produce fake data is the ______.",
      answer: "Generator",
    },
    {
      type: "fill",
      question:
        "In a GAN, the network that tries to distinguish real data from fake data is the ______.",
      answer: "Discriminator",
    },
    {
      type: "fill",
      question:
        "The problem in deep networks where gradients get vanishingly small is the ______ gradient problem.",
      answer: "Vanishing",
    },
    {
      type: "fill",
      question:
        "The specialized RNN cell designed to combat the vanishing gradient problem is the ______.",
      answer: "LSTM",
    },
    {
      type: "fill",
      question:
        "The technique of using a model trained on one task as the starting point for a different but related task is ______ learning.",
      answer: "Transfer",
    },
    {
      type: "fill",
      question:
        "The function that computes the difference between predicted outputs and actual targets is the ______ function.",
      answer: "Loss",
    },
    {
      type: "fill",
      question:
        "The popular optimization algorithm that combines ideas from momentum and RMSprop is ______.",
      answer: "Adam",
    },
    {
      type: "fill",
      question:
        "The process of splitting data into 'k' chunks, training on k-1 chunks and testing on the remaining chunk iteratively, is called k-fold ______-validation.",
      answer: "Cross",
    },
    {
      type: "fill",
      question:
        "The process of finding the optimal hyperparameters by searching exhaustively through a manually specified subset of the hyperparameter space is called ______ Search.",
      answer: "Grid",
    },
    {
      type: "fill",
      question:
        "The unsupervised algorithm used to find frequent itemsets and association rules is ______.",
      answer: "Apriori",
    },
    {
      type: "fill",
      question:
        "In Decision Trees, the metric used to measure impurity (often used alongside Entropy) is the ______ Impurity.",
      answer: "Gini",
    },
    {
      type: "fill",
      question:
        "The process of scaling numerical features so they have a mean of 0 and standard deviation of 1 is called ______.",
      answer: "Standardization",
    },
    {
      type: "fill",
      question:
        "The process of scaling numerical features to lie between 0 and 1 is called Min-Max ______.",
      answer: "Normalization",
    },
    {
      type: "fill",
      question:
        "A neural network designed to learn efficient data codings in an unsupervised manner, consisting of an encoder and decoder, is an ______.",
      answer: "Autoencoder",
    },
    {
      type: "fill",
      question:
        "The core mechanism in Transformer architectures that allows the model to weigh the importance of different words is the ______ mechanism.",
      answer: "Attention",
    },
    {
      type: "fill",
      question:
        "The process of dealing with missing data by replacing them with substituted values (like mean or median) is called ______.",
      answer: "Imputation",
    },
    {
      type: "fill",
      question:
        "The type of learning where data does not have explicit labels is ______ learning.",
      answer: "Unsupervised",
    },
    {
      type: "fill",
      question:
        "The type of learning where the model trains on labeled data is ______ learning.",
      answer: "Supervised",
    },
    {
      type: "fill",
      question:
        "The technique of creating variations of training images (flipping, rotating) to prevent overfitting is called data ______.",
      answer: "Augmentation",
    },
    {
      type: "fill",
      question:
        "The ROC curve plots the True Positive Rate against the ______ Positive Rate.",
      answer: "False",
    },
  ],
};

const soption = document.querySelectorAll(".soption");
let mysingleanswer = null;
soption.forEach((a) => {
  a.addEventListener("click", () => {
    if (a.classList.contains("sactive")) {
      a.classList.remove("sactive");
      mysingleanswer = null;
      return;
    }

    soption.forEach((b) => b.classList.remove("sactive"));
    a.classList.add("sactive");
    mysingleanswer = a.textContent;
  });
});

const moption = document.querySelectorAll(".moption");
let mymultianswers = [];

moption.forEach((a) => {
  a.addEventListener("click", () => {
    if (a.classList.contains("mactive")) {
      a.classList.remove("mactive");

      mymultianswers = mymultianswers.filter((ans) => ans !== a.textContent);
    } else {
      a.classList.add("mactive");
      mymultianswers.push(a.textContent);
    }

    console.log(mymultianswers);
  });
});

function showFinalResult() {
  clearInterval(timerInterval);

  container2.style.display = "none";
  container1.style.display = "none";
  container3.style.display = "flex";

  let percentage = Math.round((score / selectedques) * 100);

  document.querySelector(".percent-text").textContent = percentage + "%";
  document.querySelector(".final-score").textContent = score;
  document.querySelector(".total-score").textContent = selectedques;
}

const reattemptBtn = document.querySelector(".reattempt-btn");
const container3 = document.querySelector(".container3");

reattemptBtn.addEventListener("click", () => {
  container3.style.display = "none";
  container2.style.display = "none";
  container1.style.display = "block";

  score = 0;
  questionIndex = 0;
});
