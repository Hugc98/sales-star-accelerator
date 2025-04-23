
export const sanitizeInput = (input: string): string => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

export const checkPasswordStrength = (password: string): {
  score: number;
  feedback: string;
} => {
  let score = 0;
  const feedback: string[] = [];
  
  if (password.length < 8) {
    feedback.push("A senha deve ter pelo menos 8 caracteres");
  } else {
    score += 1;
  }
  
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Inclua letras maiúsculas e minúsculas");
  }
  
  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push("Inclua pelo menos um número");
  }
  
  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Inclua pelo menos um caractere especial");
  }
  
  return {
    score,
    feedback: feedback.join(". "),
  };
};

